const http = require('http');

function makeRequest(path, method, data, token = null) {
    return new Promise((resolve, reject) => {
        const postData = data ? JSON.stringify(data) : null;
        
        const options = {
            hostname: 'localhost',
            port: 5003,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 60000 // 60 second timeout
        };

        if (postData) {
            options.headers['Content-Length'] = Buffer.byteLength(postData);
        }

        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        const req = http.request(options, (res) => {
            let responseData = '';

            res.on('data', (chunk) => {
                responseData += chunk;
            });

            res.on('end', () => {
                try {
                    resolve({
                        statusCode: res.statusCode,
                        data: JSON.parse(responseData)
                    });
                } catch (error) {
                    reject(new Error('Failed to parse response'));
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });

        if (postData) {
            req.write(postData);
        }
        
        req.end();
    });
}

async function quickTest() {
    console.log('\n🧪 Quick Real Data Test\n');

    const testEmail = `quick${Date.now()}@vcollab.com`;
    
    try {
        console.log('📝 Registering user (this may take 20-30 seconds due to email timeout)...');
        const startTime = Date.now();
        
        const registerResponse = await makeRequest('/api/auth/register', 'POST', {
            fullName: 'Quick Test',
            email: testEmail,
            password: 'test1234'
        });

        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        console.log(`⏱️  Took ${elapsed}s`);

        if (registerResponse.data.success) {
            console.log(`✅ SUCCESS! User registered`);
            console.log(`   User ID: ${registerResponse.data.user.id}`);
            console.log(`   Email: ${registerResponse.data.user.email}`);
            console.log(`   Token: ${registerResponse.data.accessToken.substring(0, 30)}...`);
            console.log('\n🎉 REAL DATA CONFIRMED!');
            console.log('\n📊 Verify in Supabase:');
            console.log(`   1. Go to https://supabase.com/dashboard`);
            console.log(`   2. Table Editor → users table`);
            console.log(`   3. Look for: ${testEmail}\n`);
        } else {
            console.log(`❌ Failed: ${registerResponse.data.message}`);
        }

    } catch (error) {
        console.log(`❌ Error: ${error.message}`);
    }
}

quickTest();
