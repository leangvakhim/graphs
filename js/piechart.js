// <!-- JavaScript to render the chart -->
document.addEventListener('DOMContentLoaded', function () {
    const ctx = document.getElementById('edaPieChart').getContext('2d');

    // Define our data
    const data = {
        labels: ['Basic Plan', 'Premium Plan', 'Pro Plan', 'Enterprise', 'Free Trial'],
        datasets: [{
            label: 'Number of Customers',
            data: [45, 25, 15, 5, 10], // The size of each slice
            backgroundColor: [
                'rgba(59, 130, 246, 0.8)',   // Blue
                'rgba(168, 85, 247, 0.8)',   // Purple
                'rgba(245, 158, 11, 0.8)',   // Amber
                'rgba(16, 185, 129, 0.8)',   // Emerald
                'rgba(236, 72, 153, 0.8)'    // Pink
            ],
            borderColor: [
                'rgba(255, 255, 255, 1)', // White borders to separate slices
                'rgba(255, 255, 255, 1)',
                'rgba(255, 255, 255, 1)',
                'rgba(255, 255, 255, 1)',
                'rgba(255, 255, 255, 1)'
            ],
            borderWidth: 3,
            hoverOffset: 15 // Makes the slice pop out when hovered
        }]
    };

    // Configure and render the chart
    const edaPieChart = new Chart(ctx, {
        type: 'pie',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        font: {
                            family: "'Inter', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
                            size: 14,
                            weight: 'bold'
                        },
                        color: '#4B5563' // Tailwind gray-600
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(17, 24, 39, 0.9)', // Dark tooltip
                    titleFont: { size: 16 },
                    bodyFont: { size: 14 },
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        // Add a percentage sign to the tooltip
                        label: function (context) {
                            let label = context.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed !== null) {
                                label += context.parsed + '%'; // Treating our mock numbers as percentages
                            }
                            return label;
                        }
                    }
                }
            },
            animation: {
                animateScale: true, // Animates scaling from center
                animateRotate: true // Animates rotation
            }
        }
    });
});