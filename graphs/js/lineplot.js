// <!-- JavaScript to render the Chart -->
document.addEventListener('DOMContentLoaded', function () {
    const ctx = document.getElementById('edaLineChart').getContext('2d');

    // Data configuration
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Ice Cream data (Peaks in Summer)
    const iceCreamSales = [15, 20, 35, 50, 75, 95, 100, 90, 65, 45, 25, 15];

    // Hot Chocolate data (Peaks in Winter)
    const hotChocolateSales = [90, 85, 65, 45, 30, 15, 10, 15, 35, 60, 80, 95];

    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [
                {
                    label: 'Ice Cream Sales',
                    data: iceCreamSales,
                    borderColor: '#ec4899', // Tailwind Pink-500
                    backgroundColor: 'rgba(236, 72, 153, 0.2)',
                    borderWidth: 4,
                    pointBackgroundColor: '#fff',
                    pointBorderColor: '#ec4899',
                    pointBorderWidth: 3,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    fill: true,
                    tension: 0.4 // Makes the line smooth/curvy
                },
                {
                    label: 'Hot Chocolate Sales',
                    data: hotChocolateSales,
                    borderColor: '#f97316', // Tailwind Orange-500
                    backgroundColor: 'rgba(249, 115, 22, 0.2)',
                    borderWidth: 4,
                    pointBackgroundColor: '#fff',
                    pointBorderColor: '#f97316',
                    pointBorderWidth: 3,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    fill: true,
                    tension: 0.4 // Makes the line smooth/curvy
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: {
                            size: 14,
                            family: "'Inter', sans-serif",
                            weight: 'bold'
                        },
                        padding: 20
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    titleFont: { size: 16, family: "'Inter', sans-serif" },
                    bodyFont: { size: 14, family: "'Inter', sans-serif" },
                    padding: 12,
                    cornerRadius: 8,
                    displayColors: true,
                    boxPadding: 6
                }
            },
            scales: {
                x: {
                    grid: {
                        color: '#f1f5f9', // Very light slate line
                        drawBorder: false,
                    },
                    ticks: {
                        font: {
                            size: 13,
                            family: "'Inter', sans-serif",
                        },
                        color: '#64748b' // slate-500
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#f1f5f9', // Very light slate line
                        drawBorder: false,
                    },
                    ticks: {
                        font: {
                            size: 13,
                            family: "'Inter', sans-serif",
                        },
                        color: '#64748b' // slate-500
                    }
                }
            }
        }
    });
});