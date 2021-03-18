import CacheRequset from './cache-requset.js'

const cacheRequset = new CacheRequset(2)

const API = {
  get: { URL: 'https://admin.ywbang.icu/api/v1/pub/login/captchaid', data: {} },
  post: { URL: 'https://api.ywbang.icu/user/login', data: { password: '123456', username: 'admin' } },
}

const inputUrl = document.getElementById('url')
const methodOption = document.getElementById('method')
const inputRequestData = document.getElementById('requestData')
const resultPane = document.getElementById('resultPane')

inputUrl.value = API.get.URL
inputRequestData.value = JSON.stringify(API.get.data)

methodOption.onchange = (e) => {
  const type = e.target.value
  inputUrl.value = API[type] && API[type].URL
  inputRequestData.value = API[type] && JSON.stringify(API[type].data)
}

let index = 0

document.getElementById('singleRequset').onclick = () => {
  const url = inputUrl.value
  const type = methodOption.value
  const data = JSON.parse(inputRequestData.value)
  cacheRequset[type](url, data)
    .then((result) => {
      resultPane.innerHTML += `<tr><td>${index++}</td><td>${url}</td><td>${JSON.stringify(
        data
      )}</td><td>${JSON.stringify(result)}</td></tr>`
    })
    .catch((errr) => {
      resultPane.innerHTML += `<tr><td>${index++}</td><td>${url}</td><td>${JSON.stringify(
        data
      )}</td><td>${JSON.stringify(errr)}</td></tr>`
    })
}

document.getElementById('multiRequset').onclick = () => {
  const url = inputUrl.value
  const type = methodOption.value
  const data = JSON.parse(inputRequestData.value)
  Promise.all([
    cacheRequset[type](url, data),
    cacheRequset[type](url, data),
    cacheRequset[type](url, data),
    cacheRequset[type](url, data),
    cacheRequset[type](url, data),
  ])
    .then((results) => {
      resultPane.innerHTML += results
        .map(
          (result) =>
            `<tr><td>${index++}</td><td>${url}</td><td>${JSON.stringify(data)}</td><td>${JSON.stringify(
              result
            )}</td></tr>`
        )
        .join('')
    })
    .catch((errr) => {
      resultPane.innerHTML += `<tr><td>${index++}</td><td>${url}</td><td>${JSON.stringify(
        data
      )}</td><td>${JSON.stringify(errr)}</td></tr>`
    })
}

document.getElementById('reset').onclick = () => {
  cacheRequset.deleteAllCache()
}

// cacheRequset.post('https://api.ywbang.icu/user/login', {
//   data: { password: '123456', username: 'admin' },
// })
