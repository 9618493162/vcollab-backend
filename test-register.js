/**
 * Test the registration endpoint directly
 */

const axios = require('axios');

const BACKEND_URL = 'https://vcollab-backend-production.up.railway.app';

async function testRegister() {
  console.log('🧪 Testing Registration Endpoint\n');
  console.log('Backend URL:', BACKEND_URL);
  console.log('Endpoint: POST /api/auth/register\n');
  
  // Test with different password patterns
  const testCases = [
    {
      name: 'Test 1: Simple valid password',
      data: {
        fullName: 'Test User One',
        email: 'testuser1@example.com',
        password: 'Test1234!'
      }
    },
    {
      name: 'Test 2: Complex valid password',
      data: {
        fullName: 'Test User Two',
        email: 'testuser2@example.com',
        password: 'Navadeep@2024'
      }
    },
    {
      name: 'Test 3: Your actual email',
      data: {
        fullName: 'Gundrathi Navadeep',
        email: 'ggundrathinavadeep@gmail.com',
        password: 'Navadeep@2024'
      }
    }
  ];
  
  for (const test of testCases) {
    console.log(`\n${test.name}`);
    console.log('─'.repeat(50));
    console.log('Email:', test.data.email);
    console.log('Password:', test.data.password);
    console.log('Testing...');
    
    try {
      const startTime = Date.now();
      
      const response = await axios.post(
        `${BACKEND_URL}/api/auth/register`,
        test.data,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 60000 // 60 second timeout
        }
      );
      
      const duration = Date.now() - startTime;
      
      console.log(`✅ SUCCESS (${duration}ms)`);
      console.log('Status:', response.status);
      console.log('Response:', JSON.stringify(response.data, null, 2));
      
    } catch (error) {
      const duration = error.response ? Date.now() - startTime : 60000;
      
      if (error.code === 'ECONNABORTED') {
        console.log(`❌ TIMEOUT after ${duration}ms`);
        console.log('The request took too long to complete');
      } else if (error.response) {
        console.log(`❌ FAILED (${duration}ms)`);
        console.log('Status:', error.response.status);
        console.log('Error:', JSON.stringify(error.response.data, null, 2));
      } else if (error.request) {
        console.log(`❌ NO RESPONSE (${duration}ms)`);
        console.log('Request was made but no response received');
        console.log('Error:', error.message);
      } else {
        console.log('❌ ERROR');
        console.log(error.message);
      }
    }
  }
  
  console.log('\n' + '═'.repeat(50));
  console.log('\n✅ Test complete');
}

testRegister().catch(err => {
  console.error('\n💥 Fatal error:', err);
  process.exit(1);
});
