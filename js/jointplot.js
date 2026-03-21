// 1. Generate Dummy Data (Simulating a positive correlation)
// Let's say: Hours Studied vs Exam Score
const numPoints = 250;
const hoursStudied = [];
const examScores = [];

for (let i = 0; i < numPoints; i++) {
    // Random hours between 1 and 10, favoring the middle
    let hours = (Math.random() * 5) + (Math.random() * 5) + 1;

    // Score depends on hours + some random noise (luck, natural ability, etc.)
    let noise = (Math.random() * 20) - 10; // -10 to +10
    let score = 40 + (hours * 5) + noise;

    // Cap score at 100
    if (score > 100) score = 100;

    hoursStudied.push(hours);
    examScores.push(score);
}

// 2. Define the Traces for Plotly

// Trace 1: The Center Scatter Plot (Pink Dots)
const traceScatter = {
    x: hoursStudied,
    y: examScores,
    mode: 'markers',
    name: 'Students',
    marker: {
        color: '#ec4899', // Tailwind Pink-500
        size: 8,
        opacity: 0.6,
        line: { color: 'white', width: 0.5 }
    },
    type: 'scatter'
};

// Trace 2: The Top Histogram (Blue Bars for X-axis)
const traceTopHistogram = {
    x: hoursStudied,
    y: hoursStudied.map(() => 1), // Dummy Y values to create bars
    name: 'Study Hours Dist.',
    marker: { color: '#3b82f6' }, // Tailwind Blue-500
    type: 'histogram',
    xaxis: 'x',
    yaxis: 'y2'
};

// Trace 3: The Right Histogram (Green Bars for Y-axis)
const traceRightHistogram = {
    y: examScores,
    x: examScores.map(() => 1), // Dummy X values to create bars
    name: 'Scores Dist.',
    marker: { color: '#10b981' }, // Tailwind Green-500
    type: 'histogram',
    xaxis: 'x2',
    yaxis: 'y'
};

const data = [traceScatter, traceTopHistogram, traceRightHistogram];

// 3. Define the Layout (Positioning the 3 graphs together)
const layout = {
    title: false, // We have our own HTML title
    showlegend: false,
    plot_bgcolor: 'white',
    paper_bgcolor: 'white',
    margin: { t: 20, r: 20, b: 50, l: 50 },
    hovermode: 'closest',
    bargap: 0.05,

    // X & Y Axes for the main scatter plot (Occupies 0% to 80% of the space)
    xaxis: {
        domain: [0, 0.82],
        showgrid: true,
        gridcolor: '#f1f5f9',
        title: { text: 'Hours Studied', font: { family: 'Inter', size: 14, color: '#64748b' } },
        zeroline: false
    },
    yaxis: {
        domain: [0, 0.82],
        showgrid: true,
        gridcolor: '#f1f5f9',
        title: { text: 'Exam Score (out of 100)', font: { family: 'Inter', size: 14, color: '#64748b' } },
        zeroline: false
    },

    // X2 & Y2 Axes for the Marginal Histograms (Occupies 85% to 100% of the space)
    xaxis2: {
        domain: [0.85, 1],
        showgrid: false,
        zeroline: false,
        showticklabels: false
    },
    yaxis2: {
        domain: [0.85, 1],
        showgrid: false,
        zeroline: false,
        showticklabels: false
    }
};

// 4. Render the Plot
Plotly.newPlot('jointPlot', data, layout, { responsive: true, displayModeBar: false });