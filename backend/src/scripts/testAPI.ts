import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

async function testApplicationsAPI() {
  console.log('🔍 Testing Applications API Endpoint...\n');

  const API_URL = 'http://localhost:5000/api/applications';

  try {
    console.log(`Making request to: ${API_URL}`);
    
    const response = await axios.get(API_URL, {
      timeout: 10000
    });

    if (response.status === 200 && response.data.success) {
      console.log('✅ API Response successful!');
      console.log(`Found ${response.data.data.length} applications\n`);

      // Check first application for AI data
      if (response.data.data.length > 0) {
        const firstApp = response.data.data[0];
        console.log('Sample application data:');
        console.log('Name:', firstApp.name);
        console.log('AI Score:', firstApp.ai_score);
        console.log('AI Analysis Status:', firstApp.ai_analysis_status);
        console.log('AI Strengths:', firstApp.ai_strengths ? firstApp.ai_strengths.length + ' items' : 'none');
        console.log('AI Weaknesses:', firstApp.ai_weaknesses ? firstApp.ai_weaknesses.length + ' items' : 'none');
        console.log('AI Prediction:', firstApp.ai_prediction ? 'present' : 'none');
        
        if (firstApp.ai_score) {
          console.log('\n🎉 AI analysis data is being returned by the API!');
        } else {
          console.log('\n⚠️ No AI analysis data found in API response');
        }
      }

    } else {
      console.log('❌ API request failed:', response.status, response.statusText);
    }

  } catch (error: any) {
    console.error('❌ API test failed:', error.message);
    
    if (error.response) {
      console.log('Response status:', error.response.status);
      console.log('Response data:', error.response.data);
    } else if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure your backend server is running on http://localhost:5000');
    }
  }
}

if (require.main === module) {
  testApplicationsAPI();
}
