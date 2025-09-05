import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

async function testGrokAPI() {
  console.log('🔑 Testing Grok API Key...\n');

  const apiKey = process.env.GROK_API_KEY;
  console.log(`API Key (first 10 chars): ${apiKey ? apiKey.substring(0, 10) + '...' : 'NOT SET'}`);
  console.log(`API Key length: ${apiKey ? apiKey.length : 0}`);

  if (!apiKey) {
    console.log('❌ GROK_API_KEY not found in environment variables');
    return;
  }

  try {
    console.log('\n📡 Testing API connection...');
    
    const response = await axios.post(
      'https://api.x.ai/v1/chat/completions',
      {
        model: 'grok-beta',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant.'
          },
          {
            role: 'user',
            content: 'Say "Hello World" in JSON format: {"message": "Hello World"}'
          }
        ],
        max_tokens: 50,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 15000
      }
    );

    console.log('✅ API call successful!');
    console.log('Response:', response.data);

  } catch (error: any) {
    console.log('❌ API call failed');
    
    if (error.response) {
      console.log(`Status: ${error.response.status}`);
      console.log(`Status Text: ${error.response.statusText}`);
      console.log('Response Data:', error.response.data);
      
      if (error.response.data?.error) {
        console.log(`\n🔍 Error Details: ${error.response.data.error}`);
      }
    } else if (error.request) {
      console.log('No response received from server');
      console.log('Request error:', error.message);
    } else {
      console.log('Error setting up request:', error.message);
    }
  }
}

// Run the test
if (require.main === module) {
  testGrokAPI();
}
