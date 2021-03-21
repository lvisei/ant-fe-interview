/**
 * 碰撞检测矩形与圆
 * @param {Object} rect
 * @param {Object} circle
 * @returns {Boolean}
 */
const detectRectCircleCollision = (rect, circle) => {
  let closestPointX, closestPointY

  if (circle.x < rect.x) {
    closestPointX = rect.x
  } else if (circle.x > rect.x + rect.width) {
    closestPointX = rect.x + rect.width
  } else {
    closestPointX = circle.x
  }

  if (circle.y < rect.y) {
    closestPointY = rect.y
  } else if (circle.y > rect.y + rect.height) {
    closestPointY = rect.y + rect.height
  } else {
    closestPointY = circle.y
  }

  if ((closestPointX - circle.x) ** 2 + (closestPointY - circle.y) ** 2 < circle.radius ** 2) {
    return true
  }

  return false
}

/**
 * 获取与包围合相交的圆
 * @param {Object} rect
 * @param {Object} circles
 * @returns {Array}
 */
const getIntersectCircle = (rect, circles) => {
  const intersectCircles = []
  for (let index = 0; index < circles.length; index++) {
    const circle = circles[index]
    if (detectRectCircleCollision(rect, circle)) {
      intersectCircles.push(circle)
    }
  }

  return intersectCircles
}

/**
 * 点是否在圆内
 * @param {Number} cursorX
 * @param {Number} cursorY
 * @param {Object} circle
 * @returns {Boolean}
 */
const isCursorInCircle = (cursorX, cursorY, circle) => {
  const { x, y, radius } = circle
  const dx = cursorX - x
  const dy = cursorY - y
  if (dx ** 2 + dy ** 2 <= radius ** 2) {
    return true
  }

  return false
}

/**
 * 查找点在圆内的圆的索引
 * @param {Number} cursorX
 * @param {Number} cursorY
 * @param {Array} circles
 * @returns {Number}
 */
const findCursorInCircle = (cursorX, cursorY, circles) => {
  for (let index = circles.length - 1; index >= 0; index--) {
    const circle = circles[index]
    if (isCursorInCircle(cursorX, cursorY, circle)) {
      return index
      break
    }
  }

  return -1
}

self.addEventListener('message', (evt) => {
  const { type, args } = evt.data
  switch (type) {
    case 'findCursorInCircle':
      const index = findCursorInCircle(...args)
      self.postMessage({ type: 'findCursorInCircle', result: index })
      break
    case 'getIntersectCircle':
      const circles = getIntersectCircle(...args)
      self.postMessage({ type: 'getIntersectCircle', result: circles })
      break
    default:
      break
  }
})
