const https = require('https');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://cdimickbisvisigkcbdm.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;

console.log('\n🔍 Checking Supabase Connection...\n');
console.log('URL:', SUPABASE_URL);
console.log('Key:', SUPABASE_KEY ? SUPABASE_KEY.substring(0, 30) + '...' : 'NOT SET');
console.log('\n');

// Test 1: DNS Resolution
console.log('📡 TEST 1: DNS Resolution');
const hostname = SUPABASE_URL.replace('https://', '').replace('http://', '');
require('dns').lookup(hostname, (err, address) => {
    if (err) {
        console.log('   ❌ DNS Failed:', err.code);
        console.log('   └─ Domain does not exist or cannot be resolved\n');
    } else {
        console.log('   ✅ DNS Resolved to:', address, '\n');
    }
});

// Test 2: HTTP Connection
setTimeout(() => {
    console.log('🌐 TEST 2: HTTP Connection');
    const options = {
        hostname: hostname,
        port: 443,
        path: '/rest/v1/',
        method: 'GET',
        headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`
        },
        timeout: 10000
    };

    const req = https.request(options, (res) => {
        console.log('   ✅ HTTP Status:', res.statusCode);
        console.log('   ✅ Connection successful!\n');
        
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
            console.log('📋 TEST 3: API Response');
            if (res.statusCode === 200 || res.statusCode === 401) {
                console.log('   ✅ Supabase API is responding');
                console.log('   ✅ Your project is ACTIVE!\n');
            } else {
                console.log('   ⚠️  Unexpected status code\n');
            }
        });
    });

    req.on('error', (error) => {
        console.log('   ❌ Connection Failed:', error.message);
        console.log('   └─ Possible causes:');
        console.log('      - Project was deleted');
        console.log('      - Project was paused');
        console.log('      - Wrong URL in .env file\n');
    });

    req.on('timeout', () => {
        req.destroy();
        console.log('   ❌ Connection Timeout (10 seconds)');
        console.log('   └─ Server not responding\n');
    });

    req.end();
}, 1000);

// Final recommendation
setTimeout(() => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 RECOMMENDATION:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n1. Open your browser');
    console.log('2. Go to: https://supabase.com/dashboard');
    console.log('3. Check if "vcollab" project exists');
    console.log('4. If it exists, copy the correct Project URL');
    console.log('5. Update backend/.env with the correct URL\n');
}, 2000);
