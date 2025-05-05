document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("paintCanvas");
  const ctx = canvas.getContext("2d");
  const canvasWrapper = document.querySelector(".paint__canvas-wrapper");

  // Получаем элементы по ID (они остались без изменений)
  const brushButton = document.getElementById("brush");
  const eraserButton = document.getElementById("eraser");
  const colorPicker = document.getElementById("colorPicker");
  const lineWidth = document.getElementById("lineWidth");
  const undoButton = document.getElementById("undoButton");
  const redoButton = document.getElementById("redoButton");
  const clearButton = document.getElementById("clearButton");
  const saveButton = document.getElementById("saveButton");
  const zoomInButton = document.getElementById("zoomIn");
  const zoomOutButton = document.getElementById("zoomOut");
  const zoomLevel = document.getElementById("zoomLevel");

  // Изменяем селекторы для элементов с классами
  const colorButtons = document.querySelectorAll(".paint__color-button");
  const brushSizeValue = document.getElementById("brushSizeValue"); // оставляем по ID

  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;
  let isEraser = false;
  let currentColor = colorPicker.value;
  let currentBrushSize = lineWidth.value;
  let zoom = 1;

  let undoStack = [];
  let redoStack = [];
  const MAX_HISTORY_STATES = 50;

  function initCanvas() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = currentBrushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    saveState();

    updateBrushSizeDisplay();
    setActiveColor(currentColor);
  }

  function saveState() {
    if (undoStack.length >= MAX_HISTORY_STATES) {
      undoStack.shift();
    }
    undoStack.push(canvas.toDataURL());
    redoStack = [];
    updateUndoRedoButtons();
  }

  function restoreState(stack, oppositeStack) {
    if (stack.length === 0) return;

    const lastState = stack.pop();
    oppositeStack.push(canvas.toDataURL());

    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = lastState;

    updateUndoRedoButtons();
  }

  function updateUndoRedoButtons() {
    undoButton.disabled = undoStack.length <= 1;
    redoButton.disabled = redoStack.length === 0;
  }

  function startDrawing(e) {
    isDrawing = true;
    const pos = getPosition(e);
    [lastX, lastY] = [pos.x, pos.y];

    saveState();

    ctx.beginPath();
    ctx.arc(lastX, lastY, currentBrushSize / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
  }

  function draw(e) {
    if (!isDrawing) return;

    const pos = getPosition(e);
    const x = pos.x;
    const y = pos.y;

    ctx.lineTo(x, y);
    ctx.stroke();
    [lastX, lastY] = [x, y];
  }

  function stopDrawing() {
    isDrawing = false;
    ctx.beginPath();
  }

  function getPosition(e) {
    let x, y;
    const rect = canvas.getBoundingClientRect();

    if (e.touches) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    x = x / zoom;
    y = y / zoom;

    return { x, y };
  }

  function updateBrushSizeDisplay() {
    brushSizeValue.textContent = `${currentBrushSize}px`;
  }

  function setActiveColor(color) {
    colorButtons.forEach((button) => {
      if (button.getAttribute("data-color") === color.toLowerCase()) {
        button.classList.add("paint__color-button--active");
      } else {
        button.classList.remove("paint__color-button--active");
      }
    });
  }

  function clearCanvas() {
    saveState();
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  function saveCanvas() {
    const link = document.createElement("a");
    link.download = `drawing-${new Date().toISOString().slice(0, 10)}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  function setZoom(newZoom) {
    zoom = Math.max(0.5, Math.min(newZoom, 3));
    canvasWrapper.style.transform = `scale(${zoom})`;
    canvasWrapper.style.transformOrigin = "top left";
    zoomLevel.textContent = `${Math.round(zoom * 100)}%`;
  }

  // Event listeners
  canvas.addEventListener("mousedown", startDrawing);
  canvas.addEventListener("mousemove", draw);
  canvas.addEventListener("mouseup", stopDrawing);
  canvas.addEventListener("mouseout", stopDrawing);

  canvas.addEventListener("touchstart", (e) => {
    e.preventDefault();
    startDrawing(e);
  });

  canvas.addEventListener("touchmove", (e) => {
    e.preventDefault();
    draw(e);
  });

  canvas.addEventListener("touchend", (e) => {
    e.preventDefault();
    stopDrawing();
  });

  brushButton.addEventListener("click", () => {
    isEraser = false;
    ctx.strokeStyle = currentColor;
    ctx.globalCompositeOperation = "source-over";
    brushButton.classList.add("paint__tool-button--active");
    eraserButton.classList.remove("paint__tool-button--active");
  });

  eraserButton.addEventListener("click", () => {
    isEraser = true;
    ctx.strokeStyle = "white";
    ctx.globalCompositeOperation = "destination-out";
    eraserButton.classList.add("paint__tool-button--active");
    brushButton.classList.remove("paint__tool-button--active");
  });

  colorButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const color = button.getAttribute("data-color");
      currentColor = color;
      ctx.strokeStyle = color;
      colorPicker.value = color;
      setActiveColor(color);

      if (isEraser) {
        brushButton.click();
      }
    });
  });

  colorPicker.addEventListener("input", (e) => {
    currentColor = e.target.value;
    ctx.strokeStyle = currentColor;
    setActiveColor(currentColor);

    if (isEraser) {
      brushButton.click();
    }
  });

  lineWidth.addEventListener("input", (e) => {
    currentBrushSize = e.target.value;
    ctx.lineWidth = currentBrushSize;
    updateBrushSizeDisplay();
  });

  undoButton.addEventListener("click", () => {
    restoreState(undoStack, redoStack);
  });

  redoButton.addEventListener("click", () => {
    restoreState(redoStack, undoStack);
  });

  clearButton.addEventListener("click", clearCanvas);

  saveButton.addEventListener("click", saveCanvas);

  zoomInButton.addEventListener("click", () => {
    setZoom(zoom + 0.1);
  });

  zoomOutButton.addEventListener("click", () => {
    setZoom(zoom - 0.1);
  });

  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "z" && undoStack.length > 1) {
      e.preventDefault();
      restoreState(undoStack, redoStack);
    }

    if (e.ctrlKey && e.key === "y" && redoStack.length > 0) {
      e.preventDefault();
      restoreState(redoStack, undoStack);
    }

    if (e.ctrlKey && e.key === "s") {
      e.preventDefault();
      saveCanvas();
    }
  });

  initCanvas();
});