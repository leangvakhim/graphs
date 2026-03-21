// <!-- Chart Generation Script -->
// ==========================================
// 1. Generate Relplot (Relational Gridplot)
// ==========================================

// Mock Data: Temperature vs Ice Cream Sales
const downtownTemp = [15, 18, 22, 25, 28, 30, 32, 35];
const downtownSales = [20, 25, 35, 45, 50, 60, 65, 75]; // Steady increase

const beachTemp = [15, 18, 22, 25, 28, 30, 32, 35];
const beachSales = [15, 20, 50, 80, 110, 140, 170, 200]; // Massive exponential increase at the beach

const traceRel1 = {
    x: downtownTemp,
    y: downtownSales,
    mode: 'markers',
    type: 'scatter',
    name: 'Downtown Stores',
    marker: { color: '#0ea5e9', size: 12, line: { color: 'white', width: 2 } },
    xaxis: 'x1',
    yaxis: 'y1'
};

const traceRel2 = {
    x: beachTemp,
    y: beachSales,
    mode: 'markers',
    type: 'scatter',
    name: 'Beach Stores',
    marker: { color: '#f59e0b', size: 12, line: { color: 'white', width: 2 } },
    xaxis: 'x2',
    yaxis: 'y2'
};

const layoutRel = {
    title: { text: 'Ice Cream Sales vs. Temperature (Split by Location)', font: { family: 'Inter', size: 18 } },
    grid: { rows: 1, columns: 2, pattern: 'independent' }, // Creates the Gridplot!
    xaxis: { title: 'Temp (°C)', gridcolor: '#f1f5f9', zerolinecolor: '#cbd5e1' },
    yaxis: { title: 'Units Sold', gridcolor: '#f1f5f9', zerolinecolor: '#cbd5e1', range: [0, 220] },
    xaxis2: { title: 'Temp (°C)', gridcolor: '#f1f5f9', zerolinecolor: '#cbd5e1' },
    yaxis2: { title: 'Units Sold', gridcolor: '#f1f5f9', zerolinecolor: '#cbd5e1', range: [0, 220] },
    plot_bgcolor: '#ffffff',
    paper_bgcolor: '#ffffff',
    showlegend: false,
    annotations: [
        { text: "Location: Downtown", x: 0.25, y: 1.05, xref: "paper", yref: "paper", showarrow: false, font: { size: 14, color: '#475569', weight: 'bold' } },
        { text: "Location: Beach", x: 0.80, y: 1.05, xref: "paper", yref: "paper", showarrow: false, font: { size: 14, color: '#475569', weight: 'bold' } }
    ],
    margin: { t: 80, b: 50, l: 50, r: 20 }
};

Plotly.newPlot('relplot-chart', [traceRel1, traceRel2], layoutRel, { responsive: true, displayModeBar: false });


// ==========================================
// 2. Generate Catplot (Categorical Gridplot)
// ==========================================

// Mock Data: Satisfaction Scores by Store Layout
const layoutCategories = ['Classic Layout', 'Modern Layout'];

// North Region: Loves the Modern Layout
const northClassicScores = [60, 65, 70, 62, 68, 75, 58, 66];
const northModernScores = [85, 90, 88, 92, 95, 80, 89, 94];

// South Region: Prefers the Classic Layout
const southClassicScores = [80, 85, 82, 88, 79, 90, 84, 86];
const southModernScores = [55, 60, 58, 62, 50, 65, 59, 61];

const traceCat1_Classic = {
    y: northClassicScores, type: 'box', name: 'Classic Layout',
    marker: { color: '#8b5cf6' }, xaxis: 'x1', yaxis: 'y1'
};
const traceCat1_Modern = {
    y: northModernScores, type: 'box', name: 'Modern Layout',
    marker: { color: '#ec4899' }, xaxis: 'x1', yaxis: 'y1'
};

const traceCat2_Classic = {
    y: southClassicScores, type: 'box', name: 'Classic Layout',
    marker: { color: '#8b5cf6' }, xaxis: 'x2', yaxis: 'y2', showlegend: false
};
const traceCat2_Modern = {
    y: southModernScores, type: 'box', name: 'Modern Layout',
    marker: { color: '#ec4899' }, xaxis: 'x2', yaxis: 'y2', showlegend: false
};

const layoutCat = {
    title: { text: 'Satisfaction by Store Layout (Split by Region)', font: { family: 'Inter', size: 18 } },
    grid: { rows: 1, columns: 2, pattern: 'independent' }, // Creates the Gridplot!
    xaxis: { title: '', showticklabels: false },
    yaxis: { title: 'Satisfaction Score (0-100)', gridcolor: '#f1f5f9', zerolinecolor: '#cbd5e1', range: [40, 100] },
    xaxis2: { title: '', showticklabels: false },
    yaxis2: { title: '', gridcolor: '#f1f5f9', zerolinecolor: '#cbd5e1', range: [40, 100], showticklabels: false },
    plot_bgcolor: '#ffffff',
    paper_bgcolor: '#ffffff',
    boxmode: 'group',
    legend: { orientation: 'h', y: -0.1, x: 0.3 },
    annotations: [
        { text: "Region: North", x: 0.20, y: 1.05, xref: "paper", yref: "paper", showarrow: false, font: { size: 14, color: '#475569', weight: 'bold' } },
        { text: "Region: South", x: 0.85, y: 1.05, xref: "paper", yref: "paper", showarrow: false, font: { size: 14, color: '#475569', weight: 'bold' } }
    ],
    margin: { t: 80, b: 80, l: 60, r: 20 }
};

Plotly.newPlot('catplot-chart', [traceCat1_Classic, traceCat1_Modern, traceCat2_Classic, traceCat2_Modern], layoutCat, { responsive: true, displayModeBar: false });