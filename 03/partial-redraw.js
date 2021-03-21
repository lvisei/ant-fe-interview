import Display from './display.js'
import { throttle } from './helper.js'

class PartialRedraw extends Display {
  static colorList = ['#19DCE6', '#A5E619', '#19E643', '#1C43FF', '#E6D918', '#D6E61A', '#18E6CE']
  static activeColor = 'hsl(0, 80%, 50%, 0.7)'

  constructor(parent, width, height, count = 600, radius = 10) {
    super(parent, width, height)
    this.circles = this.randomCircles(count, radius)
    this.currentHoverCircle = null
    this.onMousemoveHander = throttle(this.onMousemove, 16)

    this.canvas.addEventListener('mousemove', this.onMousemoveHander)
    this.drawCircles(this.circles)
  }

  /**
   * 随机生成颜色
   * @returns {String} color
   * @memberof PartialRedraw
   */
  randomColor() {
    const index = Math.floor(Math.random() * PartialRedraw.colorList.length)
    return PartialRedraw.colorList[index]
  }

  /**
   * 随机生成圆的集合
   * @param {number} [count=500]
   * @param {number} [radius=10]
   * @returns {Array}
   * @memberof PartialRedraw
   */
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

  /**
   * 点是否在圆内
   * @param {Number} cursorX
   * @param {Number} cursorY
   * @param {Object} circle
   * @returns {Boolean}
   * @memberof PartialRedraw
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
   * @memberof PartialRedraw
   */
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

  /**
   * 获取圆的包围盒
   * @param {Object} circle
   * @returns {Object} bbox
   * @memberof PartialRedraw
   */
  getCircleBBox(circle) {
    const { x: circleX, y: circleY, radius } = circle
    // hack 浮点数处理
    const bbox = {
      x: Math.floor(circleX - radius),
      y: Math.floor(circleY - radius),
      width: 2 * radius + (Math.ceil(circleX) - Math.floor(circleX)),
      height: 2 * radius + (Math.ceil(circleY) - Math.floor(circleY)),
    }
    return bbox
  }

  /**
   * 碰撞检测矩形与圆
   * @param {Object} rect
   * @param {Object} circle
   * @returns {Boolean}
   * @memberof PartialRedraw
   */
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

  /**
   * 获取与包围合相交的圆
   * @param {Object} rect
   * @param {Object} circles
   * @returns {Array}
   * @memberof PartialRedraw
   */
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

  /**
   * 鼠标移动回调函数
   * @param {MouseEvent} event
   */
  onMousemove = (event) => {
    const { x, y } = this.getCursorPosition(event)
    const indexCircle = this.findCursorInCircle(x, y, this.circles)
    if (indexCircle !== -1) {
      const activeCircle = this.circles[indexCircle]
      Object.assign(activeCircle.options, { fillColor: PartialRedraw.activeColor })
      this.circles.splice(indexCircle, 1)

      this.renderBBoxWithinCircles(activeCircle)
      // 更新顺序
      this.circles.push(activeCircle)
    }
  }

  /**
   * 重新渲染包围盒内的图形
   * @param {Object} activeCircle
   * @memberof PartialRedraw
   */
  renderBBoxWithinCircles(activeCircle) {
    const bbox = this.getCircleBBox(activeCircle)

    this.ctx.save()
    this.ctx.beginPath()
    this.ctx.rect(bbox.x, bbox.y, bbox.width, bbox.height)
    this.ctx.closePath()
    this.ctx.clip()
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    // border for test
    // this.ctx.strokeRect(bbox.x, bbox.y, bbox.width, bbox.height)

    // 计算包围盒内的圆
    const detectedCircles = this.circles
    const intersectCircles = this.getIntersectCircle(bbox, detectedCircles)

    // 重绘相交圆
    if (intersectCircles.length) {
      this.drawCircles(intersectCircles)
    }

    // 重绘当前高亮圆
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

export default PartialRedraw
