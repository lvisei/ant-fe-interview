export function throttle(fn, threshhold = 250) {
  let timerId, last

  return function (...args) {
    const now = Date.now()
    if (last && last - now < threshhold) {
      clearTimeout(timerId)
      timerId = setTimeout(() => {
        fn.apply(this, args)
      }, threshhold)
    } else {
      last = now
      fn.apply(this, args)
    }
  }
}
