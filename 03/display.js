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

  static randomColor(range = 360, saturation = '80%', alpha = 0.6) {
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
      const { point, radius, options } = item
      this.drawCircle(point, radius, options)
    }
  }

  drawCircle(point = [0, 0], radius = 3, { fillColor = 'yellow', strokeColor = '', lineWidth = 0 } = {}) {
    this.ctx.save()
    this.ctx.beginPath()
    this.ctx.arc(point[0], point[1], radius, 0, Math.PI * 2)
    this.ctx.closePath()
    this.ctx.lineWidth = lineWidth
    this.ctx.strokeStyle = strokeColor
    this.ctx.stroke()
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
    // this.ctx.fillStyle = 'rgba(255, 255, 255, 0)'
    // this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.strokeStyle = 'black'
    this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height)
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
