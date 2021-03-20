class Display {
  constructor(parent = document.body, width = 400, height = 400) {
    this.canvas = document.createElement('canvas')
    this.canvas.width = width
    this.canvas.height = height
    this.parent = parent
    this.ctx = this.canvas.getContext('2d')

    this.parent.appendChild(this.canvas)
    this.clear()
  }

  static degreeToRadian(degree) {
    return (degree * Math.PI) / 180
  }

  static randomColor(range = 360, saturation = '80%', alpha = 1) {
    return `hsl(${Math.random() * range}, ${saturation}, 50%, ${alpha})`
  }

  getCursorPosition(event) {
    const rect = this.canvas.getBoundingClientRect()
    return {
      x: (event.clientX - rect.left) * (this.canvas.width / rect.width),
      y: (event.clientY - rect.top) * (this.canvas.height / rect.height),
    }
  }

  drawCircles(circles) {
    for (let index = 0; index < circles.length; index++) {
      const item = circles[index]
      const { x, y, radius, options } = item
      this.drawCircle(x, y, radius, options)
    }
  }

  drawCircle(x, y, radius = 3, { fillColor = 'yellow' } = {}) {
    this.ctx.save()
    this.ctx.beginPath()
    this.ctx.arc(x, y, radius, 0, Math.PI * 2)
    this.ctx.closePath()
    this.ctx.fillStyle = fillColor
    this.ctx.fill()
    this.ctx.restore()
  }

  sync(circles) {
    this.clear()
    this.drawCircles(circles)
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  reversalCoordinateSystem() {
    this.ctx.translate(0, this.canvas.height)
    this.ctx.scale(1, -1)
  }

  destroy() {
    this.parent.removeChild(this.canvas)
  }
}

export default Display
