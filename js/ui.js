import { restoreState } from "./history.js";
import { clearCanvas, saveCanvas } from "./canvas.js";

export function initUI(canvas, ctx, state) {
  const zoomInButton = document.getElementById("zoomIn");
  const zoomOutButton = document.getElementById("zoomOut");
  const zoomLevel = document.getElementById("zoomLevel");
  const undoButton = document.getElementById("undoButton");
  const redoButton = document.getElementById("redoButton");
  const clearButton = document.getElementById("clearButton");
  const saveButton = document.getElementById("saveButton");

  zoomInButton.addEventListener("click", () => {
    setZoom(state.zoom + 0.1, state);
  });

  zoomOutButton.addEventListener("click", () => {
    setZoom(state.zoom - 0.1, state);
  });

  undoButton.addEventListener("click", () => {
    restoreState(state.undoStack, state.redoStack, canvas, ctx, state);
  });

  redoButton.addEventListener("click", () => {
    restoreState(state.redoStack, state.undoStack, canvas, ctx, state);
  });

  clearButton.addEventListener("click", () => clearCanvas(canvas, ctx, state));
  saveButton.addEventListener("click", () => saveCanvas(canvas));

  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "z" && state.undoStack.length > 1) {
      e.preventDefault();
      restoreState(state.undoStack, state.redoStack, canvas, ctx, state);
    }

    if (e.ctrlKey && e.key === "y" && state.redoStack.length > 0) {
      e.preventDefault();
      restoreState(state.redoStack, state.undoStack, canvas, ctx, state);
    }

    if (e.ctrlKey && e.key === "s") {
      e.preventDefault();
      saveCanvas(canvas);
    }
  });
}

function setZoom(newZoom, state) {
  const canvasWrapper = document.querySelector(".paint__canvas-wrapper");
  state.zoom = Math.max(0.5, Math.min(newZoom, 3));
  canvasWrapper.style.transform = `scale(${state.zoom})`;
  canvasWrapper.style.transformOrigin = "top left";
  zoomLevel.textContent = `${Math.round(state.zoom * 100)}%`;
}
