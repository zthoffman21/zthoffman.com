// Get DOM elements
const canvas = document.getElementById("pdfCanvas");
const zoomSelect = document.getElementById("zoomSelect");
const downloadButton = document.getElementById("downloadButton");

// PDF state variables
const scaleMult = 1.25;
var scale = 1 * scaleMult;
var pdfDoc = null;

// Render the page
function renderPage(pdfDocument) {
    pdfDocument.getPage(1).then(function (page) {
        scale = parseFloat(document.getElementById("zoomSelect").value) * scaleMult;
        const viewport = page.getViewport({ scale: scale });

        // Create a high-resolution canvas for rendering
        const outputScale = window.devicePixelRatio || 1;
        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);

        const renderContext = {
            canvasContext: canvas.getContext("2d"),
            viewport: viewport,
            transform: [outputScale, 0, 0, outputScale, 0, 0], // Scale transform for high DPI
        };

        page.render(renderContext);
    });
}

// Zoom event listener
zoomSelect.addEventListener("change", function () {
    if (pdfDoc) {
        renderPage(pdfDoc);
    }
});

// Load PDF
pdfjsLib.getDocument("../images/Resume 1_26_2025.pdf").promise.then(function (pdfDocument) {
    pdfDoc = pdfDocument;
    renderPage(pdfDocument);
});

// Download PDF
function downloadPDF() {
    const link = document.createElement("a");
    link.href = "../images/Resume 1_26_2025.pdf";
    link.download = "Resume_Zachary_Hoffman.pdf";
    link.click();
}
downloadButton.addEventListener("click", downloadPDF);
