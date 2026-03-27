// --- Data Generation Helpers ---

// Generates random data with a linear trend
function generateLinearData(count, slope, intercept, noiseLevel) {
    let data = [];
    for (let i = 0; i < count; i++) {
        let x = Math.random() * 100;
        let noise = (Math.random() - 0.5) * noiseLevel;
        let y = (slope * x) + intercept + noise;
        data.push({ x: x, y: y });
    }
    return data;
}

// Generates completely random data (no correlation)
function generateRandomData(count, maxX, maxY) {
    let data = [];
    for (let i = 0; i < count; i++) {
        data.push({
            x: Math.random() * maxX,
            y: Math.random() * maxY
        });
    }
    return data;
}

// Generates clustered data
function generateCluster(centerX, centerY, spread, count) {
    let data = [];
    for (let i = 0; i < count; i++) {
        // simple box-muller transform for roughly normal distribution
        let u = 0, v = 0;
        while (u === 0) u = Math.random();
        while (v === 0) v = Math.random();
        let numX = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        let numY = Math.sqrt(-2.0 * Math.log(u)) * Math.sin(2.0 * Math.PI * v);

        data.push({
            x: centerX + (numX * spread),
            y: centerY + (numY * spread)
        });
    }
    return data;
}

// --- Chart Configuration Builder ---
function createScatterChart(canvasId, datasetLabel, data, dotColor, borderColor) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // FIX: Check if it's our custom cluster array (checks if the first item has a 'points' key)
    const isClusterData = data[0] && data[0].points !== undefined;

    const datasets = isClusterData ? data.map((d, index) => ({
        label: `Cluster ${index + 1}`,
        data: d.points,
        backgroundColor: d.color,
        borderColor: d.border,
        borderWidth: 1,
        pointRadius: 6,
        pointHoverRadius: 9
    })) : [{
        label: datasetLabel,
        data: data,
        backgroundColor: dotColor,
        borderColor: borderColor,
        borderWidth: 1,
        pointRadius: 6,
        pointHoverRadius: 9
    }];

    return new Chart(ctx, {
        type: 'scatter',
        data: { datasets: datasets },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { enabled: false } // Disabled for simplicity in visual
            },
            scales: {
                x: {
                    display: true,
                    grid: { color: '#f0f0f0' },
                    ticks: { display: false } // Hide numbers to focus on the pattern
                },
                y: {
                    display: true,
                    grid: { color: '#f0f0f0' },
                    ticks: { display: false } // Hide numbers to focus on the pattern
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeOutQuart'
            }
        }
    });
}

// --- Render Charts ---
window.onload = function () {

    // 1. Positive Correlation (Slope = 1)
    const posData = generateLinearData(60, 1, 10, 30);
    createScatterChart('chartPositive', 'Positive', posData, 'rgba(59, 130, 246, 0.6)', 'rgba(59, 130, 246, 1)');

    // 2. Negative Correlation (Slope = -1)
    const negData = generateLinearData(60, -1, 100, 30);
    createScatterChart('chartNegative', 'Negative', negData, 'rgba(244, 63, 94, 0.6)', 'rgba(244, 63, 94, 1)');

    // 3. No Correlation
    const noneData = generateRandomData(80, 100, 100);
    createScatterChart('chartNone', 'No Correlation', noneData, 'rgba(107, 114, 128, 0.6)', 'rgba(107, 114, 128, 1)');

    // 4. Outliers (mostly positive trend, but with 2 crazy points)
    const baseData = generateLinearData(50, 0.8, 20, 20);
    // Add two clear outliers
    baseData.push({ x: 10, y: 90 });
    baseData.push({ x: 90, y: 10 });

    // Color outliers differently for the visual effect using a custom color array
    const outlierColors = baseData.map((pt, i) =>
        i >= 50 ? 'rgba(245, 158, 11, 1)' : 'rgba(245, 158, 11, 0.3)'
    );
    const outlierBorders = baseData.map((pt, i) =>
        i >= 50 ? 'rgba(0,0,0,0.8)' : 'rgba(245, 158, 11, 0.8)'
    );

    const canvasOutlier = document.getElementById('chartOutlier');
    if (canvasOutlier) {
        const ctxOutlier = canvasOutlier.getContext('2d');
        new Chart(ctxOutlier, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Data with Outliers',
                    data: baseData,
                    backgroundColor: outlierColors,
                    borderColor: outlierBorders,
                    borderWidth: 2,
                    pointRadius: baseData.map((pt, i) => i >= 50 ? 10 : 5), // Make outliers bigger!
                    pointHoverRadius: 12
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip: { enabled: false } },
                scales: {
                    x: { grid: { color: '#f0f0f0' }, ticks: { display: false } },
                    y: { grid: { color: '#f0f0f0' }, ticks: { display: false } }
                }
            }
        });
    }

    // 5. Clusters (3 distinct groups)
    const clusterData = [
        { points: generateCluster(20, 20, 8, 30), color: 'rgba(16, 185, 129, 0.7)', border: 'rgba(16, 185, 129, 1)' },
        { points: generateCluster(80, 80, 10, 35), color: 'rgba(139, 92, 246, 0.7)', border: 'rgba(139, 92, 246, 1)' },
        { points: generateCluster(80, 20, 7, 25), color: 'rgba(14, 165, 233, 0.7)', border: 'rgba(14, 165, 233, 1)' }
    ];
    createScatterChart('chartCluster', 'Clusters', clusterData, null, null);
};