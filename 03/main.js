import Display from './display.js'
import { throttle } from './helper.js'

class RedrawDisplay extends Display {
  static colorList = ['#19DCE6', '#A5E619', '#19E643', '#1C43FF', '#E6D918', '#D6E61A', '#18E6CE']
  static activeColor = 'hsl(0, 80%, 50%, 0.7)'

  constructor(parent, width, height, count = 600, radius = 10) {
    super(parent, width, height)
    this.circles = this.randomCircles(count, radius)
    this.currentHoverCircle = null
    this.onMousemoveHander = throttle(this.onMousemove, 16)

    this.canvas.addEventListener('mousemove', this.onMousemoveHander)
    this.drawCircles(this.circles)
    console.log('RedrawDisplay.colorList.length: ', RedrawDisplay.colorList.length)
  }

  randomColor() {
    const index = Math.floor(Math.random() * RedrawDisplay.colorList.length)
    return RedrawDisplay.colorList[index]
  }

  randomCircles(count = 500, radius = 10) {
    const circles = []
    for (let i = 0; i < count; i++) {
      const x = Math.random() * this.canvas.width
      const y = Math.random() * this.canvas.height
      const fillColor = this.randomColor()
      const circle = { x, y, radius, options: { fillColor } }
      circles.push(circle)
    }

    return circles
  }

  isCursorInCircle(cursorX, cursorY, circle) {
    const { x, y, radius } = circle
    const dx = cursorX - x
    const dy = cursorY - y
    if (dx ** 2 + dy ** 2 <= radius ** 2) {
      return true
    }

    return false
  }

  findCursorInCircle(cursorX, cursorY, circles) {
    for (let index = circles.length - 1; index >= 0; index--) {
      const circle = circles[index]
      if (this.isCursorInCircle(cursorX, cursorY, circle)) {
        return index
        break
      }
    }

    return -1
  }

  getCircleBBox(circle) {
    const { x: circleX, y: circleY, radius } = circle
    const bbox = {
      x: Math.floor(circleX - radius),
      y: Math.floor(circleY - radius),
      width: 2 * radius,
      height: 2 * radius,
    }
    return bbox
  }

  detectRectCircleCollision(rect, circle) {
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

  getIntersectCircle(rect, circles) {
    const intersectCircles = []
    for (let index = 0; index < circles.length; index++) {
      const circle = circles[index]
      if (this.detectRectCircleCollision(rect, circle)) {
        intersectCircles.push(circle)
      }
    }

    return intersectCircles
  }

  onMousemove = (event) => {
    const { x, y } = this.getCursorPosition(event)
    const indexCircle = this.findCursorInCircle(x, y, this.circles)
    console.log('indexCircle: ', indexCircle)
    if (indexCircle !== -1) {
      const activeCircle = this.circles[indexCircle]
      Object.assign(activeCircle.options, { fillColor: RedrawDisplay.activeColor })
      this.circles.splice(indexCircle, 1)

      this.renderBBoxWithnCircles(activeCircle)
      // 更新顺序
      this.circles.push(activeCircle)
    }
  }

  renderBBoxWithnCircles(activeCircle) {
    const bbox = this.getCircleBBox(activeCircle)

    this.ctx.save()
    this.ctx.beginPath()
    this.ctx.rect(bbox.x, bbox.y, bbox.width, bbox.height)
    this.ctx.closePath()
    this.ctx.clip()
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    // border
    // this.ctx.strokeRect(bbox.x, bbox.y, bbox.width, bbox.height)

    // 计算包围盒内的圆
    const detectedCircles = this.circles
    const intersectCircles = this.getIntersectCircle(bbox, detectedCircles)
    console.log('intersectCircles: ', intersectCircles)

    // 重绘相交圆
    if (intersectCircles.length) {
      this.drawCircles(intersectCircles)
    }
    // 重绘选择圆
    this.drawCircle(activeCircle.x, activeCircle.y, activeCircle.radius, activeCircle.options)

    this.ctx.restore()
  }

  reset(count = 500, radius = 10) {
    this.circles = this.randomCircles(count, radius)

    this.sync(this.circles)
  }

  destroy() {
    this.canvas.removeEventListener('mousemove', this.onMousemoveHander)
    super.destroy()
  }
}

const WIDTH = 1000
const HEIGHT = 600

const redrawDisplay = new RedrawDisplay(document.querySelector('#display'), WIDTH, HEIGHT, 500, 15)

// requestAnimationFrame(function update() {
//   redrawDisplay.reset()
//   requestAnimationFrame(update)
// })
