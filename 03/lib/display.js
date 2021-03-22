class Display {
  static activeColor = 'hsl(0, 80%, 50%, 0.7)'

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

  static randomColor(range = [40, 270], saturation = '80%', alpha = 0.8) {
    return `hsl(${Math.random() * (range[1] - range[0]) + range[0]}, ${saturation}, 50%, ${alpha})`
  }

  /**
   * 随机生成圆的集合
   * @param {number} [count=500]
   * @param {number} [radius=10]
   * @returns {Array}
   * @memberof Display
   */
  randomCircles(count = 500, radius = 10) {
    const circles = []
    for (let i = 0; i < count; i++) {
      const x = Math.random() * this.canvas.width
      const y = Math.random() * this.canvas.height
      const fillColor = Display.randomColor()
      const circle = { x, y, radius, options: { fillColor } }
      circles.push(circle)
    }

    return circles
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
      const { x, y, radius, options } = circles[index]
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
   * 点是否在圆内
   * @param {Number} cursorX
   * @param {Number} cursorY
   * @param {Object} circle
   * @returns {Boolean}
   * @memberof Display
   */
  isCursorInCircle(cursorX, cursorY, circle) {
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
   * @memberof Display
   */
  findCursorInCircle(cursorX, cursorY, circles) {
    // TODO: WebWorker (当圆数量上千时)
    for (let index = circles.length - 1; index >= 0; index--) {
      const circle = circles[index]
      if (this.isCursorInCircle(cursorX, cursorY, circle)) {
        return index
        break
      }
    }

    return -1
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
