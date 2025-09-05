import mysql from 'mysql2/promise';
import { createNoResumeAnalysis } from '../services/grokAI';

// Database configuration
const dbConfig = {
  host: 'srv1090.hstgr.io',
  user: 'u544973759_Aditya_Routh',
  password: 'W6F+*2R3qn>',
  database: 'u544973759_Aditya',
  port: 3306
};

interface Application {
  id: number;
  name: string;
  email: string;
  specialization: string;
  college: string;
  cgpa: number;
  skills: string;
  experience: string;
  ai_analysis_status: string;
  ai_score: number | null;
}

async function processNoResumeApplications() {
  let connection;
  
  try {
    console.log('🔄 Processing applications with no resume using professional analysis...\n');
    
    // Connect to database
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database');
    
    // Get applications with no resume and pending AI analysis
    const query = `
      SELECT id, name, email, specialization, college, cgpa, skills, experience, 
             ai_analysis_status, ai_score 
      FROM applications 
      WHERE (resume_url IS NULL OR resume_url = '')
      AND (ai_analysis_status IS NULL OR ai_analysis_status = 'pending')
      ORDER BY created_at DESC
    `;
    
    const [rows] = await connection.execute(query) as [Application[], any];
    
    if (rows.length === 0) {
      console.log('📭 No applications without resumes found that need processing');
      return;
    }
    
    console.log(`📋 Found ${rows.length} applications without resumes to process\n`);
    
    // Process each application
    for (const app of rows) {
      console.log(`🔍 Processing: ${app.name} (${app.specialization})`);
      console.log(`   Current Status: ${app.ai_analysis_status || 'pending'}, Score: ${app.ai_score || 'N/A'}`);
      console.log(`   🚫 No resume uploaded - using professional no-resume analysis`);
      
      try {
        // Parse skills from JSON string
        let skillsArray: string[] = [];
        try {
          skillsArray = JSON.parse(app.skills);
        } catch {
          skillsArray = app.skills.split(',').map(s => s.trim()).filter(s => s.length > 0);
        }
        
        // Generate no-resume analysis
        console.log('   📝 Generating professional no-resume analysis...');
        const result = createNoResumeAnalysis({
          name: app.name,
          specialization: app.specialization,
          college: app.college,
          cgpa: app.cgpa,
          skills: skillsArray,
          experience: app.experience
        });
        
        // Update database with analysis
        const updateQuery = `
          UPDATE applications 
          SET ai_score = ?, 
              ai_strengths = ?, 
              ai_weaknesses = ?, 
              ai_analysis_status = 'completed',
              updated_at = NOW()
          WHERE id = ?
        `;
        
        await connection.execute(updateQuery, [
          result.score,
          JSON.stringify(result.strengths),
          JSON.stringify(result.weaknesses),
          app.id
        ]);
        
        console.log(`   ✅ Professional analysis completed - Score: ${result.score}/100`);
        console.log(`   💪 Strengths: ${result.strengths.length} items - ${result.strengths[0].substring(0, 50)}...`);
        console.log(`   📝 Areas for improvement: ${result.weaknesses.length} items - Professional language used`);
        console.log(`   🎯 Predicted Role: ${result.prediction}`);
        console.log(`   📄 Note: Assessment based on application form data only`);
        
      } catch (error) {
        console.log(`   💥 Error processing: ${error instanceof Error ? error.message : 'Unknown error'}`);
        
        // Update status to failed
        await connection.execute(
          'UPDATE applications SET ai_analysis_status = ? WHERE id = ?',
          ['failed', app.id]
        );
      }
      
      console.log(''); // Empty line for readability
    }
    
    console.log('🎉 No-resume applications processing completed!');
    console.log('📝 All analyses use professional terminology:');
    console.log('   • "Resume not provided" instead of informal terms');
    console.log('   • "N/A" for missing information');
    console.log('   • Professional, constructive language throughout');
    
  } catch (error) {
    console.error('💥 Script failed:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔒 Database connection closed');
    }
  }
}

// Main execution
if (require.main === module) {
  processNoResumeApplications();
}

export { processNoResumeApplications };
