import CacheRequset from './cache-requset/index.js'

const cacheRequset = new CacheRequset(2)

const API = {
  get: { URL: 'https://admin.ywbang.icu/api/v1/pub/login/captchaid', data: {} },
  post: { URL: 'https://api.ywbang.icu/user/login', data: { password: '123456', username: 'admin' } },
}

const inputUrl = document.getElementById('url')
const selectMethod = document.getElementById('method')
const inputRequestData = document.getElementById('requestData')
const inputConcurrently = document.getElementById('concurrently')
const resultPane = document.querySelector('#resultPane tbody')

let requestIndex = 0

inputUrl.value = API.get.URL
inputRequestData.value = JSON.stringify(API.get.data)

const generateRowDom = (url, data, result) => {
  return `<tr>
    <td>${++requestIndex}</td>
    <td>${url}</td>
    <td>${JSON.stringify(data)}</td>
    <td>${JSON.stringify(result)}</td>
    <td>${result.fromCache ? 'YES' : 'NO'}</td>
  </tr>`
}

selectMethod.onchange = (e) => {
  const type = e.target.value
  inputUrl.value = API[type] && API[type].URL
  inputRequestData.value = API[type] && JSON.stringify(API[type].data)
}

document.getElementById('singleRequset').onclick = () => {
  const url = inputUrl.value
  const type = selectMethod.value
  const data = JSON.parse(inputRequestData.value)
  cacheRequset[type](url, data)
    .then((result) => {
      resultPane.innerHTML += generateRowDom(url, data, result)
    })
    .catch((errr) => {
      resultPane.innerHTML += generateRowDom(url, data, errr)
    })
}

document.getElementById('multiRequset').onclick = () => {
  const concurrently = Number(inputConcurrently.value)
  if (concurrently <= 0) return

  const url = inputUrl.value
  const type = selectMethod.value
  const data = JSON.parse(inputRequestData.value)
  for (let index = 1; index <= concurrently; index++) {
    cacheRequset[type](url, data)
      .then((result) => {
        console.log('index: ', index)
        resultPane.innerHTML += generateRowDom(url, data, result)
      })
      .catch((errr) => {
        resultPane.innerHTML += generateRowDom(url, data, errr)
      })
  }

  // Promise.all(new Array(concurrently).fill(cacheRequset[type](url, data)))
  //   .then((results) => {
  //     resultPane.innerHTML += results.map((result) => generateRowDom(url, data, result)).join('')
  //   })
  //   .catch((errr) => {
  //     resultPane.innerHTML += generateRowDom(url, data, errr)
  //   })
}

document.getElementById('reset').onclick = () => {
  resultPane.innerHTML = ''
  requestIndex = 0
  cacheRequset.deleteAllCache()
}

// cacheRequset.post('https://api.ywbang.icu/user/login', {
//   data: { password: '123456', username: 'admin' },
// })
