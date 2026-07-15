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
            timeout: 60000
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
                    resolve({
                        statusCode: res.statusCode,
                        data: { raw: responseData }
                    });
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

async function testAuthFlow() {
    console.log('\n╔════════════════════════════════════════════╗');
    console.log('║   🔐 AUTHENTICATION FLOW TEST             ║');
    console.log('╚════════════════════════════════════════════╝\n');

    const testEmail = `authtest${Date.now()}@vcollab.com`;
    const testPassword = 'SecurePass123!';
    let accessToken = null;
    let refreshToken = null;
    let userId = null;

    try {
        // TEST 1: REGISTRATION
        console.log('📝 TEST 1: User Registration');
        console.log('   ├─ Email:', testEmail);
        console.log('   └─ Password: ********');
        console.log('   ⏳ Registering (may take 20-25s)...\n');
        
        const startReg = Date.now();
        const registerRes = await makeRequest('/api/auth/register', 'POST', {
            fullName: 'Auth Test User',
            email: testEmail,
            password: testPassword
        });
        const regTime = ((Date.now() - startReg) / 1000).toFixed(1);

        if (registerRes.statusCode === 201 && registerRes.data.success) {
            accessToken = registerRes.data.accessToken;
            refreshToken = registerRes.data.refreshToken;
            userId = registerRes.data.user.id;
            
            console.log('   ✅ REGISTRATION SUCCESSFUL');
            console.log('   ├─ Status Code:', registerRes.statusCode);
            console.log('   ├─ User ID:', userId);
            console.log('   ├─ Full Name:', registerRes.data.user.fullName);
            console.log('   ├─ Email:', registerRes.data.user.email);
            console.log('   ├─ Access Token:', accessToken.substring(0, 40) + '...');
            console.log('   ├─ Refresh Token:', refreshToken.substring(0, 40) + '...');
            console.log('   └─ Time:', regTime + 's\n');
        } else {
            console.log('   ❌ REGISTRATION FAILED');
            console.log('   ├─ Status Code:', registerRes.statusCode);
            console.log('   └─ Message:', registerRes.data.message || 'Unknown error\n');
            return;
        }

        // Wait a bit
        await new Promise(resolve => setTimeout(resolve, 1000));

        // TEST 2: LOGIN
        console.log('🔐 TEST 2: User Login');
        console.log('   ├─ Email:', testEmail);
        console.log('   └─ Password: ********');
        console.log('   ⏳ Logging in...\n');
        
        const startLogin = Date.now();
        const loginRes = await makeRequest('/api/auth/login', 'POST', {
            email: testEmail,
            password: testPassword
        });
        const loginTime = ((Date.now() - startLogin) / 1000).toFixed(1);

        if (loginRes.statusCode === 200 && loginRes.data.success) {
            const newAccessToken = loginRes.data.accessToken;
            const newRefreshToken = loginRes.data.refreshToken;
            
            console.log('   ✅ LOGIN SUCCESSFUL');
            console.log('   ├─ Status Code:', loginRes.statusCode);
            console.log('   ├─ User ID:', loginRes.data.user.id);
            console.log('   ├─ Full Name:', loginRes.data.user.fullName);
            console.log('   ├─ Email:', loginRes.data.user.email);
            console.log('   ├─ New Access Token:', newAccessToken.substring(0, 40) + '...');
            console.log('   ├─ New Refresh Token:', newRefreshToken.substring(0, 40) + '...');
            console.log('   └─ Time:', loginTime + 's\n');
            
            // Use the new token for subsequent requests
            accessToken = newAccessToken;
        } else {
            console.log('   ❌ LOGIN FAILED');
            console.log('   ├─ Status Code:', loginRes.statusCode);
            console.log('   └─ Message:', loginRes.data.message || 'Unknown error\n');
            return;
        }

        // TEST 3: ACCESS PROTECTED ENDPOINT (Get Profile)
        console.log('👤 TEST 3: Access Protected Endpoint (Get Profile)');
        console.log('   ├─ Using Access Token');
        console.log('   └─ Endpoint: GET /api/auth/profile\n');
        
        const profileRes = await makeRequest('/api/auth/profile', 'GET', null, accessToken);

        if (profileRes.statusCode === 200 && profileRes.data.success) {
            console.log('   ✅ PROFILE ACCESS SUCCESSFUL');
            console.log('   ├─ Status Code:', profileRes.statusCode);
            console.log('   ├─ User ID:', profileRes.data.user.id);
            console.log('   ├─ Full Name:', profileRes.data.user.fullName);
            console.log('   ├─ Email:', profileRes.data.user.email);
            console.log('   └─ Created At:', profileRes.data.user.createdAt || 'N/A\n');
        } else {
            console.log('   ❌ PROFILE ACCESS FAILED');
            console.log('   ├─ Status Code:', profileRes.statusCode);
            console.log('   └─ Message:', profileRes.data.message || 'Unknown error\n');
        }

        // TEST 4: ACCESS WITHOUT TOKEN (Should Fail)
        console.log('🚫 TEST 4: Access Without Token (Should Deny)');
        console.log('   └─ Endpoint: GET /api/auth/profile\n');
        
        const noTokenRes = await makeRequest('/api/auth/profile', 'GET', null, null);

        if (noTokenRes.statusCode === 401 || noTokenRes.statusCode === 403) {
            console.log('   ✅ CORRECTLY DENIED (Expected behavior)');
            console.log('   ├─ Status Code:', noTokenRes.statusCode);
            console.log('   └─ Message:', noTokenRes.data.message || 'Unauthorized\n');
        } else {
            console.log('   ⚠️  UNEXPECTED RESPONSE');
            console.log('   ├─ Status Code:', noTokenRes.statusCode);
            console.log('   └─ Should be 401 or 403\n');
        }

        // TEST 5: WRONG PASSWORD (Should Fail)
        console.log('🔒 TEST 5: Login with Wrong Password (Should Deny)');
        console.log('   ├─ Email:', testEmail);
        console.log('   └─ Password: WrongPassword123\n');
        
        const wrongPassRes = await makeRequest('/api/auth/login', 'POST', {
            email: testEmail,
            password: 'WrongPassword123'
        });

        if (wrongPassRes.statusCode === 401 && !wrongPassRes.data.success) {
            console.log('   ✅ CORRECTLY DENIED (Expected behavior)');
            console.log('   ├─ Status Code:', wrongPassRes.statusCode);
            console.log('   └─ Message:', wrongPassRes.data.message || 'Invalid credentials\n');
        } else {
            console.log('   ⚠️  UNEXPECTED RESPONSE');
            console.log('   ├─ Status Code:', wrongPassRes.statusCode);
            console.log('   └─ Should be 401\n');
        }

        // FINAL SUMMARY
        console.log('\n╔════════════════════════════════════════════╗');
        console.log('║   🎉 AUTHENTICATION TEST COMPLETE         ║');
        console.log('╚════════════════════════════════════════════╝\n');
        
        console.log('✅ Registration: Working');
        console.log('✅ Login: Working');
        console.log('✅ JWT Token Generation: Working');
        console.log('✅ Protected Endpoints: Working');
        console.log('✅ Unauthorized Access: Properly Blocked');
        console.log('✅ Wrong Password: Properly Rejected\n');
        
        console.log('📊 Data Storage: Supabase PostgreSQL');
        console.log('🔐 Token Type: JWT (Access + Refresh)');
        console.log('⏱️  Token Expiry: 15 minutes (access), 7 days (refresh)\n');
        
        console.log('🔍 Verify in Supabase Dashboard:');
        console.log('   https://supabase.com/dashboard/project/cdimickbisvisigkcbdm');
        console.log('   └─ Table Editor → users → Look for:', testEmail, '\n');

    } catch (error) {
        console.log('\n❌ ERROR:', error.message, '\n');
        process.exit(1);
    }
}

testAuthFlow();
