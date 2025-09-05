import { pool } from '../config/database';
import { analyzeResumeFromFile, createFallbackAnalysis, AIAnalysisResult, ResumeAnalysisRequest } from './grokAI';
import path from 'path';

export interface AnalysisJob {
  applicationId: string;
  filePath: string;
  candidateInfo: ResumeAnalysisRequest['candidateInfo'];
}

// In-memory queue for simplicity (in production, consider using Redis Queue or similar)
class AIAnalysisQueue {
  private queue: AnalysisJob[] = [];
  private processing: boolean = false;
  private processingInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.startProcessing();
  }

  /**
   * Add a job to the analysis queue
   */
  addJob(job: AnalysisJob) {
    console.log(`Adding AI analysis job for application: ${job.applicationId}`);
    this.queue.push(job);
    
    // Update status to processing
    this.updateAnalysisStatus(job.applicationId, 'processing');
  }

  /**
   * Start the background processing
   */
  private startProcessing() {
    if (this.processingInterval) {
      return;
    }

    this.processingInterval = setInterval(async () => {
      if (!this.processing && this.queue.length > 0) {
        await this.processNext();
      }
    }, 5000); // Check every 5 seconds

    console.log('AI Analysis Queue: Background processing started');
  }

  /**
   * Stop the background processing
   */
  stopProcessing() {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
    }
    console.log('AI Analysis Queue: Background processing stopped');
  }

  /**
   * Process the next job in the queue
   */
  private async processNext() {
    if (this.queue.length === 0) {
      return;
    }

    this.processing = true;
    const job = this.queue.shift()!;

    try {
      console.log(`Processing AI analysis for application: ${job.applicationId}`);
      
      // Perform AI analysis
      const analysisResult = await this.performAnalysis(job);
      
      // Store results in database
      await this.storeAnalysisResults(job.applicationId, analysisResult);
      
      console.log(`AI analysis completed for application: ${job.applicationId}, Score: ${analysisResult.score}`);
      
    } catch (error) {
      console.error(`AI analysis failed for application: ${job.applicationId}`, error);
      
      // Create fallback analysis
      const fallbackResult = createFallbackAnalysis(job.candidateInfo);
      await this.storeAnalysisResults(job.applicationId, fallbackResult);
      
    } finally {
      this.processing = false;
    }
  }

  /**
   * Perform the actual AI analysis
   */
  private async performAnalysis(job: AnalysisJob): Promise<AIAnalysisResult> {
    try {
      // Get the full path to the uploaded file
      const uploadDir = process.env.UPLOAD_PATH || './uploads';
      const fullFilePath = path.join(uploadDir, path.basename(job.filePath));
      
      console.log(`Analyzing resume file: ${fullFilePath}`);
      
      // Perform AI analysis
      const result = await analyzeResumeFromFile(fullFilePath, job.candidateInfo);
      
      if (!result.success) {
        console.warn('AI analysis failed, creating fallback analysis');
        return createFallbackAnalysis(job.candidateInfo);
      }
      
      return result;
      
    } catch (error) {
      console.error('Error during AI analysis:', error);
      return createFallbackAnalysis(job.candidateInfo);
    }
  }

  /**
   * Store analysis results in database
   */
  private async storeAnalysisResults(applicationId: string, result: AIAnalysisResult) {
    try {
      const query = `
        UPDATE applications 
        SET 
          ai_score = ?,
          ai_strengths = ?,
          ai_weaknesses = ?,
          ai_prediction = ?,
          ai_analysis_status = 'completed',
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;

      const values = [
        result.score,
        JSON.stringify(result.strengths),
        JSON.stringify(result.weaknesses),
        result.analysisDetails,
        applicationId
      ];

      await pool.execute(query, values);
      
      console.log(`Analysis results stored for application: ${applicationId}`);
      
    } catch (error) {
      console.error(`Failed to store analysis results for application: ${applicationId}`, error);
      
      // Mark as failed in database
      await this.updateAnalysisStatus(applicationId, 'failed');
    }
  }

  /**
   * Update analysis status in database
   */
  private async updateAnalysisStatus(applicationId: string, status: 'pending' | 'processing' | 'completed' | 'failed') {
    try {
      const query = `
        UPDATE applications 
        SET ai_analysis_status = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;
      
      await pool.execute(query, [status, applicationId]);
      
    } catch (error) {
      console.error(`Failed to update analysis status for application: ${applicationId}`, error);
    }
  }

  /**
   * Get queue status
   */
  getStatus() {
    return {
      queueLength: this.queue.length,
      processing: this.processing,
      isRunning: this.processingInterval !== null
    };
  }

  /**
   * Clear all jobs (for testing/debugging)
   */
  clearQueue() {
    this.queue = [];
    console.log('AI Analysis Queue: Queue cleared');
  }
}

// Create singleton instance
export const aiAnalysisQueue = new AIAnalysisQueue();

/**
 * Helper function to queue AI analysis for an application
 */
export async function queueResumeAnalysis(
  applicationId: string,
  filePath: string,
  candidateInfo: ResumeAnalysisRequest['candidateInfo']
) {
  const job: AnalysisJob = {
    applicationId,
    filePath,
    candidateInfo
  };

  aiAnalysisQueue.addJob(job);
}

/**
 * Get analysis status for an application
 */
export async function getAnalysisStatus(applicationId: string): Promise<string | null> {
  try {
    const query = 'SELECT ai_analysis_status FROM applications WHERE id = ?';
    const [results] = await pool.execute(query, [applicationId]);
    const applications = results as any[];
    
    if (applications.length > 0) {
      return applications[0].ai_analysis_status;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting analysis status:', error);
    return null;
  }
}

/**
 * Manually trigger analysis for existing applications (utility function)
 */
export async function retriggerAnalysisForApplication(applicationId: string) {
  try {
    const query = `
      SELECT name, college, specialization, cgpa, skills, experience, resume_url
      FROM applications 
      WHERE id = ? AND resume_url IS NOT NULL
    `;
    
    const [results] = await pool.execute(query, [applicationId]);
    const applications = results as any[];
    
    if (applications.length === 0) {
      throw new Error('Application not found or no resume uploaded');
    }
    
    const app = applications[0];
    
    // Parse skills
    const skills = app.skills ? JSON.parse(app.skills) : [];
    
    const candidateInfo: ResumeAnalysisRequest['candidateInfo'] = {
      name: app.name,
      college: app.college,
      specialization: app.specialization,
      cgpa: app.cgpa,
      skills,
      experience: app.experience
    };
    
    // Queue for analysis
    await queueResumeAnalysis(applicationId, app.resume_url, candidateInfo);
    
    console.log(`Re-triggered analysis for application: ${applicationId}`);
    
  } catch (error) {
    console.error('Error re-triggering analysis:', error);
    throw error;
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('Shutting down AI Analysis Queue...');
  aiAnalysisQueue.stopProcessing();
});

process.on('SIGINT', () => {
  console.log('Shutting down AI Analysis Queue...');
  aiAnalysisQueue.stopProcessing();
});
