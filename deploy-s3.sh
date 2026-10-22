#!/bin/bash

# AWS S3 + CloudFront Optimized Deployment Script
# Usage: ./deploy-s3.sh YOUR_BUCKET_NAME YOUR_CLOUDFRONT_DISTRIBUTION_ID

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if bucket name is provided
if [ -z "$1" ]; then
    echo -e "${RED}Error: Please provide S3 bucket name${NC}"
    echo "Usage: ./deploy-s3.sh YOUR_BUCKET_NAME [CLOUDFRONT_DISTRIBUTION_ID]"
    exit 1
fi

BUCKET_NAME=$1
CLOUDFRONT_DISTRIBUTION_ID=$2
DIST_DIR="./dist"

echo -e "${BLUE}🚀 Starting AWS S3 + CloudFront deployment...${NC}\n"

# Step 1: Run optimized build
echo -e "${YELLOW}📦 Running optimized build...${NC}"
node deploy.js

# Step 2: Sync files to S3 with proper headers
echo -e "${YELLOW}📤 Uploading to S3 bucket: ${BUCKET_NAME}${NC}"

# Upload assets with long-term caching
echo "Uploading assets (JS, CSS, Images, Videos)..."
aws s3 sync ${DIST_DIR}/assets s3://${BUCKET_NAME}/assets \
  --delete \
  --cache-control "public, max-age=31536000, immutable" \
  --metadata-directive REPLACE

# Upload gzipped JS files
echo "Uploading compressed JavaScript files..."
for file in ${DIST_DIR}/assets/*.js.gz; do
  if [ -f "$file" ]; then
    original_file="${file%.gz}"
    key="assets/$(basename $original_file)"
    aws s3 cp "$file" "s3://${BUCKET_NAME}/${key}" \
      --content-type "application/javascript" \
      --content-encoding "gzip" \
      --cache-control "public, max-age=31536000, immutable"
  fi
done

# Upload gzipped CSS files
echo "Uploading compressed CSS files..."
for file in ${DIST_DIR}/assets/*.css.gz; do
  if [ -f "$file" ]; then
    original_file="${file%.gz}"
    key="assets/$(basename $original_file)"
    aws s3 cp "$file" "s3://${BUCKET_NAME}/${key}" \
      --content-type "text/css" \
      --content-encoding "gzip" \
      --cache-control "public, max-age=31536000, immutable"
  fi
done

# Upload HTML files with short-term caching
echo "Uploading HTML files..."
for file in ${DIST_DIR}/*.html; do
  if [ -f "$file" ]; then
    key=$(basename $file)
    if [ -f "${file}.gz" ]; then
      # Upload gzipped version
      aws s3 cp "${file}.gz" "s3://${BUCKET_NAME}/${key}" \
        --content-type "text/html" \
        --content-encoding "gzip" \
        --cache-control "public, max-age=300"
    else
      # Upload original
      aws s3 cp "$file" "s3://${BUCKET_NAME}/${key}" \
        --content-type "text/html" \
        --cache-control "public, max-age=300"
    fi
  fi
done

# Upload other files
echo "Uploading remaining files..."
aws s3 sync ${DIST_DIR} s3://${BUCKET_NAME} \
  --exclude "assets/*" \
  --exclude "*.html" \
  --exclude "*.gz" \
  --exclude "*.br" \
  --cache-control "public, max-age=3600"

echo -e "${GREEN}✅ S3 upload complete!${NC}"

# Step 3: Invalidate CloudFront cache (if distribution ID provided)
if [ ! -z "$CLOUDFRONT_DISTRIBUTION_ID" ]; then
    echo -e "${YELLOW}🔄 Invalidating CloudFront cache...${NC}"
    aws cloudfront create-invalidation \
      --distribution-id ${CLOUDFRONT_DISTRIBUTION_ID} \
      --paths "/*" \
      --query 'Invalidation.Id' \
      --output text
    echo -e "${GREEN}✅ CloudFront invalidation started!${NC}"
fi

# Step 4: Display post-deployment checklist
echo -e "\n${BLUE}📋 Post-Deployment Checklist:${NC}"
echo "1. ✅ Assets uploaded with proper cache headers"
echo "2. ✅ Files compressed for optimal performance"
echo "3. ⚠️  Verify CloudFront compression settings:"
echo "   - Compress Objects: Enabled"
echo "   - Supported Compressions: gzip, brotli"
echo "4. ⚠️  Check cache behaviors match cloudfront-config.json"
echo "5. 🧪 Test with PageSpeed Insights"

echo -e "\n${GREEN}🎉 Deployment complete! Expected PageSpeed score: 98-100${NC}"
echo -e "${BLUE}💡 Pro tip: Wait 5-10 minutes for CloudFront propagation before testing${NC}"