// <!-- JavaScript for Chart and Interactions -->
// Data Definitions for different distribution shapes
const chartData = {
    labels: ["0-10", "10-20", "20-30", "30-40", "40-50", "50-60", "60-70", "70-80", "80-90", "90-100"],
    datasets: {
        normal: [2, 5, 15, 30, 45, 42, 28, 12, 4, 1],
        rightSkew: [50, 35, 20, 12, 8, 5, 3, 2, 1, 0],
        leftSkew: [0, 1, 2, 3, 5, 8, 12, 20, 35, 50],
        bimodal: [5, 25, 40, 20, 5, 4, 18, 35, 22, 4]
    }
};

// Text explanations for each shape
const descriptions = {
    normal: {
        title: "🔔 The Normal Distribution",
        text: "Also known as the 'Bell Curve'. Most of the data clumps together in the middle, with very few extremely low or extremely high values.<br><br><strong>Real-world example:</strong> The heights of adult men in a city, or scores on a standardized test.",
        borderColor: "border-blue-500"
    },
    rightSkew: {
        title: "⛷️ Right-Skewed (Positive Skew)",
        text: "The main mountain of data is on the left, but a long 'tail' stretches out to the right. This means there are a few unusually high numbers pulling the average up.<br><br><strong>Real-world example:</strong> Wealth distribution. Most people have average income (left peak), but a few billionaires create a long tail to the right.",
        borderColor: "border-red-500"
    },
    leftSkew: {
        title: "🏂 Left-Skewed (Negative Skew)",
        text: "The main mountain of data is on the right, but a long 'tail' stretches out to the left. This means there are a few unusually low numbers.<br><br><strong>Real-world example:</strong> Age of retirement. Most people retire in their 60s (right peak), but a few people retire very early in their 30s or 40s (left tail).",
        borderColor: "border-teal-500"
    },
    bimodal: {
        title: "🐫 Bimodal (Two Peaks)",
        text: "The chart has two distinct peaks, resembling a camel's back. This usually indicates that you are looking at two different groups mixed together in one dataset.<br><br><strong>Real-world example:</strong> Restaurant rush hours (a peak at lunch time, and another peak at dinner time).",
        borderColor: "border-pink-500"
    }
};

// Colorful palette for the bars
const colorfulPalette = [
    'rgba(255, 99, 132, 0.8)',   // Pink/Red
    'rgba(255, 159, 64, 0.8)',   // Orange
    'rgba(255, 205, 86, 0.8)',   // Yellow
    'rgba(75, 192, 192, 0.8)',   // Teal
    'rgba(54, 162, 235, 0.8)',   // Blue
    'rgba(153, 102, 255, 0.8)',  // Purple
    'rgba(201, 203, 207, 0.8)',  // Grey
    'rgba(255, 142, 165, 0.8)',  // Light Pink
    'rgba(132, 225, 205, 0.8)',  // Mint
    'rgba(142, 175, 255, 0.8)'   // Light Blue
];

// Border colors for the bars
const borderPalette = colorfulPalette.map(color => color.replace('0.8', '1'));

let histogramChart;

// Initialize Chart
window.onload = function () {
    const ctx = document.getElementById('histogramChart').getContext('2d');

    histogramChart = new Chart(ctx, {
        type: 'bar', // A histogram is essentially a bar chart with no gaps
        data: {
            labels: chartData.labels,
            datasets: [{
                label: 'Frequency (Count)',
                data: chartData.datasets.normal,
                backgroundColor: colorfulPalette,
                borderColor: borderPalette,
                borderWidth: 2,
                // Set these to 1 so the bars touch each other, mimicking a true continuous histogram
                categoryPercentage: 1.0,
                barPercentage: 1.0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    titleFont: { size: 16 },
                    bodyFont: { size: 14 },
                    callbacks: {
                        title: function (context) {
                            return 'Bucket (Bin): ' + context[0].label;
                        },
                        label: function (context) {
                            return 'Frequency: ' + context.raw + ' items';
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Ranges / Intervals (The Bins)',
                        font: { size: 16, weight: 'bold' }
                    },
                    grid: { display: false }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Frequency (How Many)',
                        font: { size: 16, weight: 'bold' }
                    },
                    beginAtZero: true,
                    grid: { color: 'rgba(0,0,0,0.05)' }
                }
            },
            animation: {
                duration: 800,
                easing: 'easeOutQuart'
            }
        }
    });
};

// Function to update the chart and explanation based on button click
function updateChart(shape) {
    // Update chart data
    histogramChart.data.datasets[0].data = chartData.datasets[shape];
    histogramChart.update();

    // Update explanation text
    const explanationBox = document.getElementById('dynamic-explanation');
    const titleEl = document.getElementById('desc-title');
    const textEl = document.getElementById('desc-text');
    const descData = descriptions[shape];

    // Animate text change
    explanationBox.style.opacity = 0;

    setTimeout(() => {
        titleEl.innerHTML = descData.title;
        textEl.innerHTML = descData.text;

        // Update left border color to match theme
        explanationBox.className = `bg-white rounded-2xl p-6 border-l-8 ${descData.borderColor} shadow-sm transition-opacity duration-300`;
        explanationBox.style.opacity = 1;
    }, 300);
}