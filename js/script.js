// Tailwind configuration
tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Bai Jamjuree', 'sans-serif'],
            }
        }
    }
}

// Add language initialization
function initializeLanguage() {
    document.getElementById('languageSelect').value = window.currentLanguage;
    window.updatePageLanguage();
}

function updatePageLanguage() {
    const texts = window.i18n[window.currentLanguage];
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const keys = key.split('.');
        let value = texts;
        for (const k of keys) {
            value = value[k];
        }
        if (value) element.textContent = value;
    });
}

// Check for saved dark mode preference on page load
if (localStorage.getItem('darkMode') === 'true') {
    document.documentElement.classList.remove('light');
    document.documentElement.classList.add('dark');
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    initializeLanguage();
    // Check dark mode preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
    }
    
    // Initial load of screenshot history
    updateScreenshotHistory();
    
    // Initialize icons
    lucide.createIcons();
    
    // Setup event listeners
    setupEventListeners();
});

// Dark mode toggle functionality
document.getElementById('darkModeToggle').addEventListener('click', () => {
    const html = document.documentElement;
    const isDark = html.classList.toggle('dark');
    html.classList.toggle('light', !isDark);
    localStorage.setItem('darkMode', isDark);
});

// Handle form submission and update history
document.getElementById('screenshotForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const url = document.getElementById('url').value;
    const width = document.getElementById('width').value;
    const height = document.getElementById('height').value;

    const button = document.getElementById('captureButton');
    const buttonText = document.getElementById('buttonText');
    const loader = document.getElementById('loader');

    // Show loading state
    button.disabled = true;
    buttonText.textContent = window.i18n[window.currentLanguage].form.capturing;
    loader.classList.remove('hidden');

    try {
        const response = await fetch('/capture-screenshot', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url, width, height })
        });

        const result = await response.json();
        if (result.success) {
            // Show success message
            const resultDiv = document.getElementById('result');
            const resultMessage = document.getElementById('resultMessage');
            resultDiv.classList.remove('hidden');
            resultMessage.textContent = `Screenshot saved as: ${result.filename}`;

            // Save screenshot data to localStorage
            const screenshots = JSON.parse(localStorage.getItem('screenshots') || '[]');
            screenshots.unshift({
                url,
                dimensions: `${width}x${height}`,
                timestamp: new Date().toISOString(),
                imageData: result.imageData,
                filename: result.filename
            });
            localStorage.setItem('screenshots', JSON.stringify(screenshots));
            
            // Update the history table immediately
            updateScreenshotHistory();
            showToast(window.i18n[window.currentLanguage].messages.success);
        } else {
            throw new Error(result.error || 'Failed to capture screenshot');
        }
    } catch (error) {
        console.error('Error:', error);
        const resultDiv = document.getElementById('result');
        const resultMessage = document.getElementById('resultMessage');
        resultDiv.classList.remove('hidden');
        resultMessage.textContent = `Error: ${error.message}`;
        resultMessage.classList.add('text-red-600');
        showToast(`Error: ${error.message}`, 'error');
    } finally {
        // Reset button state
        button.disabled = false;
        buttonText.textContent = window.i18n[window.currentLanguage].form.capture;
        loader.classList.add('hidden');
    }
});

function updateScreenshotHistory() {
    const screenshots = JSON.parse(localStorage.getItem('screenshots') || '[]');
    const historySection = document.getElementById('historySection');
    const tbody = document.getElementById('screenshotHistory');
    
    if (screenshots.length === 0) {
        historySection.classList.add('hidden');
        historySection.classList.remove('fade-scale-in');
        return;
    }

    historySection.classList.remove('hidden');
    historySection.classList.add('fade-scale-in');
    
    tbody.innerHTML = screenshots.map((screenshot, index) => `
        <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
            <td class="px-6 py-4">
                <img src="${screenshot.imageData}" alt="Preview" 
                    class="w-20 h-12 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                    onclick="openLightbox(${index})">
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">${screenshot.url}</td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">${screenshot.dimensions}</td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">
                <div class="flex items-center">
                    <i data-lucide="clock" class="w-4 h-4 mr-2"></i>
                    ${new Date(screenshot.timestamp).toLocaleString()}
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap space-x-2">
                <button onclick="downloadScreenshot('${screenshot.filename}')" 
                    class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                    <i data-lucide="download" class="w-5 h-5"></i>
                </button>
                <button onclick="deleteScreenshot('${screenshot.timestamp}')"
                    class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300">
                    <i data-lucide="trash-2" class="w-5 h-5"></i>
                </button>
            </td>
        </tr>
    `).join('');
    lucide.createIcons();
}

// Lightbox functionality
let currentImageIndex = 0;
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');

function openLightbox(index) {
    const screenshots = JSON.parse(localStorage.getItem('screenshots') || '[]');
    currentImageIndex = index;
    lightbox.classList.add('active');
    // Add a small delay to trigger the transition
    setTimeout(() => {
        updateLightboxImage();
    }, 50);
}

function updateLightboxImage() {
    const screenshots = JSON.parse(localStorage.getItem('screenshots') || '[]');
    const screenshot = screenshots[currentImageIndex];
    lightboxImage.src = screenshot.imageData;
    
    // Update navigation buttons visibility
    document.getElementById('prevImage').style.visibility = 
        currentImageIndex > 0 ? 'visible' : 'hidden';
    document.getElementById('nextImage').style.visibility = 
        currentImageIndex < screenshots.length - 1 ? 'visible' : 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.style.opacity = '0';
    setTimeout(() => {
        lightbox.classList.remove('active');
        lightbox.style.opacity = '';
    }, 300);
}

document.getElementById('closeLightbox').addEventListener('click', closeLightbox);

document.getElementById('prevImage').addEventListener('click', () => {
    if (currentImageIndex > 0) {
        currentImageIndex--;
        updateLightboxImage();
    }
});

document.getElementById('nextImage').addEventListener('click', () => {
    const screenshots = JSON.parse(localStorage.getItem('screenshots') || '[]');
    if (currentImageIndex < screenshots.length - 1) {
        currentImageIndex++;
        updateLightboxImage();
    }
});

// Close lightbox with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});

// Fix for the toast classes issue
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    toastMessage.textContent = message;
    
    // Remove existing background classes
    toast.classList.remove('bg-red-50', 'dark:bg-red-900', 'bg-green-50', 'dark:bg-green-900');
    
    // Add new background classes separately
    if (type === 'error') {
        toast.classList.add('bg-red-50');
        toast.classList.add('dark:bg-red-900');
    } else {
        toast.classList.add('bg-green-50');
        toast.classList.add('dark:bg-green-900');
    }
    
    // Show the toast
    toast.classList.remove('hidden');
    // Use setTimeout to ensure the transition happens
    setTimeout(() => {
        toast.classList.remove('translate-y-full');
    }, 10);
    
    // Hide the toast
    setTimeout(() => {
        toast.classList.add('translate-y-full');
        // Add hidden class after transition completes
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 300);
    }, 3000);
}

// Initial load of screenshot history
updateScreenshotHistory();

let screenshotToDelete = null;

function deleteScreenshot(timestamp) {
    screenshotToDelete = timestamp;
    document.getElementById('deleteModal').classList.add('active');
}

// Delete confirmation handling
document.getElementById('cancelDelete').addEventListener('click', () => {
    document.getElementById('deleteModal').classList.remove('active');
    screenshotToDelete = null;
});

document.getElementById('confirmDelete').addEventListener('click', () => {
    if (screenshotToDelete) {
        const screenshots = JSON.parse(localStorage.getItem('screenshots') || '[]');
        const updatedScreenshots = screenshots.filter(s => s.timestamp !== screenshotToDelete);
        localStorage.setItem('screenshots', JSON.stringify(updatedScreenshots));
        updateScreenshotHistory();
        showToast(window.i18n[window.currentLanguage].messages.deleted);
    }
    document.getElementById('deleteModal').classList.remove('active');
    screenshotToDelete = null;
});

// Close modal when clicking outside
document.getElementById('deleteModal').addEventListener('click', (e) => {
    if (e.target.id === 'deleteModal') {
        document.getElementById('deleteModal').classList.remove('active');
        screenshotToDelete = null;
    }
});

// Updated lightbox handling
document.getElementById('lightbox').addEventListener('click', (e) => {
    // Close lightbox if clicking outside the image or navigation controls
    if (e.target.id === 'lightbox') {
        closeLightbox();
    }
});

// Add event listener to prevent clicks on the image from closing the lightbox
document.getElementById('lightboxImage').addEventListener('click', (e) => {
    e.stopPropagation();
});

// Prevent clicks on navigation buttons from closing the lightbox
document.querySelectorAll('.lightbox-controls button').forEach(button => {
    button.addEventListener('click', (e) => {
        e.stopPropagation();
    });
});

// Add resolution preset functionality
function setResolution(width, height) {
    document.getElementById('width').value = width;
    document.getElementById('height').value = height;
}

// Add language change handler
document.getElementById('languageSelect').addEventListener('change', (e) => {
    window.currentLanguage = e.target.value;
    localStorage.setItem('language', window.currentLanguage);
    window.updatePageLanguage();
});

// Update lucide icons when the page loads
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
});