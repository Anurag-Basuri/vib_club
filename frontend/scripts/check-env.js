// Environment validation script
// Run this before building for production: npm run check-env

import fs from 'fs';
import path from 'path';

const requiredProdVars = [
  'VITE_BACKEND_URL',
  'VITE_FRONTEND_URL',
  'VITE_CASHFREE_MODE'
];

const checkEnvironment = () => {
  console.log('🔍 Checking environment configuration...\n');
  
  // Check if .env.production exists
  const prodEnvPath = path.resolve('.env.production');
  if (!fs.existsSync(prodEnvPath)) {
    console.error('❌ .env.production file not found!');
    console.log('💡 Copy .env.production.template to .env.production and fill in your values');
    process.exit(1);
  }
  
  // Read .env.production file
  const envContent = fs.readFileSync(prodEnvPath, 'utf8');
  const envVars = {};
  
  envContent.split('\n').forEach(line => {
    if (line.trim() && !line.startsWith('#')) {
      const [key, value] = line.split('=');
      if (key && value) {
        envVars[key.trim()] = value.trim();
      }
    }
  });
  
  // Check required variables
  let hasErrors = false;
  
  requiredProdVars.forEach(varName => {
    if (!envVars[varName] || envVars[varName].includes('yourdomain.com')) {
      console.error(`❌ ${varName} is missing or contains placeholder value`);
      hasErrors = true;
    } else {
      console.log(`✅ ${varName}: ${envVars[varName]}`);
    }
  });
  
  // Check for localhost in production URLs
  if (envVars.VITE_BACKEND_URL && envVars.VITE_BACKEND_URL.includes('localhost')) {
    console.error('❌ VITE_BACKEND_URL should not contain localhost in production');
    hasErrors = true;
  }
  
  if (envVars.VITE_FRONTEND_URL && envVars.VITE_FRONTEND_URL.includes('localhost')) {
    console.error('❌ VITE_FRONTEND_URL should not contain localhost in production');
    hasErrors = true;
  }
  
  // Check Cashfree mode
  if (envVars.VITE_CASHFREE_MODE === 'sandbox') {
    console.warn('⚠️  Warning: Using Cashfree sandbox mode in production');
  }
  
  if (hasErrors) {
    console.error('\n❌ Environment validation failed!');
    console.log('Please fix the above issues before building for production.');
    process.exit(1);
  }
  
  console.log('\n✅ Environment validation passed!');
  console.log('🚀 Ready for production build.');
};

checkEnvironment();
