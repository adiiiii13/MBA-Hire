import { pool } from '../config/database';
import { aiAnalysisQueue, retriggerAnalysisForApplication } from '../services/aiAnalysisQueue';
import dotenv from 'dotenv';

dotenv.config();

async function debugAIQueue() {
  console.log('🔍 Debugging AI Analysis Queue...\n');

  try {
    // 1. Check queue status
    console.log('1. Checking queue status:');
    const queueStatus = aiAnalysisQueue.getStatus();
    console.log(`   Queue length: ${queueStatus.queueLength}`);
    console.log(`   Currently processing: ${queueStatus.processing}`);
    console.log(`   Queue running: ${queueStatus.isRunning}`);

    // 2. Check database for pending analyses
    console.log('\n2. Checking database for pending AI analyses:');
    const [pendingResults] = await pool.execute(`
      SELECT id, name, ai_analysis_status, resume_url, created_at
      FROM applications 
      WHERE ai_analysis_status IN ('pending', 'processing')
      ORDER BY created_at DESC
    `);
    
    const pendingApps = pendingResults as any[];
    console.log(`   Found ${pendingApps.length} applications with pending/processing status:`);
    
    pendingApps.forEach((app, index) => {
      console.log(`   ${index + 1}. ${app.name} (ID: ${app.id})`);
      console.log(`      Status: ${app.ai_analysis_status}`);
      console.log(`      Resume: ${app.resume_url ? 'Yes' : 'No'}`);
      console.log(`      Created: ${app.created_at}`);
      console.log('');
    });

    // 3. Check environment variables
    console.log('3. Checking environment variables:');
    console.log(`   GROK_API_KEY: ${process.env.GROK_API_KEY ? 'Set ✅' : 'Missing ❌'}`);
    console.log(`   UPLOAD_PATH: ${process.env.UPLOAD_PATH || './uploads (default)'}`);

    // 4. Check if uploads directory exists
    console.log('\n4. Checking uploads directory:');
    const fs = require('fs');
    const uploadDir = process.env.UPLOAD_PATH || './uploads';
    const uploadsExist = fs.existsSync(uploadDir);
    console.log(`   Directory exists: ${uploadsExist ? 'Yes ✅' : 'No ❌'}`);
    
    if (uploadsExist) {
      const files = fs.readdirSync(uploadDir);
      console.log(`   Files in uploads: ${files.length}`);
      if (files.length > 0) {
        console.log('   Recent files:');
        files.slice(0, 5).forEach((file: string) => {
          console.log(`   - ${file}`);
        });
      }
    }

    // 5. Test basic connectivity
    console.log('\n5. Testing basic connectivity:');
    try {
      const axios = require('axios');
      const testResponse = await axios.get('https://api.x.ai', { timeout: 5000 });
      console.log('   Grok API base URL reachable: ✅');
    } catch (error: any) {
      console.log('   Grok API base URL test: ❌');
      console.log(`   Error: ${error.message || error}`);
    }

    // 6. Offer to retrigger analysis
    if (pendingApps.length > 0) {
      console.log('\n6. Options to fix:');
      console.log('   a) Restart the server to restart the queue');
      console.log('   b) Manually retrigger analysis for stuck applications');
      console.log('   c) Check server logs for errors');
      
      // Ask if user wants to retrigger the first pending application
      const firstPending = pendingApps[0];
      console.log(`\n   Would you like to retrigger analysis for "${firstPending.name}"?`);
      console.log('   (This will attempt to process the analysis again)');
    }

    console.log('\n7. Recommended next steps:');
    console.log('   1. Check your backend server logs for errors');
    console.log('   2. Ensure the server is running and the queue started');
    console.log('   3. Verify the Grok API key is correct');
    console.log('   4. Restart the server if needed');
    console.log('   5. Try submitting a new application to test');

  } catch (error) {
    console.error('❌ Debug script failed:', error);
  } finally {
    await pool.end();
  }
}

// Function to manually retrigger analysis
async function manualRetrigger(applicationId?: string) {
  try {
    if (!applicationId) {
      // Get first pending application
      const [results] = await pool.execute(`
        SELECT id FROM applications 
        WHERE ai_analysis_status IN ('pending', 'processing') 
        AND resume_url IS NOT NULL
        ORDER BY created_at DESC LIMIT 1
      `);
      
      const apps = results as any[];
      if (apps.length === 0) {
        console.log('No pending applications found to retrigger.');
        return;
      }
      applicationId = apps[0].id;
    }

    console.log(`🔄 Retriggering analysis for application: ${applicationId}`);
    await retriggerAnalysisForApplication(applicationId!);
    console.log('✅ Analysis retriggered successfully!');
    console.log('Check the server logs and refresh the admin panel in a few moments.');

  } catch (error) {
    console.error('❌ Failed to retrigger analysis:', error);
  } finally {
    await pool.end();
  }
}

// Run based on command line arguments
const args = process.argv.slice(2);
if (args[0] === 'retrigger') {
  manualRetrigger(args[1]);
} else {
  debugAIQueue();
}

export { debugAIQueue, manualRetrigger };
