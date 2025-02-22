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

        page.render(renderContext).promise.then(function () {
            if (!window.matchMedia("(max-width: 768px)").matches) {
                setAbsolutePositions();
            }
        });
    });
}

function setAbsolutePositions() {
    const container = document.getElementById('mainContainer');
    const windows = document.querySelectorAll('.window');

    container.style.height = container.getBoundingClientRect().height + 'px';
    windows.forEach(el => {
        const rect = el.getBoundingClientRect();
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        el.style.left = (rect.left + scrollLeft) + 'px';
        el.style.top = (rect.top + scrollTop) + 'px';                        
    });
    windows.forEach(el => {
        el.style.position = 'absolute';
    });
    document.getElementById("footer").style.opacity = 1;
}

// Zoom event listener
zoomSelect.addEventListener("change", function () {
    if (pdfDoc) {
        renderPage(pdfDoc);
    }
});

// Load PDF
pdfjsLib.getDocument("../images/Hoffman_Zachary_Resume.pdf").promise.then(function (pdfDocument) {
    pdfDoc = pdfDocument;
    renderPage(pdfDocument);
});

// Download PDF
function downloadPDF() {
    const link = document.createElement("a");
    link.href = "../images/Hoffman_Zachary_Resume.pdf";
    link.download = "Hoffman_Zachary_Resume.pdf";
    link.click();
}
downloadButton.addEventListener("click", downloadPDF);
