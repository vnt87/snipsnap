# SnipSnap - Webpage Screenshot Capture

<p align="center">
  <img src="office_meme.gif" alt="SnipSnap meme">
</p>

## Overview
This script uses Puppeteer to capture screenshots of a webpage at multiple viewport sizes, useful for responsive design testing.

## Prerequisites
- Node.js installed
- npm (Node Package Manager)

## Setup
1. Clone the repository
2. Run `npm install` to install dependencies

## Usage
1. From your terminal, simply run `node screenshot-capture.js {url} {resolution}`
2. Your screenshot will be automatically saved in the `screenshots` directory. For example, `node screenshot-capture.js namvu.net 1440x900` will save a file called `screenshots\namvu-net-1440x900.png`

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

## Roadmap

✅ CLI Tool

✅ Web UI

✅ Light/Dark mode support

✅ Preset resolutions

✅ Docker image

✅ Implement lightbox

✅ Implement delete function

✅ Multi language support
  - English
  - Vietnamese
  - Other (post a request in the [Issues tab](https://github.com/vnt87/puppeteeer-capture/issues) if you want your language implemented)

☐ Penpot plugin

☐ Figma plugin

## Update 12/21/2024: New WebUI!
![WebUI Screenshot](screenshot.png)
Just hacked together a quick WebUI using Tailwind.

## How to use the WebUI

### Node server
1. Clone this repo
2. Install dependencies
```bash
npm install
```
3. Start the server
```bash
npm start
```
4. Access the application at http://localhost:3000

### Docker
1. Download [docker-compose.yml](https://raw.githubusercontent.com/vnt87/snipsnap/refs/heads/main/docker-compose.yml)
2. Create a `screenshots` directory in the same location as your `docker-compose.yml`:
  ```bash
  mkdir screenshots
  ```
3. Run the following command to start the Docker container:
  ```bash
  sudo docker-compose up -d
  ```
4. Access the application at http://localhost:7654

Your screenshots will be saved in the `screenshots` directory.
