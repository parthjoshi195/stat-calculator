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
