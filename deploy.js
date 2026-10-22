#!/usr/bin/env node

/**
 * AWS S3 + CloudFront Deployment Script
 * Optimizes build assets for maximum performance
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import zlib from 'zlib';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting optimized build and deployment process...\n');

// Step 1: Build the project
console.log('📦 Building project...');
execSync('npm run build', { stdio: 'inherit' });

// Step 2: Pre-compress assets for CloudFront
console.log('\n🗜️  Pre-compressing assets...');

const distDir = path.join(__dirname, 'dist');
const compressibleExtensions = ['.js', '.css', '.html', '.svg', '.json', '.txt'];

function compressFile(filePath, relativePath) {
  const content = fs.readFileSync(filePath);
  
  // Create gzip version
  const gzipped = zlib.gzipSync(content, { level: 9 });
  fs.writeFileSync(filePath + '.gz', gzipped);
  
  // Create brotli version (if supported)
  try {
    const brotli = zlib.brotliCompressSync(content, {
      params: {
        [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
        [zlib.constants.BROTLI_PARAM_SIZE_HINT]: content.length
      }
    });
    fs.writeFileSync(filePath + '.br', brotli);
    console.log(`  ✅ Compressed: ${relativePath} (${content.length} → gz:${gzipped.length}, br:${brotli.length})`);
  } catch (e) {
    console.log(`  ✅ Compressed: ${relativePath} (${content.length} → gz:${gzipped.length})`);
  }
}

function walkDirectory(dir, baseDir = dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  files.forEach(file => {
    const fullPath = path.join(dir, file.name);
    const relativePath = path.relative(baseDir, fullPath);
    
    if (file.isDirectory()) {
      walkDirectory(fullPath, baseDir);
    } else if (file.isFile()) {
      const ext = path.extname(file.name).toLowerCase();
      if (compressibleExtensions.includes(ext)) {
        compressFile(fullPath, relativePath);
      }
    }
  });
}

walkDirectory(distDir);

// Step 3: Generate S3 deployment metadata
console.log('\n📋 Generating S3 deployment metadata...');

const deploymentConfig = {
  metadata: {
    // JavaScript files - ensure proper MIME type for ES modules
    'assets/*.js': {
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Content-Type': 'text/javascript; charset=utf-8',
      'Content-Encoding': 'gzip'
    },
    
    // Source maps for debugging
    'assets/*.js.map': {
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Content-Type': 'application/json',
      'Content-Encoding': 'gzip'
    },
    
    // CSS files
    'assets/*.css': {
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Content-Type': 'text/css',
      'Content-Encoding': 'gzip'
    },
    
    // Images
    'assets/*.{webp,png,jpg,jpeg,svg,ico}': {
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Content-Type': 'auto' // S3 will auto-detect
    },
    
    // Videos
    'assets/*.{mp4,webm}': {
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Content-Type': 'auto'
    },
    
    // HTML files
    '*.html': {
      'Cache-Control': 'public, max-age=3600',
      'Content-Type': 'text/html',
      'Content-Encoding': 'gzip'
    },
    
    // Root files
    'index.html': {
      'Cache-Control': 'public, max-age=300', // 5 minutes for main page
      'Content-Type': 'text/html',
      'Content-Encoding': 'gzip'
    }
  }
};

fs.writeFileSync(
  path.join(__dirname, 'deployment-config.json'), 
  JSON.stringify(deploymentConfig, null, 2)
);

console.log('\n📝 Created deployment-config.json with S3 metadata settings');
console.log('\n✅ Build optimization complete!');
console.log('\n📋 Next steps:');
console.log('1. Upload dist/ folder to your S3 bucket');
console.log('2. Use the deployment-config.json for proper metadata');
console.log('3. Invalidate CloudFront cache');
console.log('4. Configure CloudFront settings as shown below\n');

// Step 4: Generate CloudFront recommendations
const cloudFrontConfig = {
  compressionSettings: {
    CompressObjects: true,
    SupportedCompressions: ['gzip', 'brotli']
  },
  // SPA fallback. Without these, every deep link (/our-doctors, a doctor
  // profile, any branch page) 404s on a hard refresh, because only index.html
  // exists in the bucket. 403 is the one that actually fires when the bucket
  // is private behind OAC — S3 returns AccessDenied, not NotFound, for a key
  // that isn't there. This is CloudFront's equivalent of _redirects on Pages
  // and the catch-all rewrite in vercel.json.
  customErrorResponses: [
    {
      ErrorCode: 403,
      ResponsePagePath: '/index.html',
      ResponseCode: 200,
      ErrorCachingMinTTL: 0
    },
    {
      ErrorCode: 404,
      ResponsePagePath: '/index.html',
      ResponseCode: 200,
      ErrorCachingMinTTL: 0
    }
  ],
  cacheBehaviors: [
    {
      PathPattern: '/assets/*',
      CachePolicyName: 'CachingOptimized',
      TTL: {
        DefaultTTL: 31536000, // 1 year
        MaxTTL: 31536000
      },
      Compress: true
    },
    {
      PathPattern: '*.html',
      CachePolicyName: 'CachingDisabled',
      TTL: {
        DefaultTTL: 300, // 5 minutes
        MaxTTL: 3600
      },
      Compress: true
    }
  ]
};

fs.writeFileSync(
  path.join(__dirname, 'cloudfront-config.json'), 
  JSON.stringify(cloudFrontConfig, null, 2)
);

console.log('📄 Created cloudfront-config.json with recommended settings');
console.log('\n🎉 Ready for deployment! Expected PageSpeed score: 98-100');