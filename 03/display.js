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

  /**
   * 获取鼠标在画布的坐标位置
   * @param {MouseEvent} event
   * @returns {Object} {x,y}
   * @memberof Display
   */
  getCursorPosition(event) {
    const rect = this.canvas.getBoundingClientRect()
    return {
      x: (event.clientX - rect.left) * (this.canvas.width / rect.width),
      y: (event.clientY - rect.top) * (this.canvas.height / rect.height),
    }
  }

  /**
   * 批量绘制圆
   * @param {Array} circles
   * @memberof Display
   */
  drawCircles(circles) {
    for (let index = 0; index < circles.length; index++) {
      const item = circles[index]
      const { x, y, radius, options } = item
      this.drawCircle(x, y, radius, options)
    }
  }

  /**
   * 绘制单个圆
   * @param {Number} x
   * @param {Number} y
   * @param {number} [radius=3]
   * @param {Object} [{ fillColor = 'yellow' }={}]
   * @memberof Display
   */
  drawCircle(x, y, radius = 3, { fillColor = 'yellow' } = {}) {
    this.ctx.save()
    this.ctx.beginPath()
    this.ctx.arc(x, y, radius, 0, Math.PI * 2)
    this.ctx.closePath()
    this.ctx.fillStyle = fillColor
    this.ctx.fill()
    this.ctx.restore()
  }

  /**
   * 更新画布
   * @param {Array} circles
   * @memberof Display
   */
  sync(circles) {
    this.clear()
    this.drawCircles(circles)
  }

  /**
   * 清空画布
   * @memberof Display
   */
  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  /**
   * 翻转画布坐标系
   * @memberof Display
   */
  reversalCoordinateSystem() {
    this.ctx.translate(0, this.canvas.height)
    this.ctx.scale(1, -1)
  }

  /**
   * destroy
   * @memberof Display
   */
  destroy() {
    this.parent.removeChild(this.canvas)
  }
}

export default Display
