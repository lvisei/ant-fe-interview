import Display from './display.js'
import { throttle } from './helper.js'

class CacheRender extends Display {
  constructor(parent, width, height, count = 600, radius = 10) {
    super(parent, width, height)
    this.circles = this.randomCircles(count, radius)
    this.caches = this.createCaches(this.circles)
    this.onMousemoveHander = throttle(this.onMousemove, 16)

    this.canvas.addEventListener('mousemove', this.onMousemoveHander)
    this.drawCaches(this.circles)
  }

  /**
   * 绘制单个离屏圆
   * @param {number} [radius=3]
   * @param {Object} [{ fillColor = 'yellow' }={}]
   * @returns OffscreenCanvas
   * @memberof CacheRender
   */
  createCircleCache(radius = 3, { fillColor = 'yellow' } = {}, offscreenCanvas) {
    if (!offscreenCanvas) {
      offscreenCanvas = new OffscreenCanvas(radius * 2, radius * 2)
    }

    const ctx = offscreenCanvas.getContext('2d')

    if (offscreenCanvas) {
      ctx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height)
    }

    ctx.beginPath()
    ctx.arc(radius, radius, radius, 0, Math.PI * 2)
    ctx.closePath()
    ctx.fillStyle = fillColor
    ctx.fill()
    return offscreenCanvas
  }

  /**
   * 创建离屏缓存图形
   * @param {Array} circles
   * @returns {Array}
   * @memberof CacheRender
   */
  createCaches(circles) {
    const result = []
    for (let i = 0; i < circles.length; i++) {
      const { radius, options } = circles[i]
      // 创建离屏 Canvas 缓存图形
      const cacheCanvas = this.createCircleCache(radius, options)

      result.push(cacheCanvas)
    }
    return result
  }

  /**
   * 将离屏图形绘制到 Canvas 上
   * @param {*} circles
   * @memberof CacheRender
   */
  drawCaches(circles) {
    const caches = this.caches
    for (let index = 0; index < circles.length; index++) {
      const { x, y, radius, options } = circles[index]
      const shape = caches[index]
      this.ctx.drawImage(shape, x - radius, y - radius)
    }
  }

  /**
   * 鼠标移动回调函数
   * @param {MouseEvent} event
   */
  onMousemove = (event) => {
    const { x, y } = this.getCursorPosition(event)
    const indexCircle = this.findCursorInCircle(x, y, this.circles)
    if (indexCircle !== -1) {
      const activeCircle = this.circles.splice(indexCircle, 1)[0]
      Object.assign(activeCircle.options, { fillColor: Display.activeColor })
      const activeShape = this.caches.splice(indexCircle, 1)[0]

      this.renderCircles(activeCircle, activeShape)
      // // 更新顺序
      this.circles.push(activeCircle)
      this.caches.push(activeShape)
    }
  }

  renderCircles(activeCircle, activeShape) {
    this.clear()
    this.drawCaches(this.circles)
    const { x, y, radius, options } = activeCircle
    this.createCircleCache(radius, options, activeShape)
    this.ctx.drawImage(activeShape, x - radius, y - radius)
  }

  reset(count = 500, radius = 10) {
    this.circles = this.randomCircles(count, radius)
    this.caches = this.createCaches(this.circles)
    this.clear()
    this.drawCaches(this.circles)
  }

  destroy() {
    this.canvas.removeEventListener('mousemove', this.onMousemoveHander)
    this.caches = null
    super.destroy()
  }
}

export default CacheRender
