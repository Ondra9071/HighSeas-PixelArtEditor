const canvas = document.getElementById("canvas");
const colorPicker = document.getElementById("colorPicker");
const clearButton = document.getElementById("clearButton");
const saveButton = document.getElementById("saveButton");
const colorPalette = document.getElementById("colorPalette");
const hexInput = document.getElementById("hexInput");
const setHexColorButton = document.getElementById("setHexColor");

let currentColor = colorPicker.value;
let isMouseDown = false;

const predefinedColors = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF", "#FFFFFF", "#000000"];

function calculateGridSize() {
    const canvasWidth = canvas.offsetWidth;
    const pixelSize = 20;
    return Math.floor(canvasWidth / pixelSize);
}

function createPalette() {
    predefinedColors.forEach((color) => {
        const colorDiv = document.createElement("div");
        colorDiv.style.backgroundColor = color;
        colorDiv.classList.add(
            "w-8",
            "h-8",
            "rounded-full",
            "cursor-pointer",
            "border",
            "border-gray-700"
        );
        colorDiv.addEventListener("click", () => {
            currentColor = color;
            colorPicker.value = color;
        });
        colorPalette.appendChild(colorDiv);
    });
}

function saveProgress() {
    const pixels = document.querySelectorAll(".pixel");
    const pixelColors = Array.from(pixels).map((pixel) => pixel.style.backgroundColor || "white");
    localStorage.setItem("pixelArt", JSON.stringify(pixelColors));
}

function downloadCanvasAsImage() {
    html2canvas(canvas).then((canvasElement) => {
        const link = document.createElement("a");
        link.download = "pixel-art.png";
        link.href = canvasElement.toDataURL("image/png");
        link.click();
    });
}

saveButton.addEventListener("click", downloadCanvasAsImage);

function loadProgress(size) {
    const savedData = JSON.parse(localStorage.getItem("pixelArt"));
    if (!savedData) return;

    const pixels = document.querySelectorAll(".pixel");
    savedData.forEach((color, index) => {
        if (pixels[index]) {
            pixels[index].style.backgroundColor = color;
        }
    });
}

function createGrid(size) {
    canvas.innerHTML = "";
    canvas.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    canvas.style.gridTemplateRows = `repeat(${size}, 1fr)`;

    for (let i = 0; i < size * size; i++) {
        const pixel = document.createElement("div");
        pixel.classList.add("pixel");

        pixel.addEventListener("mousedown", (e) => {
            e.preventDefault();
            pixel.style.backgroundColor = currentColor;
            saveProgress();
        });
        pixel.addEventListener("mouseenter", (e) => {
            if (isMouseDown) {
                e.preventDefault();
                e.target.style.backgroundColor = currentColor;
            }
        });

        canvas.appendChild(pixel);
    }

    loadProgress(size);
}

function clearGrid() {
    const confirmation = confirm("Are you sure?");
    if (confirmation) {
        const pixels = document.querySelectorAll(".pixel");
        pixels.forEach((pixel) => (pixel.style.backgroundColor = "white"));
        saveProgress();
    }
}

canvas.addEventListener("dragstart", (e) => e.preventDefault());
canvas.addEventListener("selectstart", (e) => e.preventDefault());

colorPicker.addEventListener("input", (e) => (currentColor = e.target.value));
setHexColorButton.addEventListener("click", setHexColor);
clearButton.addEventListener("click", clearGrid);

document.body.addEventListener("mousedown", () => (isMouseDown = true));
document.body.addEventListener("mouseup", () => (isMouseDown = false));

window.addEventListener("resize", () => {
    const size = calculateGridSize();
    createGrid(size);
});

const size = calculateGridSize();
createPalette();
createGrid(size);