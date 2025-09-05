import { pool } from '../config/database';
import dotenv from 'dotenv';

dotenv.config();

async function checkAIStatus() {
  console.log('📊 Checking AI Analysis Status for All Applications...\n');

  try {
    const [applications] = await pool.execute(`
      SELECT 
        id, name, specialization, ai_analysis_status, ai_score, 
        ai_strengths, ai_weaknesses, resume_url, created_at
      FROM applications 
      ORDER BY created_at DESC
    `);
    
    const apps = applications as any[];
    console.log(`Found ${apps.length} total applications:\n`);

    apps.forEach((app, index) => {
      console.log(`${index + 1}. ${app.name} (${app.specialization})`);
      console.log(`   AI Status: ${app.ai_analysis_status || 'null'}`);
      console.log(`   AI Score: ${app.ai_score ? app.ai_score + '/100' : 'none'}`);
      console.log(`   Resume: ${app.resume_url ? 'Yes' : 'No'}`);
      
      if (app.ai_strengths) {
        try {
          const strengths = JSON.parse(app.ai_strengths);
          console.log(`   Strengths: ${strengths.length} identified`);
        } catch {
          console.log(`   Strengths: parsing error`);
        }
      }
      
      if (app.ai_weaknesses) {
        try {
          const weaknesses = JSON.parse(app.ai_weaknesses);
          console.log(`   Weaknesses: ${weaknesses.length} identified`);
        } catch {
          console.log(`   Weaknesses: parsing error`);
        }
      }
      
      console.log(`   Applied: ${new Date(app.created_at).toLocaleDateString()}`);
      console.log('');
    });

    // Summary
    const statusCounts = {
      pending: apps.filter(a => a.ai_analysis_status === 'pending').length,
      processing: apps.filter(a => a.ai_analysis_status === 'processing').length,
      completed: apps.filter(a => a.ai_analysis_status === 'completed').length,
      failed: apps.filter(a => a.ai_analysis_status === 'failed').length,
      null: apps.filter(a => !a.ai_analysis_status).length,
    };

    console.log('📈 Summary:');
    console.log(`   ✅ Completed: ${statusCounts.completed}`);
    console.log(`   ⏳ Pending: ${statusCounts.pending}`);
    console.log(`   🔄 Processing: ${statusCounts.processing}`);
    console.log(`   ❌ Failed: ${statusCounts.failed}`);
    console.log(`   ❓ No Status: ${statusCounts.null}`);

    const avgScore = apps
      .filter(a => a.ai_score)
      .reduce((sum, a) => sum + a.ai_score, 0) / apps.filter(a => a.ai_score).length;

    if (apps.filter(a => a.ai_score).length > 0) {
      console.log(`   📊 Average AI Score: ${Math.round(avgScore)}/100`);
    }

    console.log('\n✅ All applications have been processed! Check your admin dashboard.');

  } catch (error) {
    console.error('❌ Failed to check status:', error);
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  checkAIStatus();
}

export { checkAIStatus };
