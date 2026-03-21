// --- State Management ---
const DOMAIN_MAX = 100;
let dataPoints = [15, 22, 25, 30, 60, 65, 80]; // Initial dummy data
let bandwidth = 8;
let showIndividualKernels = true;

// Colors for individual kernels to make it colorful
const palette = [
    'rgba(255, 99, 132, 0.6)',   // Pink/Red
    'rgba(54, 162, 235, 0.6)',   // Blue
    'rgba(255, 206, 86, 0.6)',   // Yellow
    'rgba(75, 192, 192, 0.6)',   // Teal
    'rgba(153, 102, 255, 0.6)',  // Purple
    'rgba(255, 159, 64, 0.6)',   // Orange
    'rgba(46, 204, 113, 0.6)'    // Green
];

// --- DOM Elements ---
const canvas = document.getElementById('kdeCanvas');
const ctx = canvas.getContext('2d');
const bandwidthSlider = document.getElementById('bandwidth');
const bandwidthDisplay = document.getElementById('bandwidthValue');
const clearBtn = document.getElementById('clearBtn');
const toggleKernels = document.getElementById('toggleKernels');
const toggleDot = document.getElementById('toggleDot');
const toggleBg = document.getElementById('toggleBg');

// --- Math Functions ---

// Gaussian Kernel Function
// Calculates the height (y) of the bell curve for a given x, centered at x_i, with standard deviation h
function gaussianKernel(x, xi, h) {
    const coefficient = 1 / (h * Math.sqrt(2 * Math.PI));
    const exponent = -0.5 * Math.pow((x - xi) / h, 2);
    return coefficient * Math.exp(exponent);
}

// --- Canvas Drawing Logic ---

function resizeCanvas() {
    // Make canvas physical pixels match its display size for crisp rendering
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    drawKDE();
}

function drawKDE() {
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    if (dataPoints.length === 0) {
        // Draw prompt if empty
        ctx.fillStyle = '#94a3b8';
        ctx.font = '16px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Click anywhere to add data points', width / 2, height / 2);
        return;
    }

    // Margin for drawing
    const margin = 40;
    const bottomY = height - margin;

    // Step 1: Calculate KDE curve for every pixel on the X axis
    const resolution = width; // Calculate at every pixel for smoothness
    let totalKDEValues = new Array(resolution).fill(0);
    let maxKdeValue = 0;

    // Arrays to hold individual kernel curves for visualization
    let individualCurves = dataPoints.map(() => new Array(resolution).fill(0));

    for (let pixelX = 0; pixelX < resolution; pixelX++) {
        // Map pixelX to our data domain (0 to 100)
        const dataX = (pixelX / width) * DOMAIN_MAX;

        let sumDensity = 0;

        // Add up contributions from every data point's kernel
        for (let i = 0; i < dataPoints.length; i++) {
            const density = gaussianKernel(dataX, dataPoints[i], bandwidth);
            individualCurves[i][pixelX] = density;
            sumDensity += density;
        }

        // Average the densities (Standard KDE formula: 1/n * sum(kernels))
        sumDensity = sumDensity / dataPoints.length;
        totalKDEValues[pixelX] = sumDensity;

        if (sumDensity > maxKdeValue) {
            maxKdeValue = sumDensity;
        }
    }

    // We need a dynamic scale so the curves fit nicely on the canvas
    // We'll scale the maximum density to fill about 75% of the canvas height
    // We also need to consider individual kernel peaks, which might be higher than the average sum
    // if data points are sparse. Let's find the absolute max Y needed.
    let globalMaxY = maxKdeValue;
    if (showIndividualKernels && dataPoints.length > 1) {
        // A single kernel's peak is roughly 1 / (h * sqrt(2*PI))
        // Since we don't divide individual curves by N when drawing them (to show their raw shape),
        // we might need to adjust the scale so they don't clip.
        const singlePeak = gaussianKernel(0, 0, bandwidth);
        if (singlePeak > globalMaxY) globalMaxY = singlePeak;
    }

    // Add 10% padding to the top
    const scaleY = (height - margin * 2) / (globalMaxY * 1.1);

    // Step 2: Draw individual kernels (The "Bumps")
    if (showIndividualKernels) {
        ctx.lineWidth = 2;
        for (let i = 0; i < dataPoints.length; i++) {
            ctx.beginPath();
            ctx.strokeStyle = palette[i % palette.length]; // Cycle through colors

            for (let pixelX = 0; pixelX < resolution; pixelX++) {
                const yVal = individualCurves[i][pixelX];
                const canvasY = bottomY - (yVal * scaleY);

                if (pixelX === 0) ctx.moveTo(pixelX, canvasY);
                else ctx.lineTo(pixelX, canvasY);
            }
            ctx.stroke();
        }
    }

    // Step 3: Draw the final sum KDE curve
    ctx.beginPath();
    ctx.lineWidth = 4;
    // Create a nice gradient for the line
    const lineGradient = ctx.createLinearGradient(0, 0, width, 0);
    lineGradient.addColorStop(0, '#6366f1'); // Indigo
    lineGradient.addColorStop(1, '#8b5cf6'); // Violet
    ctx.strokeStyle = lineGradient;

    // Store path for filling
    ctx.moveTo(0, bottomY);

    for (let pixelX = 0; pixelX < resolution; pixelX++) {
        const yVal = totalKDEValues[pixelX];
        const canvasY = bottomY - (yVal * scaleY);
        ctx.lineTo(pixelX, canvasY);
    }
    ctx.stroke();

    // Fill under the KDE curve
    ctx.lineTo(width, bottomY);
    ctx.lineTo(0, bottomY);
    ctx.closePath();

    const fillGradient = ctx.createLinearGradient(0, 0, 0, bottomY);
    fillGradient.addColorStop(0, 'rgba(99, 102, 241, 0.2)');
    fillGradient.addColorStop(1, 'rgba(139, 92, 246, 0.05)');
    ctx.fillStyle = fillGradient;
    ctx.fill();

    // Step 4: Draw the Data Points (Rug Plot on X-axis)
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#3b82f6'; // Blue
    for (let i = 0; i < dataPoints.length; i++) {
        const pixelX = (dataPoints[i] / DOMAIN_MAX) * width;
        ctx.beginPath();
        ctx.moveTo(pixelX, bottomY);
        ctx.lineTo(pixelX, bottomY + 15); // Tick mark length
        ctx.stroke();

        // Draw tiny circle at the bottom of the tick
        ctx.beginPath();
        ctx.arc(pixelX, bottomY + 15, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#2563eb';
        ctx.fill();
    }

    // Draw X Axis line
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#cbd5e1';
    ctx.moveTo(0, bottomY);
    ctx.lineTo(width, bottomY);
    ctx.stroke();
}

// --- Event Listeners ---

// Handle window resize
window.addEventListener('resize', resizeCanvas);

// Handle Bandwidth Slider
bandwidthSlider.addEventListener('input', (e) => {
    bandwidth = parseFloat(e.target.value);
    bandwidthDisplay.textContent = `Bandwidth: ${bandwidth}`;
    drawKDE();
});

// Handle clicking on Canvas to add points
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    // Get X coordinate relative to canvas
    const clickX = e.clientX - rect.left;
    // Map pixel back to domain (0-100)
    const dataX = (clickX / canvas.width) * DOMAIN_MAX;

    // Add point and redraw
    dataPoints.push(dataX);
    drawKDE();
});

// Handle Clear Button
clearBtn.addEventListener('click', () => {
    dataPoints = [];
    drawKDE();
});

// Handle Toggle for individual kernels
toggleKernels.addEventListener('change', (e) => {
    showIndividualKernels = e.target.checked;

    // Update toggle UI
    if (showIndividualKernels) {
        toggleDot.style.transform = 'translateX(100%)';
        toggleBg.classList.replace('bg-gray-200', 'bg-violet-500');
    } else {
        toggleDot.style.transform = 'translateX(0)';
        toggleBg.classList.replace('bg-violet-500', 'bg-gray-200');
    }

    drawKDE();
});

// --- Initialization ---
// Setup initial toggle styling
if (showIndividualKernels) {
    toggleBg.classList.add('bg-violet-500');
    toggleBg.classList.remove('bg-gray-200');
}

// Initial setup and draw
resizeCanvas();
