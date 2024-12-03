// PDF.js setup
pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.worker.min.js";

// Get DOM elements
const canvas = document.getElementById("pdfCanvas");
const zoomSelect = document.getElementById("zoomSelect");
const downloadButton = document.getElementById("downloadButton");

// PDF state variables
let pdfDoc = null;
let scale = 1.0;

// Render the page
function renderPage(pdfDocument) {
    pdfDocument.getPage(1).then(function (page) {
        const viewport = page.getViewport({ scale: scale });

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
            canvasContext: canvas.getContext("2d"),
            viewport: viewport,
        };

        page.render(renderContext);
    });
}

// Zoom event listener
zoomSelect.addEventListener("change", function () {
    scale = parseFloat(this.value);
    if (pdfDoc) {
        renderPage(pdfDoc);
    }
});

// Load PDF
pdfjsLib.getDocument("../images/Resume_11_2_2024.pdf").promise.then(function (pdfDocument) {
    pdfDoc = pdfDocument;
    renderPage(pdfDocument);
});

// Download PDF
function downloadPDF() {
    const link = document.createElement("a");
    link.href = "../images/Resume_11_2_2024.pdf";
    link.download = "Resume_Zachary_Hoffman.pdf";
    link.click();
}
downloadButton.addEventListener("click", downloadPDF);