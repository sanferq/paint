import { saveState } from "./history.js";

export function initCanvas(canvas, ctx, state) {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = state.currentColor;
  ctx.lineWidth = state.currentBrushSize;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  updateBrushSizeDisplay(state);
  setActiveColor(state.currentColor, state);
}

export function clearCanvas(canvas, ctx, state) {
  saveState(canvas, state);
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

export function saveCanvas(canvas) {
  const link = document.createElement("a");
  link.download = `drawing-${new Date().toISOString().slice(0, 10)}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

export function updateBrushSizeDisplay(state) {
  const brushSizeValue = document.getElementById("brushSizeValue");
  brushSizeValue.textContent = `${state.currentBrushSize}px`;
}

export function setActiveColor(color, state) {
  const colorButtons = document.querySelectorAll(".paint__color-button");
  colorButtons.forEach((button) => {
    if (button.getAttribute("data-color") === color.toLowerCase()) {
      button.classList.add("paint__color-button--active");
    } else {
      button.classList.remove("paint__color-button--active");
    }
  });
}
