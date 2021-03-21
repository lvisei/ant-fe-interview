import PartialRedraw from './partial-redraw.js'

const WIDTH = 1000
const HEIGHT = 600

const partialRedraw = new PartialRedraw(document.querySelector('#display'), WIDTH, HEIGHT, 500, 15)

// requestAnimationFrame(function update() {
//   partialRedraw.reset()
//   requestAnimationFrame(update)
// })
