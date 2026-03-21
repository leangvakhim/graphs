// --- 1. SETTING UP THE CANVAS & DATA ---
const canvas = document.getElementById('pairplotCanvas');
const ctx = canvas.getContext('2d');

// Handle High-DPI displays for crisp rendering
const size = 600;
const dpr = window.devicePixelRatio || 1;
canvas.width = size * dpr;
canvas.height = size * dpr;
ctx.scale(dpr, dpr);

const padding = 50; // Padding around the whole chart
const nFeatures = 3;
const cellSize = (size - 2 * padding) / nFeatures;

const featureNames = ["Size (cm)", "Weight (kg)", "Speed (mph)"];
const colors = ["#FF6B6B", "#4ECDC4", "#F4D03F"]; // Red, Teal/Blue, Yellow

// Helper: Generate Normally Distributed Random Numbers (Box-Muller)
function randNormal(mean, stdDev) {
    let u = 1 - Math.random();
    let v = Math.random();
    let z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return z * stdDev + mean;
}

// Generate Simulated Clustered Data
const data = [];
const numPointsPerClass = 50;

// Class 0: Red Foxes (Medium size, heavy, fast)
for (let i = 0; i < numPointsPerClass; i++) {
    data.push({ c: 0, f: [randNormal(50, 5), randNormal(15, 2), randNormal(30, 4)] });
}
// Class 1: Blue Birds (Small size, light, fast)
for (let i = 0; i < numPointsPerClass; i++) {
    data.push({ c: 1, f: [randNormal(20, 3), randNormal(2, 0.5), randNormal(40, 5)] });
}
// Class 2: Yellow Frogs (Very small size, very light, slow)
for (let i = 0; i < numPointsPerClass; i++) {
    data.push({ c: 2, f: [randNormal(10, 2), randNormal(0.5, 0.1), randNormal(5, 2)] });
}

// Find min and max for each feature to scale them nicely inside the cells
const domains = [0, 1, 2].map(featureIdx => {
    const values = data.map(d => d.f[featureIdx]);
    // Add a 10% buffer to min and max so points don't sit directly on the borders
    let min = Math.min(...values);
    let max = Math.max(...values);
    let buffer = (max - min) * 0.1;
    return { min: min - buffer, max: max + buffer };
});


// --- 2. DRAWING FUNCTIONS ---

function drawScatterPlot(ox, oy, width, colIdx, rowIdx) {
    const innerPad = 5;
    const domX = domains[colIdx];
    const domY = domains[rowIdx];

    data.forEach(point => {
        // Map the data value to pixel coordinates within the cell
        const px = ox + innerPad + ((point.f[colIdx] - domX.min) / (domX.max - domX.min)) * (width - 2 * innerPad);
        // Y is inverted because canvas Y goes top-to-bottom
        const py = oy + width - innerPad - ((point.f[rowIdx] - domY.min) / (domY.max - domY.min)) * (width - 2 * innerPad);

        // Draw dot
        ctx.beginPath();
        ctx.arc(px, py, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = colors[point.c] + "99"; // Add transparency (hex 99)
        ctx.fill();
        ctx.strokeStyle = colors[point.c];
        ctx.lineWidth = 1;
        ctx.stroke();
    });
}

function drawHistogram(ox, oy, width, featIdx) {
    const innerPad = 5;
    const dom = domains[featIdx];
    const numBins = 12;
    const binWidth = (dom.max - dom.min) / numBins;

    // Initialize bin counts [class][bin]
    const counts = [[], [], []];
    for (let c = 0; c < 3; c++) {
        for (let b = 0; b < numBins; b++) counts[c][b] = 0;
    }

    // Fill bins
    data.forEach(point => {
        let bin = Math.floor((point.f[featIdx] - dom.min) / binWidth);
        if (bin >= numBins) bin = numBins - 1;
        if (bin < 0) bin = 0;
        counts[point.c][bin]++;
    });

    // Find absolute max count to scale bar heights
    let maxCount = 0;
    counts.forEach(classBins => {
        classBins.forEach(val => { if (val > maxCount) maxCount = val; });
    });

    // Draw bars
    const chartW = width - 2 * innerPad;
    const chartH = width - 2 * innerPad;
    const bw = chartW / numBins;

    for (let b = 0; b < numBins; b++) {
        for (let c = 0; c < 3; c++) {
            if (counts[c][b] > 0) {
                const h = (counts[c][b] / maxCount) * (chartH * 0.85); // up to 85% of cell height
                const px = ox + innerPad + b * bw;
                const py = oy + width - innerPad - h;

                ctx.fillStyle = colors[c] + "77"; // Transparency
                ctx.fillRect(px, py, bw, h);
                ctx.strokeStyle = colors[c];
                ctx.lineWidth = 1;
                ctx.strokeRect(px, py, bw, h);
            }
        }
    }
}

// --- 3. MAIN RENDER LOOP ---

function renderPairPlot() {
    // Clear background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);

    for (let row = 0; row < nFeatures; row++) {
        for (let col = 0; col < nFeatures; col++) {

            const x = padding + col * cellSize;
            const y = padding + row * cellSize;

            // Draw Cell Background & Border
            ctx.fillStyle = "#F9FAFB"; // tailwind gray-50
            ctx.fillRect(x, y, cellSize, cellSize);
            ctx.strokeStyle = "#E5E7EB"; // tailwind gray-200
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y, cellSize, cellSize);

            // If we are on the diagonal, draw Histogram, else draw Scatter
            if (row === col) {
                drawHistogram(x, y, cellSize, row);

                // Add big feature label right in the middle
                ctx.fillStyle = "#1F2937"; // tailwind gray-800
                ctx.font = "bold 16px 'Segoe UI', sans-serif";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                // Draw slight white glow behind text for readability
                ctx.shadowColor = "white";
                ctx.shadowBlur = 4;
                ctx.fillText(featureNames[row], x + cellSize / 2, y + 20);
                ctx.shadowBlur = 0; // reset shadow

            } else {
                drawScatterPlot(x, y, cellSize, col, row);
            }

            // Draw outer axes labels (Left and Bottom)
            ctx.fillStyle = "#6B7280"; // tailwind gray-500
            ctx.font = "12px 'Segoe UI', sans-serif";

            // Left Y-Axis labels (only on the first column)
            if (col === 0 && row !== col) {
                ctx.save();
                ctx.translate(x - 15, y + cellSize / 2);
                ctx.rotate(-Math.PI / 2);
                ctx.textAlign = "center";
                ctx.textBaseline = "bottom";
                ctx.fillText(featureNames[row], 0, 0);
                ctx.restore();
            }

            // Bottom X-Axis labels (only on the last row)
            if (row === nFeatures - 1 && row !== col) {
                ctx.textAlign = "center";
                ctx.textBaseline = "top";
                ctx.fillText(featureNames[col], x + cellSize / 2, y + cellSize + 10);
            }
        }
    }
}

// Execute render
renderPairPlot();