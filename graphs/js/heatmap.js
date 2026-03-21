// --- 1. Define the Data ---
// We use a relatable dataset about student habits
const variables = ["Study Hours", "Test Score", "Video Games", "Sleep Hours", "Stress Level"];

// Correlation matrix (values between -1.0 and 1.0)
// Must be symmetric: matrix[i][j] == matrix[j][i]
const data = [
    [1.00, 0.85, -0.60, -0.10, -0.20], // Study Hours
    [0.85, 1.00, -0.75, 0.40, -0.65], // Test Score
    [-0.60, -0.75, 1.00, -0.30, 0.55], // Video Games
    [-0.10, 0.40, -0.30, 1.00, -0.85], // Sleep Hours
    [-0.20, -0.65, 0.55, -0.85, 1.00]  // Stress Level
];

// --- 2. Color Calculation Function ---
// Maps a value from -1 to 1 into a Red -> White -> Blue color scale
function getColor(value) {
    // value is between -1 and 1
    if (value === 0) return 'rgb(255, 255, 255)'; // Pure white

    let r, g, b;

    if (value > 0) {
        // Positive (Blue): Mix white (255,255,255) to blue (37, 99, 235)
        const intensity = value; // 0 to 1
        r = Math.round(255 - (255 - 37) * intensity);
        g = Math.round(255 - (255 - 99) * intensity);
        b = Math.round(255 - (255 - 235) * intensity);
    } else {
        // Negative (Red): Mix white (255,255,255) to red (220, 38, 38)
        const intensity = Math.abs(value); // 0 to 1
        r = Math.round(255 - (255 - 220) * intensity);
        g = Math.round(255 - (255 - 38) * intensity);
        b = Math.round(255 - (255 - 38) * intensity);
    }
    return `rgb(${r}, ${g}, ${b})`;
}

// Determine text color based on background darkness for readability
function getTextColor(value) {
    return Math.abs(value) > 0.6 ? 'white' : '#1f2937'; // gray-800
}

// --- 3. Explanation Logic ---
// Generate plain English explanations based on correlation values
function getExplanation(var1, var2, value) {
    if (var1 === var2) {
        return `This is the diagonal line. <strong>${var1}</strong> is perfectly correlated with itself. In EDA, this is always 1.0 and acts as a mirror line for the grid.`;
    }

    let strength = "";
    let direction = "";
    let relation = "";

    const absVal = Math.abs(value);

    // Strength
    if (absVal >= 0.7) strength = "strong";
    else if (absVal >= 0.4) strength = "moderate";
    else if (absVal > 0.1) strength = "weak";
    else strength = "almost zero";

    // Direction and Relation
    if (value > 0.1) {
        direction = "positive";
        relation = `As <strong>${var1}</strong> increases, <strong>${var2}</strong> tends to increase as well.`;
    } else if (value < -0.1) {
        direction = "negative";
        relation = `As <strong>${var1}</strong> increases, <strong>${var2}</strong> tends to decrease (they move in opposite directions).`;
    } else {
        direction = "neutral";
        relation = `There is barely any pattern. Changing <strong>${var1}</strong> doesn't reliably tell us anything about <strong>${var2}</strong>.`;
    }

    return `This cell shows a <strong>${strength} ${direction}</strong> correlation. <br><br>${relation}`;
}

// --- 4. Build the Heatmap Grid ---
const container = document.getElementById('heatmap-container');
const grid = document.createElement('div');

// Setup CSS Grid based on number of variables + 1 (for headers)
grid.style.display = 'grid';
grid.style.gridTemplateColumns = `auto repeat(${variables.length}, minmax(50px, 80px))`;
grid.className = "gap-1";

// Top-left empty corner
grid.appendChild(document.createElement('div'));

// Top Headers (Columns)
variables.forEach((v, index) => {
    const header = document.createElement('div');
    // Rotate text for columns to save space and look like a real heatmap
    header.innerHTML = `<div class="transform -rotate-45 origin-bottom-left ml-4 text-xs font-medium text-gray-500 w-24 whitespace-nowrap axis-label col-label-${index}">${v}</div>`;
    header.className = "flex items-end justify-center h-24 mb-2";
    grid.appendChild(header);
});

// Rows
data.forEach((row, rowIndex) => {
    // Row Header
    const rowHeader = document.createElement('div');
    rowHeader.className = `flex items-center justify-end pr-4 text-sm font-medium text-gray-500 text-right axis-label row-label-${rowIndex}`;
    rowHeader.textContent = variables[rowIndex];
    grid.appendChild(rowHeader);

    // Cells
    row.forEach((value, colIndex) => {
        const cell = document.createElement('div');
        const bgColor = getColor(value);
        const textColor = getTextColor(value);

        cell.className = "h-12 sm:h-16 rounded flex items-center justify-center text-xs sm:text-sm font-semibold cursor-pointer cell-transition cell-hover shadow-sm select-none";
        cell.style.backgroundColor = bgColor;
        cell.style.color = textColor;

        // Format to 2 decimal places, drop leading zero if needed, but standard is keep it
        cell.textContent = value.toFixed(2);

        // --- 5. Interactivity: Hover Events ---
        cell.addEventListener('mouseenter', () => {
            // Highlight axes
            document.querySelector(`.row-label-${rowIndex}`).classList.add('highlight-axis', 'text-indigo-600');
            document.querySelector(`.col-label-${colIndex}`).classList.add('highlight-axis', 'text-indigo-600');

            // Update Explanations
            const v1 = variables[rowIndex];
            const v2 = variables[colIndex];

            document.getElementById('dynamic-text').classList.add('hidden');
            const detailsDiv = document.getElementById('dynamic-details');
            detailsDiv.classList.remove('hidden');

            document.getElementById('var1-name').textContent = v1;
            document.getElementById('var2-name').textContent = v2;

            const valEl = document.getElementById('correlation-value');
            valEl.textContent = value > 0 ? `+${value.toFixed(2)}` : value.toFixed(2);

            // Set color of the value text to match sentiment
            if (value >= 0.5) valEl.className = "text-2xl font-black mb-1 text-blue-600";
            else if (value <= -0.5) valEl.className = "text-2xl font-black mb-1 text-red-600";
            else valEl.className = "text-2xl font-black mb-1 text-gray-600";

            document.getElementById('correlation-meaning').innerHTML = getExplanation(v1, v2, value);
        });

        cell.addEventListener('mouseleave', () => {
            // Remove highlight from axes
            document.querySelector(`.row-label-${rowIndex}`).classList.remove('highlight-axis', 'text-indigo-600');
            document.querySelector(`.col-label-${colIndex}`).classList.remove('highlight-axis', 'text-indigo-600');

            // Reset explanation box
            document.getElementById('dynamic-text').classList.remove('hidden');
            document.getElementById('dynamic-details').classList.add('hidden');
        });

        grid.appendChild(cell);
    });
});

container.appendChild(grid);