const express = require('express');
const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer');
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle screenshot capture requests
app.post('/capture-screenshot', async (req, res) => {
    const { url, width, height } = req.body;
    
    try {
        const result = await captureScreenshot(url, `${width}x${height}`);
        const imageBuffer = fs.readFileSync(result.filepath);
        const imageData = `data:image/png;base64,${imageBuffer.toString('base64')}`;
        
        res.json({ 
            success: true, 
            filename: result.filename,
            imageData
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Modified version of the original screenshot capture function
async function captureScreenshot(targetUrl, viewportSize) {
    const [width, height] = viewportSize.split('x').map(Number);
    const screenshotDir = path.join(__dirname, 'screenshots');
    let browser = null;

    if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir);
    }

    const url = targetUrl.startsWith('http') ? targetUrl : `https://${targetUrl}`;
    
    try {
        browser = await puppeteer.launch({
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--headless'
            ],
            ignoreHTTPSErrors: true
        });

        const page = await browser.newPage();
        await page.setViewport({ width, height });
        await page.goto(url, { waitUntil: 'networkidle0' });

        const filename = `${targetUrl.replace(/[^a-zA-Z0-9]/g, '-')}-${width}x${height}.png`;
        const filepath = path.join(screenshotDir, filename);

        await page.screenshot({ path: filepath, fullPage: false });
        return { filename, filepath };
    } finally {
        if (browser) await browser.close();
    }
}
