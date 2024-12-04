#!/usr/bin/env node

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Get command line arguments
const targetUrl = process.argv[2];
const viewportSize = process.argv[3];

if (!targetUrl || !viewportSize) {
  console.log('Usage: node screenshot-capture.js <url> <widthxheight>');
  console.log('Example: node screenshot-capture.js zapier.com 1440x900');
  process.exit(1);
}

// Parse viewport dimensions
const [width, height] = viewportSize.split('x').map(Number);

if (!width || !height) {
  console.log('Invalid viewport format. Use widthxheight (e.g., 1440x900)');
  process.exit(1);
}

async function captureScreenshot() {
  // Ensure screenshots directory exists
  const screenshotDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir);
  }

  // Format URL (add https:// if not present)
  const url = targetUrl.startsWith('http') ? targetUrl : `https://${targetUrl}`;

  console.log(`Capturing screenshot of ${url} at ${width}x${height}`);

  // Launch the browser
  const browser = await puppeteer.launch({ headless: "new" });

  try {
    const page = await browser.newPage();
    
    // Set viewport size
    await page.setViewport({ width, height });

    // Navigate to URL
    await page.goto(url, { waitUntil: 'networkidle0' });

    // Generate filename
    const filename = `${targetUrl.replace(/[^a-zA-Z0-9]/g, '-')}-${width}x${height}.png`;
    const filepath = path.join(screenshotDir, filename);

    // Take screenshot
    await page.screenshot({ 
      path: filepath,
      fullPage: false // Only capture viewport
    });

    console.log(`Screenshot saved as: ${filename}`);
  } catch (error) {
    console.error('Error capturing screenshot:', error);
  } finally {
    await browser.close();
  }
}

// Run the screenshot capture
captureScreenshot();