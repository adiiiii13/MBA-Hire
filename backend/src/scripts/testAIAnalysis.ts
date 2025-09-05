import { analyzeResumeWithGrok, createFallbackAnalysis, ResumeAnalysisRequest } from '../services/grokAI';
import { pool } from '../config/database';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Sample candidate data for testing
const sampleCandidateInfo: ResumeAnalysisRequest['candidateInfo'] = {
  name: "John Doe",
  specialization: "Finance",
  college: "Harvard Business School",
  cgpa: 8.5,
  skills: ["Financial Modeling", "Investment Analysis", "Excel", "PowerPoint", "Leadership", "Project Management"],
  experience: "Completed internship at Goldman Sachs as a financial analyst. Led a team of 3 students in a case study competition. Worked on a consulting project for a local startup, analyzing their financial strategy and recommending improvements. Have 2 years of work experience in banking sector before MBA."
};

const sampleResumeText = `
John Doe
Email: john.doe@email.com
Phone: +1-555-123-4567

EDUCATION
Harvard Business School, MBA Finance, 2024
GPA: 8.5/10.0
Relevant Coursework: Corporate Finance, Investment Banking, Portfolio Management

EXPERIENCE
Goldman Sachs, Financial Analyst Intern, Summer 2023
• Conducted financial modeling for M&A transactions
• Prepared pitch decks for client presentations
• Analyzed market trends and investment opportunities
• Collaborated with senior analysts on due diligence processes

Local Startup, Financial Consultant, 2023
• Developed financial strategy recommendations
• Created budget forecasting models
• Identified cost optimization opportunities
• Presented findings to executive team

SKILLS
• Financial Modeling & Analysis
• Investment Analysis & Valuation
• Excel, PowerPoint, Bloomberg Terminal
• Leadership & Team Management
• Project Management
• Communication & Presentation

ACHIEVEMENTS
• Winner of National Case Study Competition 2023
• Led team of 3 students to victory
• Consistently top 10% of class performance
• Volunteer financial advisor for local non-profit
`;

async function testAIAnalysis() {
  console.log('🧪 Testing AI Resume Analysis Integration...\n');

  try {
    console.log('1. Testing Grok AI Analysis...');
    const analysisRequest: ResumeAnalysisRequest = {
      resumeText: sampleResumeText,
      candidateInfo: sampleCandidateInfo
    };

    const aiResult = await analyzeResumeWithGrok(analysisRequest);
    
    if (aiResult.success) {
      console.log('✅ Grok AI Analysis Successful!');
      console.log(`Score: ${aiResult.score}/100`);
      console.log(`Strengths (${aiResult.strengths.length}):`);
      aiResult.strengths.forEach((strength, index) => {
        console.log(`  ${index + 1}. ${strength}`);
      });
      console.log(`Weaknesses (${aiResult.weaknesses.length}):`);
      aiResult.weaknesses.forEach((weakness, index) => {
        console.log(`  ${index + 1}. ${weakness}`);
      });
      console.log(`Prediction: ${aiResult.prediction}`);
      console.log(`Analysis: ${aiResult.analysisDetails}`);
    } else {
      console.log('❌ Grok AI Analysis Failed:', aiResult.error);
      console.log('\n2. Testing Fallback Analysis...');
      
      const fallbackResult = createFallbackAnalysis(sampleCandidateInfo);
      console.log('✅ Fallback Analysis Created!');
      console.log(`Score: ${fallbackResult.score}/100`);
      console.log(`Strengths (${fallbackResult.strengths.length}):`);
      fallbackResult.strengths.forEach((strength, index) => {
        console.log(`  ${index + 1}. ${strength}`);
      });
      console.log(`Weaknesses (${fallbackResult.weaknesses.length}):`);
      fallbackResult.weaknesses.forEach((weakness, index) => {
        console.log(`  ${index + 1}. ${weakness}`);
      });
    }

    console.log('\n3. Testing Database Connection...');
    const [result] = await pool.execute('SELECT COUNT(*) as count FROM applications');
    const count = (result as any[])[0].count;
    console.log(`✅ Database connected! Found ${count} applications.`);

    console.log('\n4. Testing Database Schema...');
    const [columns] = await pool.execute(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'applications'
      AND COLUMN_NAME IN ('ai_score', 'ai_strengths', 'ai_weaknesses', 'ai_analysis_status')
      ORDER BY COLUMN_NAME
    `);
    
    const columnData = columns as any[];
    if (columnData.length === 4) {
      console.log('✅ All AI analysis columns exist:');
      columnData.forEach(col => {
        console.log(`  - ${col.COLUMN_NAME} (${col.DATA_TYPE}, nullable: ${col.IS_NULLABLE})`);
      });
    } else {
      console.log(`❌ Missing AI columns. Found ${columnData.length}/4 expected columns.`);
      console.log('Please run database migration to add missing columns.');
    }

    console.log('\n🎉 AI Analysis Integration Test Complete!');

  } catch (error) {
    console.error('❌ Test Failed:', error);
  } finally {
    // Close database connection
    await pool.end();
  }
}

// Run the test if called directly
if (require.main === module) {
  testAIAnalysis();
}

export { testAIAnalysis };
