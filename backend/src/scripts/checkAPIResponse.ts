import { pool } from '../config/database';
import dotenv from 'dotenv';

dotenv.config();

async function checkAPIResponse() {
  console.log('🔍 Checking what the API is actually returning...\n');

  try {
    // Check what's in the database
    const [applications] = await pool.execute(`
      SELECT 
        id, name, specialization, ai_analysis_status, ai_score, 
        ai_strengths, ai_weaknesses, ai_prediction, resume_url
      FROM applications 
      WHERE ai_score IS NOT NULL
      ORDER BY created_at DESC
      LIMIT 5
    `);
    
    const apps = applications as any[];
    console.log(`📊 Database contains ${apps.length} applications with AI scores:\n`);

    apps.forEach((app, index) => {
      console.log(`${index + 1}. ${app.name}`);
      console.log(`   ID: ${app.id}`);
      console.log(`   AI Status: ${app.ai_analysis_status}`);
      console.log(`   AI Score: ${app.ai_score}`);
      console.log(`   AI Strengths: ${app.ai_strengths ? 'Present' : 'Missing'}`);
      console.log(`   AI Weaknesses: ${app.ai_weaknesses ? 'Present' : 'Missing'}`);
      console.log(`   AI Prediction: ${app.ai_prediction ? 'Present' : 'Missing'}`);
      console.log('');
    });

    // Now let's simulate what the API would return
    if (apps.length > 0) {
      const sampleApp = apps[0];
      console.log('🔧 Processing sample application like the API would:\n');
      
      const processedApp = {
        ...sampleApp,
        skills: sampleApp.skills ? JSON.parse(sampleApp.skills) : [],
        ai_strengths: sampleApp.ai_strengths ? JSON.parse(sampleApp.ai_strengths) : [],
        ai_weaknesses: sampleApp.ai_weaknesses ? JSON.parse(sampleApp.ai_weaknesses) : []
      };
      
      console.log('Sample processed application object:');
      console.log(JSON.stringify(processedApp, null, 2));
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  checkAPIResponse();
}

export { checkAPIResponse };
