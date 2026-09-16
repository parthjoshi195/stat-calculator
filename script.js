/* ===============================
   DATA HUB JAVASCRIPT
================================ */


/* START ANALYSING */

function startAnalysis() {

    document
        .getElementById("explore")
        .scrollIntoView({
            behavior: "smooth"
        });

}


/* ===============================
   OPEN TOOLS
================================ */

function openTool(tool) {

    const panel = document.getElementById("toolPanel");

    const content = document.getElementById("panelContent");


    if (tool === "frequency") {

        content.innerHTML = `
            <h2>Frequency Analysis</h2>

            <p>
                Build frequency tables, relative frequency
                and cumulative frequency.
            </p>

            <br>

            <p>
                🚀 Frequency calculator is ready to be
                connected here.
            </p>
        `;

    }


    if (tool === "statistics") {

        content.innerHTML = `
            <h2>Statistics & Probability</h2>

            <p>
                Calculate mean, median, mode, variance,
                standard deviation and probability.
            </p>

            <br>

            <p>
                🚀 Statistics calculator is ready to be
                connected here.
            </p>
        `;

    }


    if (tool === "ai") {

        content.innerHTML = `
            <h2>AI Statistics Tutor</h2>

            <p>
                Ask statistics questions and receive
                step-by-step explanations.
            </p>

            <br>

            <p>
                🤖 AI Tutor interface will be connected here.
            </p>
        `;

    }


    panel.classList.add("show");

}


/* ===============================
   CLOSE TOOL
================================ */

function closeTool() {

    document
        .getElementById("toolPanel")
        .classList.remove("show");

}


/* CLOSE WHEN CLICKING OUTSIDE */

document
    .getElementById("toolPanel")
    .addEventListener("click", function(event) {

        if (event.target === this) {
            closeTool();
        }

    });


/* ===============================
   DARK / LIGHT MODE
================================ */

const themeBtn =
    document.getElementById("themeBtn");


themeBtn.addEventListener("click", function() {

    document.body.classList.toggle("light");

    if (
        document.body.classList.contains("light")
    ) {

        themeBtn.innerHTML = "☾";

    } else {

        themeBtn.innerHTML = "☼";

    }

});


/* ===============================
   NAVIGATION ACTIVE STATE
================================ */

const sections =
    document.querySelectorAll("section");

const navLinks =
    document.querySelectorAll("nav a");


window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach(section => {

        const sectionTop =
            section.offsetTop - 150;

        if (
            window.scrollY >= sectionTop
        ) {

            current = section.getAttribute("id");

        }

    });


    navLinks.forEach(link => {

        link.classList.remove("active");

        if (
            link.getAttribute("href")
            === "#" + current
        ) {

            link.classList.add("active");

        }

    });

});
