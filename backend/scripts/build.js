#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const buildDir = 'dist';

// Step 1: Run TypeScript compilation
console.log('🔨 Running TypeScript compilation...');
try {
  execSync('tsc', { stdio: 'inherit' });
  console.log('✅ TypeScript compilation completed');
} catch (error) {
  console.error('❌ TypeScript compilation failed');
  process.exit(1);
}

// Step 2: Run tsc-alias for @/ imports
console.log('🔧 Running tsc-alias to resolve @/ imports...');
try {
  execSync('tsc-alias', { stdio: 'inherit' });
  console.log('✅ tsc-alias completed');
} catch (error) {
  console.error('❌ tsc-alias failed');
  process.exit(1);
}

console.log('🎉 Build completed successfully!');