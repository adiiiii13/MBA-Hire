import { extractTextFromFile } from '../utils/textExtraction';
import { pool } from '../config/database';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

async function checkResumeContent() {
  console.log('📄 Checking Resume Content...\n');

  try {
    // Get applications with resumes
    const [applications] = await pool.execute(`
      SELECT id, name, specialization, resume_url, ai_analysis_status, ai_score
      FROM applications 
      WHERE resume_url IS NOT NULL
      ORDER BY created_at DESC
    `);
    
    const apps = applications as any[];
    console.log(`Found ${apps.length} applications with resumes:\n`);

    for (const app of apps) {
      console.log(`📋 Analyzing: ${app.name} (${app.specialization})`);
      console.log(`   Current AI Status: ${app.ai_analysis_status}`);
      console.log(`   Current AI Score: ${app.ai_score || 'none'}`);
      
      // Get the actual file path
      const uploadDir = process.env.UPLOAD_PATH || './uploads';
      const filename = path.basename(app.resume_url);
      const fullPath = path.join(uploadDir, filename);
      
      console.log(`   Resume File: ${filename}`);
      
      if (fs.existsSync(fullPath)) {
        console.log('   ✅ File exists');
        
        // Extract text from the resume
        console.log('   🔍 Extracting text...');
        const extraction = await extractTextFromFile(fullPath);
        
        if (extraction.success) {
          console.log(`   ✅ Text extracted successfully (${extraction.wordCount} words)`);
          
          // Show first 300 characters of extracted text
          const preview = extraction.text.substring(0, 300);
          console.log('   📝 Text Preview:');
          console.log('   ' + '─'.repeat(50));
          console.log('   ' + preview.replace(/\n/g, '\n   '));
          if (extraction.text.length > 300) {
            console.log('   ... (truncated)');
          }
          console.log('   ' + '─'.repeat(50));
          
          // Check if the specialization matches what's in the form vs resume
          const lowerText = extraction.text.toLowerCase();
          const formSpec = app.specialization.toLowerCase();
          
          console.log(`   🎯 Form Specialization: ${app.specialization}`);
          
          // Look for business-related terms
          const businessTerms = ['business', 'finance', 'marketing', 'management', 'economics', 'accounting'];
          const foundTerms = businessTerms.filter(term => lowerText.includes(term));
          
          if (foundTerms.length > 0) {
            console.log(`   📊 Business terms found: ${foundTerms.join(', ')}`);
          } else {
            console.log('   ⚠️ No business terms found in resume');
          }
          
          if (lowerText.includes(formSpec.replace(/\s+/g, '').substring(0, 8))) {
            console.log('   ✅ Specialization matches resume content');
          } else {
            console.log('   ❌ Specialization may not match resume content');
          }
          
        } else {
          console.log(`   ❌ Text extraction failed: ${extraction.error}`);
        }
      } else {
        console.log('   ❌ File not found');
      }
      
      console.log('');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  checkResumeContent();
}

export { checkResumeContent };
