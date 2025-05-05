import { setActiveColor, updateBrushSizeDisplay } from "./canvas.js";

export function initTools(canvas, ctx, state) {
  const brushButton = document.getElementById("brush");
  const eraserButton = document.getElementById("eraser");
  const colorPicker = document.getElementById("colorPicker");
  const lineWidth = document.getElementById("lineWidth");
  const colorButtons = document.querySelectorAll(".paint__color-button");

  brushButton.addEventListener("click", () => {
    state.isEraser = false;
    ctx.strokeStyle = state.currentColor;
    ctx.globalCompositeOperation = "source-over";
    brushButton.classList.add("paint__tool-button--active");
    eraserButton.classList.remove("paint__tool-button--active");
  });

  eraserButton.addEventListener("click", () => {
    state.isEraser = true;
    ctx.strokeStyle = "white";
    ctx.globalCompositeOperation = "destination-out";
    eraserButton.classList.add("paint__tool-button--active");
    brushButton.classList.remove("paint__tool-button--active");
  });

  colorButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const color = button.getAttribute("data-color");
      state.currentColor = color;
      ctx.strokeStyle = color;
      colorPicker.value = color;
      setActiveColor(color, state);

      if (state.isEraser) {
        brushButton.click();
      }
    });
  });

  colorPicker.addEventListener("input", (e) => {
    state.currentColor = e.target.value;
    ctx.strokeStyle = state.currentColor;
    setActiveColor(state.currentColor, state);

    if (state.isEraser) {
      brushButton.click();
    }
  });

  lineWidth.addEventListener("input", (e) => {
    state.currentBrushSize = e.target.value;
    ctx.lineWidth = state.currentBrushSize;
    updateBrushSizeDisplay(state);
  });
}
