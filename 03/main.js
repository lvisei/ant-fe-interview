import PartialRedraw from './lib/partial-redraw.js'
import CacheRender from './lib/cache-render.js'

const $ = (el) => document.querySelector(el)
const WIDTH = 1000
const HEIGHT = 600

let display = null
let circleNums = Number($('#circleNums').value)
let circleRadius = Number($('#circleRadius').value)
let currentOption = null

$('#circleNums').onchange = (e) => {
  const _circleNums = Number(e.target.value)
  if (_circleNums <= 0) return
  circleNums = _circleNums

  if (display) {
    display.reset(circleNums, circleRadius)
  }
}

$('#circleRadius').onchange = (e) => {
  const _circleRadius = Number(e.target.value)
  if (_circleRadius <= 0) return
  circleRadius = _circleRadius

  if (display) {
    display.reset(circleNums, circleRadius)
  }
}

$('#option').onclick = (e) => {
  const target = e.target
  const option = target.id
  if (option === 'option') return
  if (currentOption) {
    currentOption.classList.toggle('active')
  }
  target.classList.toggle('active')
  currentOption = target

  if (display) {
    display.destroy()
  }

  if (option === 'option1') {
    display = new PartialRedraw(document.querySelector('#display'), WIDTH, HEIGHT, circleNums, circleRadius)
  } else if (option === 'option2') {
    display = new CacheRender(document.querySelector('#display'), WIDTH, HEIGHT, circleNums, circleRadius)
  }
}

$('#option1').click()

// requestAnimationFrame(function update() {
//   display.reset()
//   requestAnimationFrame(update)
// })
