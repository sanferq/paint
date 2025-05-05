export function initHistory(state) {
  state.undoStack = [];
  state.redoStack = [];
  state.MAX_HISTORY_STATES = 50;
}

export function saveState(canvas, state) {
  if (state.undoStack.length >= state.MAX_HISTORY_STATES) {
    state.undoStack.shift();
  }
  state.undoStack.push(canvas.toDataURL());
  state.redoStack = [];
  updateUndoRedoButtons(state);
}

export function restoreState(stack, oppositeStack, canvas, ctx, state) {
  if (stack.length === 0) return;

  const lastState = stack.pop();
  oppositeStack.push(canvas.toDataURL());

  const img = new Image();
  img.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
  };
  img.src = lastState;

  updateUndoRedoButtons(state);
}

function updateUndoRedoButtons(state) {
  const undoButton = document.getElementById("undoButton");
  const redoButton = document.getElementById("redoButton");
  undoButton.disabled = state.undoStack.length <= 1;
  redoButton.disabled = state.redoStack.length === 0;
}
