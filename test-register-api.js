const http = require('http');

const testData = {
    fullName: 'Gundranthi Navadeep',
    email: 'test@example.com',
    password: 'Navaa@24'
};

console.log('🧪 Testing Registration API\n');
console.log('Sending data:', JSON.stringify(testData, null, 2));
console.log('\n');

const postData = JSON.stringify(testData);

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
    
    console.log('📡 Response Status:', res.statusCode);
    console.log('📋 Response Headers:', res.headers);
    console.log('\n');

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const response = JSON.parse(data);
            console.log('📦 Response Body:');
            console.log(JSON.stringify(response, null, 2));
            
            if (response.success) {
                console.log('\n✅ Registration successful!');
            } else {
                console.log('\n❌ Registration failed:', response.message);
            }
        } catch (error) {
            console.log('❌ Error parsing response:', error.message);
            console.log('Raw response:', data);
        }
    });
});

req.on('error', (error) => {
    console.error('❌ Request error:', error.message);
});

req.write(postData);
req.end();
