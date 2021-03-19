class Canvas {
  constructor(parent = document.body, width = 400, height = 400) {
    this.canvas = document.createElement('canvas')
    this.canvas.width = width
    this.canvas.height = height
    parent.appendChild(this.canvas)
    this.ctx = this.canvas.getContext('2d')

    this.reversalCoordinateSystem()
  }

  static degreeToRadian(degree) {
    return (degree * Math.PI) / 180
  }

  reversalCoordinateSystem() {
    this.ctx.translate(0, this.canvas.height)
    this.ctx.scale(1, -1)
  }

  sync(lines) {
    this.clearDisplay()
    this.drawLines(lines)
  }

  clearDisplay() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    // opacity controls the trail effect set to 1 to remove
    this.ctx.fillStyle = 'rgba(255, 255, 255, .4)'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.strokeStyle = 'black'
    this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height)
  }

  drawLines(lines) {
    if (lines.length < 2) return
    for (let index = 0; index < lines.length; index++) {
      if (index === lines.length - 1) break
      const item = lines[index]
      const next = lines[index + 1]
      this.drawLine(item, next)
    }
  }

  drawLine(start = [0, 0], end = [100, 100]) {
    this.ctx.save()
    this.ctx.beginPath()
    this.ctx.moveTo(...start)
    this.ctx.lineTo(...end)
    this.ctx.closePath()

    this.ctx.lineWidth = 3
    this.ctx.strokeStyle = 'red'
    this.ctx.stroke()
    this.ctx.restore()

    this.drawCircle(start)
    this.drawCircle(end)
  }

  drawCircle(point = [0, 0], radius = 3, color = 'yellow') {
    this.ctx.save()
    this.ctx.beginPath()
    this.ctx.arc(point[0], point[1], radius, 0, Math.PI * 2)
    this.ctx.closePath()
    this.ctx.lineWidth = 3
    this.ctx.strokeStyle = 'red'
    this.ctx.stroke()
    this.ctx.fillStyle = color
    this.ctx.fill()
    this.ctx.restore()
  }
}

const display = new Canvas(document.querySelector('#display'), 800, 500)
const lines = [
  [100, 100],
  [200, 150],
  [400, 200],
]
display.sync(lines)
display.sync([
  [100, 200],
  [200, 250],
  [400, 300],
])
