import mysql from 'mysql2/promise';
import path from 'path';
import fs from 'fs';
import { analyzeResumeFromFile } from '../services/grokAI';

// Database configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'Aditya10052004',
  database: 'mba_internship',
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
  resume_file: string;
  ai_analysis_status: string;
  ai_score: number | null;
}

async function reprocessResumes() {
  let connection;
  
  try {
    console.log('🔄 Starting resume reprocessing with improved extraction...\n');
    
    // Connect to database
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database');
    
    // Get applications with resumes that need reprocessing
    const query = `
      SELECT id, name, email, specialization, college, cgpa, skills, experience, 
             resume_file, ai_analysis_status, ai_score 
      FROM applications 
      WHERE resume_file IS NOT NULL 
      AND resume_file != ''
      ORDER BY created_at DESC
    `;
    
    const [rows] = await connection.execute(query) as [Application[], any];
    
    if (rows.length === 0) {
      console.log('📭 No applications with resumes found');
      return;
    }
    
    console.log(`📋 Found ${rows.length} applications with resumes\n`);
    
    // Process each application
    for (const app of rows) {
      console.log(`🔍 Processing: ${app.name} (${app.specialization})`);
      console.log(`   Current Status: ${app.ai_analysis_status}, Score: ${app.ai_score || 'N/A'}`);
      
      // Check if resume file exists
      const resumePath = path.join(__dirname, '../../uploads', app.resume_file);
      if (!fs.existsSync(resumePath)) {
        console.log(`   ❌ Resume file not found: ${app.resume_file}`);
        continue;
      }
      
      try {
        // Parse skills from JSON string
        let skillsArray: string[] = [];
        try {
          skillsArray = JSON.parse(app.skills);
        } catch {
          skillsArray = app.skills.split(',').map(s => s.trim());
        }
        
        // Analyze resume with improved extraction
        console.log('   🤖 Running improved AI analysis...');
        const result = await analyzeResumeFromFile(resumePath, {
          name: app.name,
          specialization: app.specialization,
          college: app.college,
          cgpa: app.cgpa,
          skills: skillsArray,
          experience: app.experience
        });
        
        // Log validation results if available
        if (result.validation) {
          console.log(`   📊 Validation: Valid=${result.validation.isValid}, Confidence=${result.validation.confidence}%, Match=${result.validation.matchScore}%`);
          if (result.validation.issues.length > 0) {
            console.log(`   ⚠️  Issues: ${result.validation.issues.join(', ')}`);
          }
        }
        
        // Update database with new analysis
        const updateQuery = `
          UPDATE applications 
          SET ai_score = ?, 
              ai_strengths = ?, 
              ai_weaknesses = ?, 
              ai_analysis_status = ?,
              updated_at = NOW()
          WHERE id = ?
        `;
        
        const status = result.success ? 'completed' : 'failed';
        await connection.execute(updateQuery, [
          result.score,
          JSON.stringify(result.strengths),
          JSON.stringify(result.weaknesses),
          status,
          app.id
        ]);
        
        if (result.success) {
          console.log(`   ✅ Analysis completed - Score: ${result.score}/100`);
          console.log(`   💪 Strengths: ${result.strengths.length} items`);
          console.log(`   ⚠️  Weaknesses: ${result.weaknesses.length} items`);
          console.log(`   🎯 Predicted Role: ${result.prediction}`);
        } else {
          console.log(`   ❌ Analysis failed: ${result.error}`);
        }
        
      } catch (error) {
        console.log(`   💥 Error processing: ${error instanceof Error ? error.message : 'Unknown error'}`);\n        
        // Update status to failed
        await connection.execute(\n          'UPDATE applications SET ai_analysis_status = ? WHERE id = ?',\n          ['failed', app.id]\n        );
      }
      
      console.log(''); // Empty line for readability
    }
    
    console.log('🎉 Resume reprocessing completed!');
    
  } catch (error) {
    console.error('💥 Script failed:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔒 Database connection closed');
    }
  }
}

// Add option to process specific application
async function reprocessSpecificResume(applicationId: number) {
  let connection;
  
  try {
    console.log(`🔄 Reprocessing specific application ID: ${applicationId}\n`);
    
    connection = await mysql.createConnection(dbConfig);
    
    const query = `
      SELECT id, name, email, specialization, college, cgpa, skills, experience, 
             resume_file, ai_analysis_status, ai_score 
      FROM applications 
      WHERE id = ? AND resume_file IS NOT NULL AND resume_file != ''
    `;
    
    const [rows] = await connection.execute(query, [applicationId]) as [Application[], any];
    
    if (rows.length === 0) {
      console.log('📭 Application not found or has no resume');
      return;
    }
    
    const app = rows[0];
    console.log(`🔍 Processing: ${app.name} (${app.specialization})`);
    
    const resumePath = path.join(__dirname, '../../uploads', app.resume_file);
    if (!fs.existsSync(resumePath)) {
      console.log(`❌ Resume file not found: ${app.resume_file}`);
      return;
    }
    
    let skillsArray: string[] = [];
    try {
      skillsArray = JSON.parse(app.skills);
    } catch {
      skillsArray = app.skills.split(',').map(s => s.trim());
    }
    
    const result = await analyzeResumeFromFile(resumePath, {
      name: app.name,
      specialization: app.specialization,
      college: app.college,
      cgpa: app.cgpa,
      skills: skillsArray,
      experience: app.experience
    });
    
    if (result.validation) {
      console.log(`📊 Validation: Valid=${result.validation.isValid}, Confidence=${result.validation.confidence}%, Match=${result.validation.matchScore}%`);
      if (result.validation.issues.length > 0) {
        console.log(`⚠️  Issues: ${result.validation.issues.join(', ')}`);
      }
    }
    
    const updateQuery = `
      UPDATE applications 
      SET ai_score = ?, 
          ai_strengths = ?, 
          ai_weaknesses = ?, 
          ai_analysis_status = ?,
          updated_at = NOW()
      WHERE id = ?
    `;
    
    const status = result.success ? 'completed' : 'failed';
    await connection.execute(updateQuery, [
      result.score,
      JSON.stringify(result.strengths),
      JSON.stringify(result.weaknesses),
      status,
      app.id
    ]);
    
    if (result.success) {
      console.log(`✅ Analysis completed - Score: ${result.score}/100`);
      console.log(`💪 Strengths: ${result.strengths.join(', ')}`);
      console.log(`⚠️  Weaknesses: ${result.weaknesses.join(', ')}`);
      console.log(`🎯 Predicted Role: ${result.prediction}`);
    } else {
      console.log(`❌ Analysis failed: ${result.error}`);
    }
    
  } catch (error) {
    console.error('💥 Specific reprocessing failed:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length > 0 && args[0] === '--id' && args[1]) {
    const applicationId = parseInt(args[1]);
    if (!isNaN(applicationId)) {
      reprocessSpecificResume(applicationId);
    } else {
      console.log('❌ Invalid application ID provided');
    }
  } else {
    reprocessResumes();
  }
}

export { reprocessResumes, reprocessSpecificResume };
