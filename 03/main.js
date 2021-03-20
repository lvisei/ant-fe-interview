import Display from './display.js'
import { throttle } from './helper.js'

class CirclesDisplay extends Display {
  constructor(parent, width, height, count = 500, radius = 10) {
    super(parent, width, height)
    this.circles = this.randomCircles(count, radius)

    this.drawCircles(this.circles)

    const onMousemove = throttle(this.onMousemove, 100)
    this.canvas.addEventListener('mousemove', onMousemove)
  }

  randomCircles(count = 500, radius = 10) {
    const circles = []
    for (let i = 0; i < count; i++) {
      const x = Math.random() * this.canvas.width
      const y = Math.random() * this.canvas.height
      const fillColor = Display.randomColor(240)
      const circle = { point: [x, y], radius, options: { fillColor } }
      circles.push(circle)
    }

    return circles
  }

  isCursorInCircle(cursorX, cursorY, circle) {
    const { point, radius } = circle
    const dx = cursorX - point[0]
    const dy = cursorY - point[1]
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

  onMousemove = (event) => {
    const { x, y } = this.getCursorPosition(event)
    const indexCircle = this.findCursorInCircle(x, y, this.circles)
    console.log('indexCircle: ', indexCircle)
    if (indexCircle !== -1) {
      console.log('indexCircle: ', indexCircle)
    }
  }

  reset(count = 500, radius = 10) {
    this.circles = this.randomCircles(count, radius)

    this.clear()
    this.drawCircles(this.circles)
  }
}

const WIDTH = 1000
const HEIGHT = 600

const circlesDisplay = new CirclesDisplay(document.querySelector('#display'), WIDTH, HEIGHT)

// circlesDisplay.sync(CirclesDisplay.randomCircleData(700, 10))

// requestAnimationFrame(function update() {
//   display.sync(randomCircleData())
//   requestAnimationFrame(update)
// })
