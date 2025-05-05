import { initCanvas, clearCanvas, saveCanvas } from "./canvas.js";
import { setupEventListeners } from "./events.js";
import { initHistory } from "./history.js";
import { initTools } from "./tools.js";
import { initUI } from "./ui.js";

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("paintCanvas");
  const ctx = canvas.getContext("2d");

  const colorPicker = document.getElementById("colorPicker");
  const lineWidth = document.getElementById("lineWidth");

  const state = {
    isDrawing: false,
    lastX: 0,
    lastY: 0,
    isEraser: false,
    currentColor: colorPicker.value,
    currentBrushSize: lineWidth.value,

    zoom: 1,
    undoStack: [],
    redoStack: [],
    MAX_HISTORY_STATES: 50,
  };

  // Инициализация всех модулей
  initCanvas(canvas, ctx, state);
  initHistory(state);
  initTools(canvas, ctx, state);
  initUI(canvas, ctx, state);
  setupEventListeners(canvas, ctx, state);
});
