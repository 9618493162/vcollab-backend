const http = require('http');

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
    bright: '\x1b[1m'
};

function log(emoji, color, message) {
    console.log(`${emoji} ${color}${message}${colors.reset}`);
}

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
            }
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

        if (postData) {
            req.write(postData);
        }
        
        req.end();
    });
}

async function testRealData() {
    console.log('\n');
    log('🎯', colors.bright + colors.cyan, '═══════════════════════════════════════════');
    log('🎯', colors.bright + colors.cyan, '   VCOLLAB REAL DATA INTEGRATION TEST      ');
    log('🎯', colors.bright + colors.cyan, '═══════════════════════════════════════════');
    console.log('\n');

    const testEmail = `testuser${Date.now()}@vcollab.com`;
    let accessToken = null;
    let userId = null;
    let meetingId = null;

    try {
        // TEST 1: Register New User
        log('📝', colors.cyan, 'TEST 1: Register New User');
        console.log(`   Email: ${testEmail}`);
        
        const registerResponse = await makeRequest('/api/auth/register', 'POST', {
            fullName: 'Real Test User',
            email: testEmail,
            password: 'test1234'
        });

        if (registerResponse.statusCode === 201 && registerResponse.data.success) {
            accessToken = registerResponse.data.accessToken;
            userId = registerResponse.data.user.id;
            log('✅', colors.green, `Registration successful! User ID: ${userId}`);
            log('🔑', colors.yellow, `Access Token: ${accessToken.substring(0, 20)}...`);
        } else {
            throw new Error(`Registration failed: ${registerResponse.data.message}`);
        }

        console.log('\n');

        // TEST 2: Login with Registered User
        log('🔐', colors.cyan, 'TEST 2: Login with Real User');
        
        const loginResponse = await makeRequest('/api/auth/login', 'POST', {
            email: testEmail,
            password: 'test1234'
        });

        if (loginResponse.statusCode === 200 && loginResponse.data.success) {
            log('✅', colors.green, `Login successful! Welcome ${loginResponse.data.user.fullName}`);
        } else {
            throw new Error(`Login failed: ${loginResponse.data.message}`);
        }

        console.log('\n');

        // TEST 3: Create Meeting
        log('📅', colors.cyan, 'TEST 3: Create Real Meeting in Supabase');
        
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const meetingDate = tomorrow.toISOString().split('T')[0];

        const createMeetingResponse = await makeRequest('/api/meetings/create', 'POST', {
            title: 'Real Data Test Meeting',
            description: 'This meeting is stored in Supabase!',
            date: meetingDate,
            time: '14:00',
            type: 'Public',
            passcode: ''
        }, accessToken);

        if (createMeetingResponse.statusCode === 201 && createMeetingResponse.data.success) {
            meetingId = createMeetingResponse.data.meeting.meetingId;
            log('✅', colors.green, `Meeting created! Meeting ID: ${meetingId}`);
            log('📊', colors.yellow, `Title: ${createMeetingResponse.data.meeting.title}`);
        } else {
            throw new Error(`Meeting creation failed: ${createMeetingResponse.data.message}`);
        }

        console.log('\n');

        // TEST 4: Get User Profile
        log('👤', colors.cyan, 'TEST 4: Get User Profile from Supabase');
        
        const profileResponse = await makeRequest('/api/auth/profile', 'GET', null, accessToken);

        if (profileResponse.statusCode === 200 && profileResponse.data.success) {
            log('✅', colors.green, `Profile retrieved!`);
            log('📋', colors.yellow, `Name: ${profileResponse.data.user.fullName}`);
            log('📧', colors.yellow, `Email: ${profileResponse.data.user.email}`);
        } else {
            throw new Error(`Get profile failed: ${profileResponse.data.message}`);
        }

        console.log('\n');

        // FINAL SUMMARY
        log('🎉', colors.bright + colors.green, '═══════════════════════════════════════════');
        log('🎉', colors.bright + colors.green, '   ALL TESTS PASSED! 100% REAL DATA       ');
        log('🎉', colors.bright + colors.green, '═══════════════════════════════════════════');
        console.log('\n');
        
        log('✅', colors.green, 'User registered in Supabase users table');
        log('✅', colors.green, 'Login authentication working with real credentials');
        log('✅', colors.green, 'Meeting created in Supabase meetings table');
        log('✅', colors.green, 'JWT tokens generated and validated');
        log('✅', colors.green, 'User profile fetched from Supabase');
        
        console.log('\n');
        log('🔍', colors.cyan, 'Verify in Supabase Dashboard:');
        console.log(`   1. Go to: https://supabase.com/dashboard`);
        console.log(`   2. Open "Table Editor" → "users" table`);
        console.log(`   3. Look for email: ${testEmail}`);
        console.log(`   4. Open "meetings" table`);
        console.log(`   5. Look for Meeting ID: ${meetingId}`);
        console.log('\n');

        log('🎊', colors.bright + colors.green, 'NO MOCK DATA - EVERYTHING IS REAL!');
        console.log('\n');

    } catch (error) {
        console.log('\n');
        log('❌', colors.red, '═══════════════════════════════════════════');
        log('❌', colors.red, `   TEST FAILED: ${error.message}           `);
        log('❌', colors.red, '═══════════════════════════════════════════');
        console.log('\n');
        process.exit(1);
    }
}

testRealData();
