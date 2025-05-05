import { saveState } from "./history.js";

export function setupEventListeners(canvas, ctx, state) {
  canvas.addEventListener("mousedown", (e) =>
    startDrawing(e, canvas, ctx, state)
  );
  canvas.addEventListener("mousemove", (e) => draw(e, canvas, ctx, state));
  canvas.addEventListener("mouseup", () => stopDrawing(ctx, state));
  canvas.addEventListener("mouseout", () => stopDrawing(ctx, state));

  canvas.addEventListener("touchstart", (e) => {
    e.preventDefault();
    startDrawing(e, canvas, ctx, state);
  });

  canvas.addEventListener("touchmove", (e) => {
    e.preventDefault();
    draw(e, canvas, ctx, state);
  });

  canvas.addEventListener("touchend", (e) => {
    e.preventDefault();
    stopDrawing(ctx, state);
  });
}

export function startDrawing(e, canvas, ctx, state) {
  state.isDrawing = true;
  const pos = getPosition(e, canvas, state);
  [state.lastX, state.lastY] = [pos.x, pos.y];

  saveState(canvas, state);

  ctx.beginPath();
  ctx.arc(state.lastX, state.lastY, state.currentBrushSize / 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(state.lastX, state.lastY);
}

export function draw(e, canvas, ctx, state) {
  if (!state.isDrawing) return;

  const pos = getPosition(e, canvas, state);
  const x = pos.x;
  const y = pos.y;

  ctx.lineTo(x, y);
  ctx.stroke();
  [state.lastX, state.lastY] = [x, y];
}

export function stopDrawing(ctx, state) {
  if (state.isDrawing) {
    saveState(ctx.canvas, state);
    state.lastAction = "stopped";
  }
  state.isDrawing = false;
  ctx.beginPath();
}

function getPosition(e, canvas, state) {
  let x, y;
  const rect = canvas.getBoundingClientRect();

  if (e.touches) {
    x = e.touches[0].clientX - rect.left;
    y = e.touches[0].clientY - rect.top;
  } else {
    x = e.clientX - rect.left;
    y = e.clientY - rect.top;
  }

  x = x / state.zoom;
  y = y / state.zoom;

  return { x, y };
}
