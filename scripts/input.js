const keys = {
  left: false,
  right: false,
  jump: false,
  primary: false,
  secondary: false,
  utility: false,
};

// Event listeners for key presses
window.onkeydown = (e) => {
  switch (e.code) {
    case "ArrowLeft":
      keys.left = true;
      break;
    case "ArrowRight":
      keys.right = true;
      break;
    case "Space":
      keys.jump = true;
      break;
    case "KeyD":
      keys.primary = true;
      break;
    case "KeyS":
      keys.secondary = true;
      break;
    case "ShiftLeft":
      keys.utility = true;
      break;
  }
};

window.onkeyup = (e) => {
  switch (e.code) {
    case "ArrowLeft":
      keys.left = false;
      break;
    case "ArrowRight":
      keys.right = false;
      break;
    case "Space":
      keys.jump = false;
      break;
    case "KeyD":
      keys.primary = false;
      break;
    case "KeyS":
      keys.secondary = false;
      break;
    case "ShiftLeft":
      keys.utility = false;
      break;
  }
};
