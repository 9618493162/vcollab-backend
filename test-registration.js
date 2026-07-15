const http = require('http');

function testRegistration() {
    console.log('🧪 Testing User Registration with Supabase...\n');

    const postData = JSON.stringify({
        fullName: 'Test User',
        email: 'test@vcollab.com',
        password: 'test1234'
    });

    const options = {
        hostname: 'localhost',
        port: 5003,
        path: '/api/auth/register',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    const req = http.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            try {
                const response = JSON.parse(data);
                
                console.log('Status:', res.statusCode);
                console.log('Response:', JSON.stringify(response, null, 2));

                if (response.success) {
                    console.log('\n✅ SUCCESS! User registered in Supabase!');
                    console.log('User ID:', response.data.user.id);
                    console.log('Email:', response.data.user.email);
                } else {
                    console.log('\n❌ Failed:', response.message);
                }
            } catch (error) {
                console.error('❌ Error parsing response:', error.message);
                console.log('Raw response:', data);
            }
        });
    });

    req.on('error', (error) => {
        console.error('❌ Request Error:', error.message);
    });

    req.write(postData);
    req.end();
}

testRegistration();
