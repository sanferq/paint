const canvas = document.getElementById("paintCanvas");
const ctx = canvas.getContext("2d");
const colorButtons = document.querySelectorAll(".paint__color");
const colorPicker = document.getElementById("colorPicker");
const lineWidth = document.getElementById("lineWidth");
const brushButton = document.getElementById("brush");
const eraserButton = document.getElementById("eraser");

// Переменные состояния
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let isEraser = false; // Флаг режима ластика

// Стек для хранения состояний
let undoStack = [];
let redoStack = [];

// Начальная настройка
ctx.strokeStyle = colorPicker.value;
ctx.lineWidth = lineWidth.value;
ctx.lineCap = "round";
ctx.lineJoin = "round";

// Функции работы с состоянием
function saveState() {
  undoStack.push(canvas.toDataURL());
  redoStack = [];
}

function restoreState(stack, oppositeStack) {
  if (stack.length === 0) return;

  const lastState = stack.pop();
  oppositeStack.push(canvas.toDataURL());

  const img = new Image();
  img.src = lastState;
  img.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
  };
}

// Рисование
function startDrawing(e) {
  isDrawing = true;
  saveState();
  
  // Определяем координаты для мыши или сенсора
  const { x, y } = getEventCoords(e);
  [lastX, lastY] = [x, y];
}

function stopDrawing() {
  isDrawing = false;
  ctx.beginPath();
}

function draw(e) {
  if (!isDrawing) return;

  const { x, y } = getEventCoords(e);

  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(x, y);
  ctx.stroke();

  [lastX, lastY] = [x, y];
}

// Получение координат для мыши и сенсора
function getEventCoords(e) {
  if (e.touches && e.touches.length > 0) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.touches[0].clientX - rect.left,
      y: e.touches[0].clientY - rect.top,
    };
  }
  return { x: e.offsetX, y: e.offsetY };
}

// Логика инструментов
brushButton.addEventListener("click", () => {
  isEraser = false;
  ctx.strokeStyle = colorPicker.value;
  brushButton.classList.add("active");
  eraserButton.classList.remove("active");
});

eraserButton.addEventListener("click", () => {
  isEraser = true;
  ctx.strokeStyle = "#FFFFFF";
  eraserButton.classList.add("active");
  brushButton.classList.remove("active");
});

// Логика изменения цвета и ширины линии
colorButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const color = button.getAttribute("data-color");
    ctx.strokeStyle = color;
    colorPicker.value = color;
  });
});

colorPicker.addEventListener("input", (e) => {
  if (!isEraser) {
    ctx.strokeStyle = e.target.value;
  }
});

lineWidth.addEventListener("input", (e) => {
  ctx.lineWidth = e.target.value;
});

// Очистка и отмена действий
function clearCanvas() {
  saveState();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function undo() {
  restoreState(undoStack, redoStack);
}

function redo() {
  restoreState(redoStack, undoStack);
}

// Обработчики событий мыши
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseout", stopDrawing);


// Обработчики событий сенсорного экрана
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

// Предупреждение при перезагрузки 
window.addEventListener("beforeunload", (event) => {
  event.preventDefault();
});

