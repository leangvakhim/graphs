// <!-- JavaScript to render the charts -->
document.addEventListener('DOMContentLoaded', function () {

    // Common layout settings to ensure white background and clean look
    const commonLayout = {
        paper_bgcolor: 'white',
        plot_bgcolor: 'white',
        margin: { t: 40, b: 40, l: 40, r: 20 },
        font: { family: 'Inter, sans-serif' },
        xaxis: { fixedrange: true },
        yaxis: { fixedrange: true, gridcolor: '#e5e7eb' } // Light gray grid
    };

    // ==========================================
    // CHART 1: WITHOUT ESTIMATORS
    // ==========================================
    const categories = ['Apples', 'Bananas', 'Oranges', 'Grapes'];
    const exactCounts = [150, 120, 90, 180];

    const trace1 = {
        x: categories,
        y: exactCounts,
        type: 'bar',
        marker: {
            // Colorful, distinct bars
            color: ['#ef4444', '#f59e0b', '#f97316', '#8b5cf6'],
            opacity: 0.8,
            line: { color: 'transparent', width: 0 }
        },
        hovertemplate: 'Category: %{x}<br>Exact Count: <b>%{y}</b><extra></extra>'
    };

    const layout1 = {
        ...commonLayout,
        title: { text: 'Total Amount of Fruit (Exact)', font: { size: 16, color: '#1e3a8a' } },
    };

    Plotly.newPlot('chart-without', [trace1], layout1, { displayModeBar: false, responsive: true });


    // ==========================================
    // CHART 2: WITH ESTIMATORS
    // ==========================================
    const averageWeights = [100, 140, 130, 8] /* e.g., grams */;
    const errorRanges = [10, 25, 15, 2] /* The "Wiggle room" / Variance */;

    const trace2 = {
        x: categories,
        y: averageWeights,
        type: 'bar',
        marker: {
            // Colorful, distinct bars
            color: ['#ef4444', '#f59e0b', '#f97316', '#8b5cf6'],
            opacity: 0.8,
        },
        error_y: {
            type: 'data',
            array: errorRanges,
            visible: true,
            color: '#1f2937', // Dark gray error bars
            thickness: 2,
            width: 6
        },
        hovertemplate: 'Category: %{x}<br>Avg Weight: <b>%{y}g</b><br>Give or take: ±%{error_y.array}g<extra></extra>'
    };

    const layout2 = {
        ...commonLayout,
        title: { text: 'Average Weight per Fruit (With Uncertainty)', font: { size: 16, color: '#4c1d95' } },
    };

    Plotly.newPlot('chart-with', [trace2], layout2, { displayModeBar: false, responsive: true });
});