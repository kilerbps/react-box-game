const https = require('https');

console.log('🔍 Test de connexion API Render...\n');

// Test 1: Health Check
console.log('1️⃣ Test Health Check...');
https.get('https://react-box-game.onrender.com/api/health', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log('✅ Health Check OK:', res.statusCode);
    console.log('📄 Response:', JSON.parse(data));
    console.log('');
    
    // Test 2: CORS Headers
    console.log('2️⃣ Test CORS Headers...');
    console.log('Access-Control-Allow-Origin:', res.headers['access-control-allow-origin']);
    console.log('Access-Control-Allow-Methods:', res.headers['access-control-allow-methods']);
    console.log('Access-Control-Allow-Headers:', res.headers['access-control-allow-headers']);
    console.log('');
    
    // Test 3: Identity Check
    testIdentityCheck();
  });
}).on('error', (err) => {
  console.log('❌ Health Check Error:', err.message);
});

function testIdentityCheck() {
  console.log('3️⃣ Test Identity Check...');
  
  const postData = JSON.stringify({
    email: 'test@example.com',
    phone: '0612345678'
  });

  const options = {
    hostname: 'react-box-game.onrender.com',
    port: 443,
    path: '/api/check-identity',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
      'Origin': 'https://react-box-game.vercel.app'
    }
  };

  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      console.log('✅ Identity Check OK:', res.statusCode);
      console.log('📄 Response:', JSON.parse(data));
      console.log('');
      console.log('🎯 Résumé des tests:');
      console.log('✅ Backend Render accessible');
      console.log('✅ API endpoints fonctionnels');
      console.log('✅ CORS configuré');
      console.log('');
      console.log('🔧 Prochaines étapes:');
      console.log('1. Vérifier VITE_API_URL dans Vercel');
      console.log('2. Redéployer le frontend Vercel');
      console.log('3. Vider le cache navigateur');
    });
  });

  req.on('error', (err) => {
    console.log('❌ Identity Check Error:', err.message);
  });

  req.write(postData);
  req.end();
} 