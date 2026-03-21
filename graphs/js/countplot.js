// 1. Initialize Lucide Icons
lucide.createIcons();

// 2. Data Definition
const data = [
    { category: 'Dogs', count: 450, color: '#3B82F6' }, // Vibrant Blue
    { category: 'Cats', count: 320, color: '#10B981' }, // Emerald Green
    { category: 'Birds', count: 120, color: '#F59E0B' }, // Amber/Yellow
    { category: 'Fish', count: 200, color: '#8B5CF6' }, // Purple
    { category: 'Reptiles', count: 60, color: '#EF4444' } // Red
];

// Maximum value for scaling the Y-axis (hardcoded based on our labels)
const MAX_Y_VALUE = 500;

// 3. Get DOM Elements
const chartArea = document.getElementById('chart-area');
const xAxisContainer = document.getElementById('x-axis');
const tooltip = document.getElementById('tooltip');
const ttLabel = document.getElementById('tt-label');
const ttValue = document.getElementById('tt-value');

// 4. Build the Chart
data.forEach(item => {
    // --- Calculate Bar Height ---
    const heightPercentage = (item.count / MAX_Y_VALUE) * 100;

    // --- Create Bar Container ---
    const barWrapper = document.createElement('div');
    barWrapper.className = 'flex-1 h-full flex flex-col justify-end px-2 sm:px-4 z-10 group';

    // --- Create Bar Element ---
    const bar = document.createElement('div');
    bar.className = 'w-full rounded-t-md bar';
    bar.style.height = '0%'; // Start at 0 for animation
    bar.style.backgroundColor = item.color;

    // Animate bar height slightly after load
    setTimeout(() => {
    bar.style.height = `${heightPercentage}%`;
    }, 100);

    // --- Add Interactive Tooltip Events ---
    barWrapper.addEventListener('mouseenter', () => {
    tooltip.style.display = 'block';
    ttLabel.textContent = item.category;
    ttValue.textContent = item.count;
    ttValue.style.color = item.color;
    });

    barWrapper.addEventListener('mousemove', (e) => {
    const chartRect = chartArea.getBoundingClientRect();
    // Calculate position relative to the chart area
    const left = e.clientX - chartRect.left;
    const top = e.clientY - chartRect.top;

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
    });

    barWrapper.addEventListener('mouseleave', () => {
    tooltip.style.display = 'none';
    });

    // Append bar to wrapper, wrapper to chart area
    barWrapper.appendChild(bar);
    chartArea.appendChild(barWrapper);

    // --- Create X-Axis Label ---
    const label = document.createElement('div');
    label.className = 'flex-1 text-center px-1 truncate';
    label.textContent = item.category;
    xAxisContainer.appendChild(label);
});