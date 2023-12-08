/**
 * Returns a random number between a range
 *
 * @param {number} lower
 * @param {number} upper
 * @returns number
 */
const getRandomNum = (lower = 0, upper = 1) => {
  return lower + Math.random() * (upper - lower);
};

/**
 * Detect collision between two rectangles
 *
 * @param {Object} rect1
 * @param {Object} rect2
 * @returns boolean
 */
function detectCollision(rect1, rect2) {
  return (
    rect1.x <= rect2.x + rect2.width &&
    rect1.x + rect1.width >= rect2.x &&
    rect1.y <= rect2.y + rect2.height &&
    rect1.y + rect1.height >= rect2.y
  );
}

function detectPointCollision(rect, x, y) {
  return (
    x > rect.x &&
    x < rect.x + rect.width &&
    y > rect.y &&
    y < rect.y + rect.height
  );
}
