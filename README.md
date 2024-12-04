# Webpage Screenshot Capture

## Overview
This script uses Puppeteer to capture screenshots of a webpage at multiple viewport sizes, useful for responsive design testing.

## Prerequisites
- Node.js installed
- npm (Node Package Manager)

## Setup
1. Clone the repository
2. Run `npm install` to install dependencies

## Usage
1. Open `screenshot-capture.js`
2. Replace the `url` variable with the website you want to capture
3. Modify the `viewports` array to include desired screen sizes
4. Run the script with `npm run capture`

## Features
- Captures full-page screenshots
- Supports multiple viewport sizes
- Automatically creates a `screenshots` directory
- Generates viewport-specific filenames

## Customization
- Add or remove viewport sizes in the `viewports` array
- Adjust `waitUntil` and `waitForTimeout` as needed for page loading

## Troubleshooting
- Ensure you have the latest version of Node.js
- Check that the target website allows screenshot capture
