import { pool } from '../config/database';
import dotenv from 'dotenv';

dotenv.config();

async function addAIColumns() {
  console.log('🔧 Adding AI analysis columns to applications table...\n');

  try {
    // Check if columns already exist
    console.log('1. Checking existing columns...');
    const [columns] = await pool.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'applications'
      AND COLUMN_NAME IN ('ai_score', 'ai_strengths', 'ai_weaknesses', 'ai_analysis_status')
    `);
    
    const existingColumns = (columns as any[]).map(col => col.COLUMN_NAME);
    console.log(`   Found existing AI columns: ${existingColumns.join(', ') || 'none'}`);

    const columnsToAdd = [
      { name: 'ai_score', definition: 'ai_score INT DEFAULT NULL' },
      { name: 'ai_strengths', definition: 'ai_strengths TEXT DEFAULT NULL' },
      { name: 'ai_weaknesses', definition: 'ai_weaknesses TEXT DEFAULT NULL' },
      { name: 'ai_analysis_status', definition: "ai_analysis_status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending'" }
    ];

    console.log('\n2. Adding missing columns...');
    
    for (const column of columnsToAdd) {
      if (!existingColumns.includes(column.name)) {
        console.log(`   Adding column: ${column.name}`);
        try {
          await pool.execute(`ALTER TABLE applications ADD COLUMN ${column.definition}`);
          console.log(`   ✅ Added ${column.name} successfully`);
        } catch (error: any) {
          if (error.code === 'ER_DUP_FIELDNAME') {
            console.log(`   ℹ️  Column ${column.name} already exists`);
          } else {
            console.error(`   ❌ Failed to add ${column.name}:`, error.message);
          }
        }
      } else {
        console.log(`   ℹ️  Column ${column.name} already exists`);
      }
    }

    // Add index for ai_score if it doesn't exist
    console.log('\n3. Adding index for ai_score...');
    try {
      await pool.execute(`ALTER TABLE applications ADD INDEX idx_ai_score (ai_score)`);
      console.log('   ✅ Added ai_score index successfully');
    } catch (error: any) {
      if (error.code === 'ER_DUP_KEYNAME') {
        console.log('   ℹ️  ai_score index already exists');
      } else {
        console.error('   ❌ Failed to add ai_score index:', error.message);
      }
    }

    // Verify all columns are now present
    console.log('\n4. Verifying columns...');
    const [finalColumns] = await pool.execute(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'applications'
      AND COLUMN_NAME IN ('ai_score', 'ai_strengths', 'ai_weaknesses', 'ai_analysis_status')
      ORDER BY COLUMN_NAME
    `);
    
    const finalColumnData = finalColumns as any[];
    console.log('   Final AI columns in table:');
    finalColumnData.forEach(col => {
      console.log(`   ✅ ${col.COLUMN_NAME} (${col.DATA_TYPE}, nullable: ${col.IS_NULLABLE}, default: ${col.COLUMN_DEFAULT || 'NULL'})`);
    });

    if (finalColumnData.length === 4) {
      console.log('\n🎉 All AI columns added successfully! The AI analysis feature should now work.');
      console.log('\nNext steps:');
      console.log('1. Restart your backend server');
      console.log('2. Submit a new application with resume to test');
      console.log('3. Check the admin dashboard for AI scores');
    } else {
      console.log(`\n❌ Missing columns. Expected 4, found ${finalColumnData.length}`);
    }

  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await pool.end();
  }
}

// Run migration
if (require.main === module) {
  addAIColumns();
}

export { addAIColumns };
