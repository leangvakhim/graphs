// <!-- JavaScript Logic -->
// 1. Data Generation (Creating realistic "bimodal" sample data)
// We use a Box-Muller transform to generate normally distributed random numbers
function generateRandomNormal(mean, stdDev) {
    let u = 0, v = 0;
    while (u === 0) u = Math.random(); // Converting [0,1) to (0,1)
    while (v === 0) v = Math.random();
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return num * stdDev + mean;
}

// Generate data: A mix of two groups (e.g., heights of two different species)
const rawData = [];
for (let i = 0; i < 300; i++) rawData.push(generateRandomNormal(45, 12)); // Group 1 peak at 45
for (let i = 0; i < 200; i++) rawData.push(generateRandomNormal(75, 10)); // Group 2 peak at 75

// Min and Max for our chart axis
const dataMin = 10;
const dataMax = 110;

let myChart = null; // Hold chart instance

// 2. The Math behind KDE (Gaussian Kernel)
function gaussianKernel(x, xi, bandwidth) {
    return (1 / (bandwidth * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - xi) / bandwidth, 2));
}

// 3. Main function to calculate and draw the chart
function updateChart() {
    const binWidth = parseInt(document.getElementById('binWidthSlider').value);
    const bandwidth = parseInt(document.getElementById('bandwidthSlider').value);

    // Update UI Badges
    document.getElementById('binWidthValue').innerText = binWidth;
    document.getElementById('bandwidthValue').innerText = bandwidth;

    // --- Step A: Process Histogram (The Blocks) ---
    const bins = [];
    const labels = [];

    // Create empty buckets
    for (let i = dataMin; i <= dataMax; i += binWidth) {
        bins.push(0);
        labels.push(`${i} - ${i + binWidth}`);
    }

    // Drop data into buckets
    rawData.forEach(value => {
        let binIndex = Math.floor((value - dataMin) / binWidth);
        if (binIndex >= 0 && binIndex < bins.length) {
            bins[binIndex]++;
        }
    });

    // --- Step B: Process KDE (The Smooth Blanket) ---
    const kdePoints = [];
    // We calculate the smooth curve at the center of every bin so it perfectly overlays the bars
    for (let i = 0; i < bins.length; i++) {
        let xCenter = dataMin + (i * binWidth) + (binWidth / 2);

        // Calculate Density at this exact point X by checking its distance to ALL raw data points
        let densitySum = 0;
        for (let j = 0; j < rawData.length; j++) {
            densitySum += gaussianKernel(xCenter, rawData[j], bandwidth);
        }
        let averageDensity = densitySum / rawData.length;

        // Scale the density so its height matches the histogram frequency (Counts)
        // Scaling formula: Density * Total_Data_Points * Bin_Width
        let scaledHeight = averageDensity * rawData.length * binWidth;
        kdePoints.push(scaledHeight);
    }

    // --- Step C: Draw/Update Chart.js ---
    const ctx = document.getElementById('edaChart').getContext('2d');

    const chartData = {
        labels: labels,
        datasets: [
            {
                type: 'line',
                label: ' KDE (Underlying Trend)',
                data: kdePoints,
                borderColor: '#ec4899', // Pink-500
                backgroundColor: 'rgba(236, 72, 153, 0.1)',
                borderWidth: 4,
                pointRadius: 0, // Hide dots to look like a pure blanket
                pointHitRadius: 10,
                tension: 0.4, // This creates the smooth curved "blanket" effect between points
                fill: true,
                order: 1 // Draw on top
            },
            {
                type: 'bar',
                label: ' Histogram (Raw Counts)',
                data: bins,
                backgroundColor: 'rgba(56, 189, 248, 0.6)', // Sky-400 with opacity
                borderColor: 'rgba(14, 165, 233, 1)', // Sky-500 border
                borderWidth: 1,
                borderRadius: 4, // Slightly rounded Lego bricks
                barPercentage: 1.0,
                categoryPercentage: 0.95, // Leaves tiny gap between bricks
                order: 2 // Draw behind
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
            legend: {
                position: 'top',
                labels: { font: { family: "'Inter', sans-serif", size: 14, weight: 'bold' } }
            },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                titleFont: { size: 13 },
                bodyFont: { size: 14 },
                padding: 12,
                cornerRadius: 8
            }
        },
        scales: {
            x: {
                grid: { display: false },
                title: { display: true, text: 'Value Ranges (Bins)', font: { weight: 'bold' } },
                ticks: { maxTicksLimit: 10 }
            },
            y: {
                beginAtZero: true,
                grid: { borderDash: [4, 4], color: '#e2e8f0' },
                title: { display: true, text: 'Number of Data Points (Frequency)', font: { weight: 'bold' } }
            }
        }
    };

    // If chart exists, destroy it to redraw fresh (cleanest way to handle changing bin counts)
    if (myChart) {
        myChart.destroy();
    }
    myChart = new Chart(ctx, {
        data: chartData,
        options: chartOptions
    });
}

// 4. Set up Event Listeners for the Sliders
document.getElementById('binWidthSlider').addEventListener('input', updateChart);
document.getElementById('bandwidthSlider').addEventListener('input', updateChart);

// 5. Initial Draw
updateChart();