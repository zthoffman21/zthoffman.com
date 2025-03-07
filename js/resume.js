pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.worker.min.js";

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
            if (!window.matchMedia("(max-width: 900px)").matches) {
                setAbsolutePositions();
            } else {
                document.getElementById("footer").style.opacity = 1;
            }
        });
    });
}

function setAbsolutePositions() {
    const container = document.getElementById("mainContainer");
    const windows = document.querySelectorAll(".window");

    container.style.height = container.getBoundingClientRect().height + "px";
    document.getElementById("footer").style.opacity = 1;

    windows.forEach((window) => {
        const rect = window.getBoundingClientRect();
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        window.style.left = rect.left + scrollLeft + "px";
        window.style.top = rect.top + scrollTop + "px";
    });
    windows.forEach((window) => {
        window.style.position = "absolute";
    });
}

// Zoom event listener
zoomSelect.addEventListener("change", function () {
    if (pdfDoc) {
        renderPage(pdfDoc);
    }
});

// Load PDF
pdfjsLib.getDocument("../images/Resume_Hoffman_Zachary.pdf").promise.then(function (pdfDocument) {
    pdfDoc = pdfDocument;
    renderPage(pdfDocument);
});

// Download PDF
function downloadPDF() {
    const link = document.createElement("a");
    link.href = "../images/Resume_Hoffman_Zachary.pdf";
    link.download = "Resume_Hoffman_Zachary.pdf";
    link.click();
}
downloadButton.addEventListener("click", downloadPDF);

const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
if (!isMobileDevice) {
  window.addEventListener('resize', function() {
    location.reload();
  });
}