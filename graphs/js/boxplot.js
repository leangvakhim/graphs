// <!-- Application Logic -->
// Data structure defining each part of the boxplot
const boxplotFeatures = [
    {
        id: 'min',
        title: 'Minimum',
        subtitle: 'Lower Whisker',
        colorClass: 'border-slate-400 bg-slate-50 hover:border-slate-600 hover:shadow-slate-200',
        icon: '📉',
        description: 'The smallest "normal" number in your dataset. Anything smaller than this is considered an unusually low outlier.',
        svgTargets: ['svg-min'],
        highlightStyle: 'highlight-line'
    },
    {
        id: 'q1',
        title: 'First Quartile',
        subtitle: 'Q1 / 25th Percentile',
        colorClass: 'border-purple-300 bg-purple-50 hover:border-purple-500 hover:shadow-purple-200',
        icon: '📊',
        description: 'The bottom 25% mark. Exactly one-quarter of your data is below this line, and 75% is above it.',
        svgTargets: ['svg-q1', 'svg-box'],
        highlightStyle: 'highlight-line' // specifically for the line, box handled separately
    },
    {
        id: 'median',
        title: 'Median',
        subtitle: 'Q2 / The Middle',
        colorClass: 'border-rose-300 bg-rose-50 hover:border-rose-500 hover:shadow-rose-200',
        icon: '🎯',
        description: 'The exact halfway point of your data! If you lined up all numbers from smallest to largest, this is the one right in the center.',
        svgTargets: ['svg-median'],
        highlightStyle: 'highlight-line'
    },
    {
        id: 'q3',
        title: 'Third Quartile',
        subtitle: 'Q3 / 75th Percentile',
        colorClass: 'border-blue-300 bg-blue-50 hover:border-blue-500 hover:shadow-blue-200',
        icon: '📈',
        description: 'The top 25% mark. Three-quarters of your data sits below this line. Only the highest 25% of numbers are past this point.',
        svgTargets: ['svg-q3', 'svg-box'],
        highlightStyle: 'highlight-line'
    },
    {
        id: 'max',
        title: 'Maximum',
        subtitle: 'Upper Whisker',
        colorClass: 'border-slate-400 bg-slate-50 hover:border-slate-600 hover:shadow-slate-200',
        icon: '🏔️',
        description: 'The largest "normal" number in your data. Anything larger is considered an unusually high outlier.',
        svgTargets: ['svg-max'],
        highlightStyle: 'highlight-line'
    },
    {
        id: 'iqr',
        title: 'The Box',
        subtitle: 'Interquartile Range (IQR)',
        colorClass: 'border-indigo-300 bg-indigo-50 hover:border-indigo-500 hover:shadow-indigo-200',
        icon: '📦',
        description: 'The middle 50% of your data. This colorful box shows where the "typical" bulk of your data lives. A wider box means your middle data is very spread out.',
        svgTargets: ['svg-box'],
        highlightStyle: 'highlight-box'
    },
    {
        id: 'outliers',
        title: 'Outliers',
        subtitle: 'The Weird Ones',
        colorClass: 'border-red-300 bg-red-50 hover:border-red-500 hover:shadow-red-200',
        icon: '🚨',
        description: 'Dots outside the whiskers! These are highly unusual numbers that don\'t fit the pattern—they are surprisingly high or incredibly low.',
        svgTargets: ['svg-outlier-1', 'svg-outlier-2', 'svg-outlier-3'],
        highlightStyle: 'highlight-outlier'
    }
];

// Grab elements
const cardsContainer = document.getElementById('cards-container');
const allSvgParts = document.querySelectorAll('.svg-part');
const dynamicInfo = document.getElementById('dynamic-info');

// Function to reset all SVG parts to normal
function resetSvg() {
    allSvgParts.forEach(part => {
        part.classList.remove('dimmed', 'highlight-line', 'highlight-horiz-line', 'highlight-box', 'highlight-outlier');
    });
    dynamicInfo.style.opacity = '0';
}

// Function to highlight specific parts based on hovered card
function highlightFeature(feature) {
    // First, dim everything
    allSvgParts.forEach(part => {
        part.classList.add('dimmed');
    });

    // Then, highlight the targets
    feature.svgTargets.forEach(targetId => {
        const element = document.getElementById(targetId);
        if (element) {
            element.classList.remove('dimmed');

            // Apply specific highlight styles based on the element type or feature config
            if (feature.id === 'iqr' && targetId === 'svg-box') {
                element.classList.add('highlight-box');
            } else if (feature.id === 'outliers') {
                element.classList.add('highlight-outlier');
            } else if (targetId === 'svg-box') {
                // If box is targeted just for context (like Q1/Q3), highlight it mildly
                element.classList.add('highlight-box');
                element.style.opacity = '0.7';
            } else {
                element.classList.add('highlight-line');
            }
        }
    });

    // If it's Min or Max, also highlight the connecting horizontal whisker lines slightly
    if (feature.id === 'min') {
        document.getElementById('svg-whisker-lower').classList.remove('dimmed');
        document.getElementById('svg-whisker-lower').classList.add('highlight-horiz-line');
    }
    if (feature.id === 'max') {
        document.getElementById('svg-whisker-upper').classList.remove('dimmed');
        document.getElementById('svg-whisker-upper').classList.add('highlight-horiz-line');
    }

    // Update Dynamic Info badge
    dynamicInfo.innerHTML = `<span class="text-xl mr-2">${feature.icon}</span> <strong>${feature.title}</strong>: ${feature.subtitle}`;
    dynamicInfo.style.opacity = '1';
}

// Render the cards dynamically
boxplotFeatures.forEach(feature => {
    const card = document.createElement('div');
    card.className = `p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1 ${feature.colorClass} flex flex-col h-full`;

    card.innerHTML = `
        <div class="flex items-center gap-3 mb-2">
            <span class="text-2xl">${feature.icon}</span>
            <div>
                <h3 class="font-bold text-slate-800 text-lg leading-tight">${feature.title}</h3>
                <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">${feature.subtitle}</p>
            </div>
        </div>
        <p class="text-sm text-slate-600 mt-2 flex-grow">${feature.description}</p>
    `;

    // Add Event Listeners for Interaction (Mouse & Touch)
    card.addEventListener('mouseenter', () => highlightFeature(feature));
    card.addEventListener('mouseleave', resetSvg);

    // For mobile touch experience
    card.addEventListener('touchstart', (e) => {
        // Prevent default so it doesn't immediately fire mouse events
        highlightFeature(feature);
    }, { passive: true });

    cardsContainer.appendChild(card);
});

// Ensure moving off the SVG area resets it as well (if needed)
document.querySelector('svg').addEventListener('mouseleave', resetSvg);