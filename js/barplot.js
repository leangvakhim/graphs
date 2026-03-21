// <!-- JavaScript to render the Chart -->
// Wait for the page to load before creating the chart
window.addEventListener('DOMContentLoaded', (event) => {

    // 1. Get the canvas element where the chart will be drawn
    const ctx = document.getElementById('edaBarChart').getContext('2d');

    // 2. Define the Data
    const categories = ['Smartphones', 'Laptops', 'Tablets', 'Smartwatches', 'Headphones'];
    const values = [850, 420, 310, 590, 780];

    // 3. Define colorful, friendly colors for the bars
    const barColors = [
        'rgba(255, 99, 132, 0.8)',   // Pink/Red
        'rgba(54, 162, 235, 0.8)',   // Blue
        'rgba(255, 206, 86, 0.8)',   // Yellow
        'rgba(75, 192, 192, 0.8)',   // Teal/Green
        'rgba(153, 102, 255, 0.8)'   // Purple
    ];
    const borderColors = [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 206, 86)',
        'rgb(75, 192, 192)',
        'rgb(153, 102, 255)'
    ];

    // 4. Create the Chart
    new Chart(ctx, {
        type: 'bar', // This tells Chart.js we want a Bar Plot
        data: {
            labels: categories, // The X-Axis labels
            datasets: [{
                label: 'Units Sold (in thousands)', // What the data represents
                data: values, // The Y-Axis values
                backgroundColor: barColors, // Inside color of the bars
                borderColor: borderColors, // Outline color of the bars
                borderWidth: 2, // Thickness of the outline
                borderRadius: 6 // Makes the top of the bars slightly rounded
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false // Hiding the legend to keep it simple, since labels are on the X-axis
                },
                title: {
                    display: true,
                    text: 'Gadget Sales in 2025 (Example Data)',
                    font: {
                        size: 18,
                        family: "'Inter', sans-serif",
                        weight: 'bold'
                    },
                    color: '#1f2937'
                },
                tooltip: {
                    backgroundColor: 'rgba(17, 24, 39, 0.9)',
                    titleFont: { size: 14 },
                    bodyFont: { size: 14 },
                    padding: 12,
                    cornerRadius: 8
                }
            },
            scales: {
                y: {
                    beginAtZero: true, // Always start Y-axis at 0 for accurate visual comparison
                    title: {
                        display: true,
                        text: 'Number of Units Sold',
                        font: { weight: 'bold' },
                        color: '#4b5563'
                    },
                    grid: {
                        color: '#f3f4f6' // Light gray grid lines
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Gadget Categories',
                        font: { weight: 'bold' },
                        color: '#4b5563'
                    },
                    grid: {
                        display: false // Hide vertical grid lines for a cleaner look
                    }
                }
            },
            animation: {
                duration: 1500,
                easing: 'easeOutQuart'
            }
        }
    });
});