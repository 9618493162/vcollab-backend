#!/usr/bin/env node

/**
 * Check Railway JWT Secrets Script
 * 
 * This script helps you verify if your Railway deployment has the correct JWT secrets.
 * 
 * Run: node check-railway-secrets.js
 */

const OLD_WEAK_SECRET = 'vcollab-super-secret-key-2025-change-in-production';
const NEW_STRONG_SECRETS = {
  JWT_SECRET: 'Au5vQVnPI+waWC2d7irtWVjp7+evpRa1axuXq81CvqmNsc4FveKqz0UvaNTVNS5/',
  JWT_REFRESH_SECRET: 'toRlQJPMf6gECH8Rzxhg3XYcaSCQIGe8llCJrLrlSOcDzimKwuYkWQlAMDixEsKb',
  SESSION_SECRET: 'rimMsFimLEtuYUYXBgWjDDmwYtWl9uuMKYEcaWGMzmKHqd6axbJrQxO7qijw/QJ8'
};

console.log('\n🔍 JWT Secrets Verification\n');
console.log('━'.repeat(70));

// Check local .env file
console.log('\n📁 LOCAL .env FILE:');
console.log('━'.repeat(70));

if (process.env.JWT_SECRET === NEW_STRONG_SECRETS.JWT_SECRET) {
  console.log('✅ JWT_SECRET: STRONG (64 bytes, secure)');
} else if (process.env.JWT_SECRET === OLD_WEAK_SECRET) {
  console.log('❌ JWT_SECRET: WEAK (needs update!)');
} else {
  console.log('⚠️  JWT_SECRET: Unknown value');
}

if (process.env.JWT_REFRESH_SECRET === NEW_STRONG_SECRETS.JWT_REFRESH_SECRET) {
  console.log('✅ JWT_REFRESH_SECRET: STRONG (64 bytes, secure)');
} else if (process.env.JWT_REFRESH_SECRET === OLD_WEAK_SECRET) {
  console.log('❌ JWT_REFRESH_SECRET: WEAK (needs update!)');
} else {
  console.log('⚠️  JWT_REFRESH_SECRET: Unknown value');
}

if (process.env.SESSION_SECRET === NEW_STRONG_SECRETS.SESSION_SECRET) {
  console.log('✅ SESSION_SECRET: STRONG (64 bytes, secure)');
} else if (process.env.SESSION_SECRET === OLD_WEAK_SECRET) {
  console.log('❌ SESSION_SECRET: WEAK (needs update!)');
} else {
  console.log('⚠️  SESSION_SECRET: Unknown value');
}

console.log('\n━'.repeat(70));
console.log('\n📋 RAILWAY DEPLOYMENT CHECK:');
console.log('━'.repeat(70));
console.log('\nTo check your Railway secrets:');
console.log('\n1. Go to: https://railway.app');
console.log('2. Open your backend project');
console.log('3. Click "Variables" tab');
console.log('4. Check these three variables:\n');
console.log('   JWT_SECRET');
console.log('   JWT_REFRESH_SECRET');
console.log('   SESSION_SECRET\n');

console.log('━'.repeat(70));
console.log('\n⚠️  ACTION REQUIRED:');
console.log('━'.repeat(70));
console.log('\nIf Railway shows the OLD weak secret pattern:');
console.log('   "vcollab-super-secret-key-2025-change-in-production"');
console.log('\nThen UPDATE Railway with these NEW secrets:\n');

console.log('JWT_SECRET=');
console.log(NEW_STRONG_SECRETS.JWT_SECRET);
console.log('\nJWT_REFRESH_SECRET=');
console.log(NEW_STRONG_SECRETS.JWT_REFRESH_SECRET);
console.log('\nSESSION_SECRET=');
console.log(NEW_STRONG_SECRETS.SESSION_SECRET);

console.log('\n━'.repeat(70));
console.log('\n🔧 HOW TO UPDATE RAILWAY:');
console.log('━'.repeat(70));
console.log('\nMethod 1 - Railway Dashboard (Easiest):');
console.log('   1. Go to Railway dashboard');
console.log('   2. Select your backend service');
console.log('   3. Click "Variables" tab');
console.log('   4. Edit each variable and paste new value');
console.log('   5. Click "Add" or "Update"');
console.log('   6. Railway will auto-redeploy\n');

console.log('Method 2 - Railway CLI:');
console.log('   railway variables set JWT_SECRET="' + NEW_STRONG_SECRETS.JWT_SECRET + '"');
console.log('   railway variables set JWT_REFRESH_SECRET="' + NEW_STRONG_SECRETS.JWT_REFRESH_SECRET + '"');
console.log('   railway variables set SESSION_SECRET="' + NEW_STRONG_SECRETS.SESSION_SECRET + '"\n');

console.log('━'.repeat(70));
console.log('\n✅ After updating Railway:');
console.log('   1. Wait for auto-redeploy (check Deployments tab)');
console.log('   2. Clear browser cookies and localStorage');
console.log('   3. Log out and log back in');
console.log('   4. Verify authentication works\n');

console.log('━'.repeat(70));
console.log('\n💡 TIP: Never commit secrets to git!');
console.log('   These secrets are in .env (which is .gitignored)');
console.log('   Railway reads from environment variables, not .env\n');

console.log('━'.repeat(70) + '\n');
