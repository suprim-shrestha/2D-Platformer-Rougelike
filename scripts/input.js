const keys = {
  left: false,
  right: false,
  up: false,
  down: false,
  jump: false,
  primary: false,
  secondary: false,
  utility: false,
  interact: false,
  enter: false,
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
    case "ArrowUp":
      keys.up = true;
      break;
    case "ArrowDown":
      keys.down = true;
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
    case "KeyE":
      keys.interact = true;
      break;
    case "Enter":
      keys.enter = true;
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
    case "ArrowUp":
      keys.up = false;
      break;
    case "ArrowDown":
      keys.down = false;
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
    case "KeyE":
      keys.interact = false;
      break;
    case "Enter":
      keys.enter = false;
      break;
  }
};
