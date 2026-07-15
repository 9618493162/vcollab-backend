const http = require('http');

console.log('🧪 VCollab System Test\n');

// Test 1: Backend Server
function testBackend() {
    return new Promise((resolve) => {
        const options = {
            hostname: 'localhost',
            port: 5002,
            path: '/',
            method: 'GET'
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                if (res.statusCode === 200) {
                    console.log('✅ Backend Server: RUNNING');
                    console.log(`   Response: ${data}`);
                    resolve(true);
                } else {
                    console.log(`❌ Backend Server: ERROR (Status ${res.statusCode})`);
                    resolve(false);
                }
            });
        });

        req.on('error', (error) => {
            console.log(`❌ Backend Server: NOT RUNNING`);
            console.log(`   Error: ${error.message}`);
            resolve(false);
        });

        req.setTimeout(3000, () => {
            req.destroy();
            console.log('❌ Backend Server: TIMEOUT');
            resolve(false);
        });

        req.end();
    });
}

// Test 2: Frontend Server
function testFrontend() {
    return new Promise((resolve) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: '/index.html',
            method: 'GET'
        };

        const req = http.request(options, (res) => {
            if (res.statusCode === 200) {
                console.log('✅ Frontend Server: RUNNING');
                console.log(`   URL: http://localhost:3000`);
                resolve(true);
            } else {
                console.log(`❌ Frontend Server: ERROR (Status ${res.statusCode})`);
                resolve(false);
            }
        });

        req.on('error', () => {
            console.log(`❌ Frontend Server: NOT RUNNING`);
            resolve(false);
        });

        req.setTimeout(3000, () => {
            req.destroy();
            console.log('❌ Frontend Server: TIMEOUT');
            resolve(false);
        });

        req.end();
    });
}

// Run all tests
async function runTests() {
    console.log('Starting system tests...\n');
    
    const backendOk = await testBackend();
    console.log('');
    
    const frontendOk = await testFrontend();
    console.log('');
    
    console.log('═══════════════════════════════════');
    console.log('📊 TEST RESULTS SUMMARY');
    console.log('═══════════════════════════════════');
    console.log(`Backend:  ${backendOk ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Frontend: ${frontendOk ? '✅ PASS' : '❌ FAIL'}`);
    console.log('═══════════════════════════════════');
    
    if (backendOk && frontendOk) {
        console.log('\n🎉 ALL SYSTEMS OPERATIONAL!');
        console.log('\n📝 Next Steps:');
        console.log('1. Add your Supabase Anon Key to .env');
        console.log('2. Open http://localhost:3000 in browser');
        console.log('3. Register a new account');
        console.log('4. Test all features');
    } else {
        console.log('\n⚠️  SOME SYSTEMS NOT OPERATIONAL');
        console.log('Please check the errors above');
    }
    
    process.exit(backendOk && frontendOk ? 0 : 1);
}

runTests();
