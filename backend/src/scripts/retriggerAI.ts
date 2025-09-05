import { pool } from '../config/database';
import { queueResumeAnalysis } from '../services/aiAnalysisQueue';
import dotenv from 'dotenv';

dotenv.config();

async function retriggerAIForAll() {
  console.log('🔄 Retriggering AI analysis for existing applications...\n');

  try {
    // Find all applications with resumes that don't have AI analysis yet
    console.log('1. Finding applications that need AI analysis...');
    const [applications] = await pool.execute(`
      SELECT id, name, college, specialization, cgpa, skills, experience, resume_url, ai_analysis_status
      FROM applications 
      WHERE resume_url IS NOT NULL 
      AND (ai_analysis_status IS NULL OR ai_analysis_status = 'pending')
      ORDER BY created_at DESC
    `);
    
    const apps = applications as any[];
    console.log(`   Found ${apps.length} applications that need AI analysis:`);

    if (apps.length === 0) {
      console.log('   No applications found that need AI analysis.');
      return;
    }

    // List the applications
    apps.forEach((app, index) => {
      console.log(`   ${index + 1}. ${app.name} - ${app.specialization} (${app.college})`);
      console.log(`      Status: ${app.ai_analysis_status || 'null'}, Resume: ${app.resume_url ? 'Yes' : 'No'}`);
    });

    console.log('\n2. Queuing AI analysis for these applications...');
    
    let successCount = 0;
    let errorCount = 0;

    for (const app of apps) {
      try {
        // Parse skills if they exist
        let skills: string[] = [];
        if (app.skills) {
          try {
            skills = JSON.parse(app.skills);
          } catch {
            // If JSON parsing fails, split by comma
            skills = app.skills.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0);
          }
        }

        const candidateInfo = {
          name: app.name,
          college: app.college,
          specialization: app.specialization,
          cgpa: parseFloat(app.cgpa) || 0,
          skills,
          experience: app.experience || 'No experience provided.'
        };

        // Queue for AI analysis
        await queueResumeAnalysis(app.id, app.resume_url, candidateInfo);
        console.log(`   ✅ Queued: ${app.name}`);
        successCount++;

      } catch (error: any) {
        console.error(`   ❌ Failed to queue ${app.name}: ${error.message}`);
        errorCount++;
      }
    }

    console.log(`\n3. Summary:`);
    console.log(`   ✅ Successfully queued: ${successCount}`);
    console.log(`   ❌ Failed to queue: ${errorCount}`);
    console.log(`   📊 Total processed: ${successCount + errorCount}`);

    if (successCount > 0) {
      console.log('\n🎉 AI analysis has been queued for the applications!');
      console.log('\nNext steps:');
      console.log('1. Make sure your backend server is running');
      console.log('2. Check server logs for AI analysis progress');
      console.log('3. Refresh admin dashboard in a few minutes to see results');
      console.log('4. The analysis queue processes one application every 5 seconds');
      console.log(`5. Expected completion time: ~${Math.ceil(successCount * 5 / 60)} minutes`);
    }

  } catch (error) {
    console.error('❌ Script failed:', error);
  } finally {
    // Don't close the pool here as the queue might be using it
    // await pool.end();
    console.log('\n📝 Note: Keep your backend server running for the AI analysis to complete.');
  }
}

// Function to retrigger specific application
async function retriggerSpecific(applicationId: string) {
  console.log(`🔄 Retriggering AI analysis for application: ${applicationId}\n`);

  try {
    const [applications] = await pool.execute(`
      SELECT id, name, college, specialization, cgpa, skills, experience, resume_url
      FROM applications 
      WHERE id = ? AND resume_url IS NOT NULL
    `, [applicationId]);
    
    const apps = applications as any[];
    
    if (apps.length === 0) {
      console.log('❌ Application not found or no resume uploaded.');
      return;
    }

    const app = apps[0];
    
    // Parse skills
    let skills: string[] = [];
    if (app.skills) {
      try {
        skills = JSON.parse(app.skills);
      } catch {
        skills = app.skills.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0);
      }
    }

    const candidateInfo = {
      name: app.name,
      college: app.college,
      specialization: app.specialization,
      cgpa: parseFloat(app.cgpa) || 0,
      skills,
      experience: app.experience || 'No experience provided.'
    };

    await queueResumeAnalysis(app.id, app.resume_url, candidateInfo);
    console.log('✅ AI analysis queued successfully!');
    console.log('Check your server logs and admin dashboard in a few minutes.');

  } catch (error) {
    console.error('❌ Failed to retrigger analysis:', error);
  } finally {
    // Don't close the pool here as the queue might be using it
  }
}

// Run based on command line arguments
const args = process.argv.slice(2);
if (args[0] === 'specific' && args[1]) {
  retriggerSpecific(args[1]);
} else if (args[0] === 'all') {
  retriggerAIForAll();
} else {
  console.log('Usage:');
  console.log('  npm run retrigger-ai all          # Retrigger for all pending applications');
  console.log('  npm run retrigger-ai specific <id> # Retrigger for specific application');
  console.log('');
  console.log('Or run directly:');
  console.log('  npx ts-node src/scripts/retriggerAI.ts all');
  console.log('  npx ts-node src/scripts/retriggerAI.ts specific <application-id>');
}

export { retriggerAIForAll, retriggerSpecific };
