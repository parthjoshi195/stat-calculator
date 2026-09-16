const toolArea = document.getElementById("toolArea");
const toolTitle = document.getElementById("toolTitle");
const toolContent = document.getElementById("toolContent");
const closeTool = document.getElementById("closeTool");

const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const cameraButton = document.getElementById("cameraButton");

const csvInput = document.getElementById("csvInput");
const imageInput = document.getElementById("imageInput");

let currentDataset = null;
let lastAnalysis = null;


/* =========================
   TOOL OPENING
========================= */

document.querySelectorAll("[data-tool]").forEach(button => {

    button.addEventListener("click", () => {

        const tool = button.dataset.tool;

        if (tool === "home") {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
            return;
        }

        openTool(tool);

    });

});


function openTool(tool) {

    toolArea.hidden = false;

    const titles = {
        frequency: "Frequency Analysis",
        stats: "Statistics & Probability",
        tutor: "AI Statistics Tutor",
        workspace: "Data Workspace",
        visualisation: "Data Visualisation"
    };

    toolTitle.textContent = titles[tool] || "DATA HUB";

    if (tool === "frequency") {
        showFrequency();
    }

    if (tool === "stats") {
        showStatistics();
    }

    if (tool === "tutor") {
        showTutor();
    }

    if (tool === "workspace") {
        showWorkspace();
    }

    if (tool === "visualisation") {
        showVisualisation();
    }

    toolArea.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


/* =========================
   CLOSE
========================= */

closeTool.addEventListener("click", () => {

    toolArea.hidden = true;

});


/* =========================
   NUMBER PARSER
========================= */

function getNumbers(text) {

    return text
        .replace(/\n/g, ",")
        .replace(/;/g, ",")
        .replace(/\t/g, ",")
        .split(",")
        .map(value => Number(value.trim()))
        .filter(value => Number.isFinite(value));

}


/* =========================
   STATISTICS
========================= */

function calculateStatistics(values) {

    if (!values.length) {
        return null;
    }

    const sorted = [...values].sort((a, b) => a - b);

    const n = values.length;

    const sum = values.reduce(
        (total, value) => total + value,
        0
    );

    const mean = sum / n;

    let median;

    if (n % 2 === 0) {

        median =
            (sorted[n / 2 - 1] +
             sorted[n / 2]) / 2;

    } else {

        median = sorted[Math.floor(n / 2)];

    }


    const counts = {};

    values.forEach(value => {

        counts[value] =
            (counts[value] || 0) + 1;

    });


    const highestFrequency =
        Math.max(...Object.values(counts));

    const modes = Object.keys(counts)
        .filter(value =>
            counts[value] === highestFrequency
        )
        .map(Number);


    const mode =
        highestFrequency === 1
            ? "No mode"
            : modes.join(", ");


    const populationVariance =
        values.reduce(
            (total, value) =>
                total + Math.pow(value - mean, 2),
            0
        ) / n;


    const sampleVariance =
        n > 1
            ? values.reduce(
                (total, value) =>
                    total + Math.pow(value - mean, 2),
                0
            ) / (n - 1)
            : 0;


    return {

        n,
        sum,
        mean,
        median,
        mode,

        populationVariance,

        populationSD:
            Math.sqrt(populationVariance),

        sampleVariance,

        sampleSD:
            Math.sqrt(sampleVariance),

        min: sorted[0],
        max: sorted[sorted.length - 1],
        range: sorted[sorted.length - 1] - sorted[0]

    };

}


/* =========================
   FORMAT NUMBER
========================= */

function formatNumber(value) {

    if (typeof value !== "number") {
        return value;
    }

    return Number.isInteger(value)
        ? value
        : value.toFixed(4);

}


/* =========================
   STATISTICS TOOL
========================= */

function showStatistics() {

    toolContent.innerHTML = `

        <div class="tool-form">

            <label>
                Enter numbers
            </label>

            <textarea
                id="statsInput"
                placeholder="Example: 10, 20, 30, 40, 50">
            </textarea>

            <button
                class="action-button"
                id="calculateStats"
                type="button">

                Calculate Statistics

            </button>

        </div>


        <div id="statsResults"></div>


        <hr style="
            margin:35px 0;
            border:0;
            border-top:1px solid rgba(255,255,255,0.08);
        ">


        <h3 style="margin-bottom:15px;">
            Simple Probability
        </h3>


        <div class="tool-form">

            <label>
                Favourable outcomes
            </label>

            <input
                id="favourable"
                type="number"
                placeholder="Example: 3">


            <label>
                Total possible outcomes
            </label>

            <input
                id="totalOutcomes"
                type="number"
                placeholder="Example: 10">


            <button
                class="action-button"
                id="calculateProbability"
                type="button">

                Calculate Probability

            </button>

        </div>


        <div id="probabilityResult"></div>

    `;


    document
        .getElementById("calculateStats")
        .addEventListener("click", () => {

            const values =
                getNumbers(
                    document.getElementById("statsInput").value
                );


            const result =
                calculateStatistics(values);


            if (!result) {

                document.getElementById("statsResults")
                    .innerHTML =
                    `<p style="color:#ff8f8f;">
                        Please enter valid numbers.
                    </p>`;

                return;
            }


            document.getElementById("statsResults")
                .innerHTML = createStatsHTML(result);

        });


    document
        .getElementById("calculateProbability")
        .addEventListener("click", () => {

            const favourable =
                Number(
                    document.getElementById("favourable").value
                );

            const total =
                Number(
                    document.getElementById("totalOutcomes").value
                );


            if (
                !Number.isFinite(favourable) ||
                !Number.isFinite(total) ||
                total <= 0 ||
                favourable < 0 ||
                favourable > total
            ) {

                document.getElementById("probabilityResult")
                    .innerHTML =
                    `<p style="color:#ff8f8f;">
                        Enter valid values.
                    </p>`;

                return;
            }


            const probability =
                favourable / total;


            document.getElementById("probabilityResult")
                .innerHTML = `

                    <div class="result-grid">

                        <div class="result-card">
                            <small>P(A)</small>
                            <strong>
                                ${probability.toFixed(4)}
                            </strong>
                        </div>

                        <div class="result-card">
                            <small>Percentage</small>
                            <strong>
                                ${(probability * 100).toFixed(2)}%
                            </strong>
                        </div>

                        <div class="result-card">
                            <small>P(not A)</small>
                            <strong>
                                ${(1 - probability).toFixed(4)}
                            </strong>
                        </div>

                    </div>

                `;

        });

}


function createStatsHTML(result) {

    return `

        <div class="result-grid">

            <div class="result-card">
                <small>Count</small>
                <strong>${result.n}</strong>
            </div>

            <div class="result-card">
                <small>Mean</small>
                <strong>${formatNumber(result.mean)}</strong>
            </div>

            <div class="result-card">
                <small>Median</small>
                <strong>${formatNumber(result.median)}</strong>
            </div>

            <div class="result-card">
                <small>Mode</small>
                <strong>${result.mode}</strong>
            </div>

            <div class="result-card">
                <small>Population SD</small>
                <strong>${formatNumber(result.populationSD)}</strong>
            </div>

            <div class="result-card">
                <small>Sample SD</small>
                <strong>${formatNumber(result.sampleSD)}</strong>
            </div>

            <div class="result-card">
                <small>Minimum</small>
                <strong>${result.min}</strong>
            </div>

            <div class="result-card">
                <small>Maximum</small>
                <strong>${result.max}</strong>
            </div>

            <div class="result-card">
                <small>Range</small>
                <strong>${formatNumber(result.range)}</strong>
            </div>

            <div class="result-card">
                <small>Population Variance</small>
                <strong>${formatNumber(result.populationVariance)}</strong>
            </div>

        </div>

    `;

}


/* =========================
   FREQUENCY
========================= */

function showFrequency() {

    toolContent.innerHTML = `

        <div class="tool-form">

            <label>
                Enter your data
            </label>

            <textarea
                id="frequencyInput"
                placeholder="Example: 1, 2, 2, 3, 3, 3, 4, 5">
            </textarea>

            <button
                class="action-button"
                id="calculateFrequency"
                type="button">

                Create Frequency Table

            </button>

        </div>


        <div id="frequencyResults"></div>

    `;


    document
        .getElementById("calculateFrequency")
        .addEventListener("click", () => {

            const values =
                getNumbers(
                    document.getElementById("frequencyInput").value
                );


            if (!values.length) {

                document.getElementById("frequencyResults")
                    .innerHTML =
                    `<p style="color:#ff8f8f;">
                        Please enter valid numbers.
                    </p>`;

                return;
            }


            const counts = {};

            values.forEach(value => {

                counts[value] =
                    (counts[value] || 0) + 1;

            });


            const sortedValues =
                Object.keys(counts)
                    .map(Number)
                    .sort((a, b) => a - b);


            let cumulative = 0;


            let rows = "";


            sortedValues.forEach(value => {

                const frequency =
                    counts[value];

                cumulative += frequency;

                const relative =
                    frequency / values.length;


                rows += `

                    <tr>

                        <td>${value}</td>

                        <td>${frequency}</td>

                        <td>${relative.toFixed(4)}</td>

                        <td>
                            ${(relative * 100).toFixed(2)}%
                        </td>

                        <td>${cumulative}</td>

                    </tr>

                `;

            });


            document.getElementById("frequencyResults")
                .innerHTML = `

                <div class="table-wrapper">

                    <table class="data-table">

                        <thead>

                            <tr>
                                <th>Value</th>
                                <th>Frequency</th>
                                <th>Relative</th>
                                <th>Percentage</th>
                                <th>Cumulative</th>
                            </tr>

                        </thead>

                        <tbody>
                            ${rows}
                        </tbody>

                    </table>

                </div>

            `;

        });

}


/* =========================
   DATA WORKSPACE
========================= */

function showWorkspace() {

    toolContent.innerHTML = `

        <div class="upload-box">

            <h3>
                Upload your dataset
            </h3>

            <p>
                Start with a CSV file. Your data will be
                processed directly in your browser.
            </p>

            <button
                class="action-button"
                id="uploadCSV"
                type="button">

                Upload CSV

            </button>

        </div>


        <div id="datasetArea"></div>

    `;


    document
        .getElementById("uploadCSV")
        .addEventListener("click", () => {

            csvInput.click();

        });


    if (currentDataset) {
        renderDataset();
    }

}


csvInput.addEventListener("change", event => {

    const file = event.target.files[0];

    if (!file) return;


    const reader = new FileReader();


    reader.onload = () => {

        try {

            currentDataset =
                parseCSV(reader.result);

            renderDataset();

        } catch (error) {

            document.getElementById("datasetArea")
                .innerHTML =
                `<p style="color:#ff8f8f;">
                    Could not read this CSV file.
                </p>`;

        }

    };


    reader.readAsText(file);

});


/* =========================
   CSV PARSER
========================= */

function parseCSV(text) {

    const rows = [];

    let row = [];
    let field = "";
    let insideQuotes = false;


    for (let i = 0; i < text.length; i++) {

        const char = text[i];
        const next = text[i + 1];


        if (insideQuotes) {

            if (char === '"' && next === '"') {

                field += '"';
                i++;

            } else if (char === '"') {

                insideQuotes = false;

            } else {

                field += char;

            }

        } else {

            if (char === '"') {

                insideQuotes = true;

            } else if (char === ",") {

                row.push(field.trim());
                field = "";

            } else if (char === "\n") {

                row.push(field.trim());

                if (row.some(cell => cell !== "")) {
                    rows.push(row);
                }

                row = [];
                field = "";

            } else if (char !== "\r") {

                field += char;

            }

        }

    }


    row.push(field.trim());

    if (row.some(cell => cell !== "")) {
        rows.push(row);
    }


    if (rows.length < 2) {
        throw new Error("CSV needs data");
    }


    const headers = rows[0].map(
        (header, index) =>
            header || `Column ${index + 1}`
    );


    const data = rows.slice(1).map(row => {

        while (row.length < headers.length) {
            row.push("");
        }

        return row.slice(0, headers.length);

    });


    return {
        headers,
        rows: data
    };

}


/* =========================
   RENDER DATASET
========================= */

function renderDataset() {

    if (!currentDataset) return;


    const {
        headers,
        rows
    } = currentDataset;


    let previewRows = "";


    rows.slice(0, 8).forEach(row => {

        previewRows += "<tr>";

        headers.forEach((_, index) => {

            previewRows += `
                <td>
                    ${escapeHTML(row[index] || "")}
                </td>
            `;

        });

        previewRows += "</tr>";

    });


    const numericColumns =
        headers.filter((_, index) => {

            const values =
                rows
                    .map(row => Number(row[index]))
                    .filter(value => Number.isFinite(value));

            return values.length >= 2;

        });


    document.getElementById("datasetArea")
        .innerHTML = `

        <div style="margin-top:30px;">

            <div class="result-grid">

                <div class="result-card">
                    <small>Rows</small>
                    <strong>${rows.length}</strong>
                </div>

                <div class="result-card">
                    <small>Columns</small>
                    <strong>${headers.length}</strong>
                </div>

            </div>


            <h3 style="margin-top:30px;">
                Dataset Preview
            </h3>


            <div class="table-wrapper">

                <table class="data-table">

                    <thead>
                        <tr>
                            ${headers.map(
                                header =>
                                `<th>${escapeHTML(header)}</th>`
                            ).join("")}
                        </tr>
                    </thead>

                    <tbody>
                        ${previewRows}
                    </tbody>

                </table>

            </div>


            <div class="tool-form" style="margin-top:30px;">

                <label>
                    Choose a numerical column
                </label>

                <select id="columnSelect">

                    ${numericColumns.length
                        ? numericColumns.map(header =>
                            `<option value="${escapeHTML(header)}">
                                ${escapeHTML(header)}
                            </option>`
                          ).join("")
                        : `<option>
                            No numerical column found
                           </option>`
                    }

                </select>


                <button
                    class="action-button"
                    id="analyzeColumn"
                    type="button">

                    Analyze Column

                </button>

            </div>


            <div id="columnResults"></div>

        </div>

    `;


    const analyzeButton =
        document.getElementById("analyzeColumn");


    if (analyzeButton) {

        analyzeButton.addEventListener(
            "click",
            analyzeSelectedColumn
        );

    }

}


function analyzeSelectedColumn() {

    const select =
        document.getElementById("columnSelect");


    if (!select) return;


    const columnName = select.value;


    const columnIndex =
        currentDataset.headers.indexOf(columnName);


    const values =
        currentDataset.rows
            .map(row => Number(row[columnIndex]))
            .filter(value => Number.isFinite(value));


    const result =
        calculateStatistics(values);


    if (!result) return;


    lastAnalysis = {
        column: columnName,
        values,
        result
    };


    document.getEl
