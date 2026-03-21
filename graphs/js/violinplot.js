// <!-- Script to generate the Plotly chart -->
// Helper function to generate normally distributed random numbers
function randomNorm(mean, stdDev) {
    let u1 = Math.random();
    let u2 = Math.random();
    let z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return z0 * stdDev + mean;
}

// Generate mock data for the chart
// 1. Math: Normal distribution, widely spread out
let mathScores = [];
for (let i = 0; i < 200; i++) { mathScores.push(Math.min(100, Math.max(0, randomNorm(65, 15)))); }

// 2. Science: Bimodal distribution (two peaks - e.g., students who studied and those who didn't)
let scienceScores = [];
for (let i = 0; i < 100; i++) { scienceScores.push(Math.min(100, Math.max(0, randomNorm(45, 8)))); } // Lower peak
for (let i = 0; i < 100; i++) { scienceScores.push(Math.min(100, Math.max(0, randomNorm(85, 7)))); } // Higher peak

// 3. Art: Clustered heavily at the top
let artScores = [];
for (let i = 0; i < 200; i++) { artScores.push(Math.min(100, Math.max(0, randomNorm(90, 6)))); }


// --- Plotly Configuration ---

// Trace 1: Math (Pink)
var trace1 = {
    type: 'violin',
    y: mathScores,
    name: 'Math',
    box: { visible: true, width: 0.1, fillcolor: '#ffffff', line: { color: '#333' } }, // Inner box plot
    meanline: { visible: false },
    line: { color: '#ec4899', width: 2 }, // Outline color (Tailwind Pink 500)
    fillcolor: '#fbcfe8', // Fill color (Tailwind Pink 200)
    opacity: 0.8,
    points: 'none', // Don't show individual points outside the violin
    hoverinfo: 'y'
};

// Trace 2: Science (Purple)
var trace2 = {
    type: 'violin',
    y: scienceScores,
    name: 'Science',
    box: { visible: true, width: 0.1, fillcolor: '#ffffff', line: { color: '#333' } },
    line: { color: '#8b5cf6', width: 2 }, // Outline (Tailwind Violet 500)
    fillcolor: '#ede9fe', // Fill (Tailwind Violet 100)
    opacity: 0.8,
    points: 'none',
    hoverinfo: 'y'
};

// Trace 3: Art (Orange)
var trace3 = {
    type: 'violin',
    y: artScores,
    name: 'Art',
    box: { visible: true, width: 0.1, fillcolor: '#ffffff', line: { color: '#333' } },
    line: { color: '#f97316', width: 2 }, // Outline (Tailwind Orange 500)
    fillcolor: '#ffedd5', // Fill (Tailwind Orange 100)
    opacity: 0.8,
    points: 'none',
    hoverinfo: 'y'
};

var data = [trace1, trace2, trace3];

var layout = {
    title: '', // Title handled in HTML
    yaxis: {
        title: 'Score (0-100)',
        zeroline: false,
        gridcolor: '#f3f4f6', // Light gray grid
        range: [-5, 110]
    },
    xaxis: {
        title: 'Subject'
    },
    plot_bgcolor: '#ffffff', // Clean white background
    paper_bgcolor: '#ffffff',
    showlegend: false,
    margin: { t: 20, b: 50, l: 50, r: 20 },
    hovermode: 'closest'
};

var config = {
    responsive: true,
    displayModeBar: false // Hides the top right toolbar for a cleaner look
};

// Render the plot
Plotly.newPlot('violin-plot', data, layout, config);