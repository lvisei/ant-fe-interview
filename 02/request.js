const DefaultOption = {
  responseType: 'json',
  timeout: Infinity,
  withCredentials: false,
  header: { 'Content-type': 'application/json' },
}

/**
 * Serialization params
 * @param  {Object}    params
 * @return {encode}    encodeURI
 */
const paramsSerializer = (params) => {
  const result = Object.keys(params).map((key) => {
    const value = params[key]
    const isString = typeof value === 'string'
    return `${key}=${isString ? value : JSON.stringify(value)}`
  })
  return encodeURI(result.join('&'))
}

/**
 * requset XMLHttpRequest
 * @param {String} url
 * @param {string} [method='GET' || 'POST']
 * @param {Object} [{ params, data, option }={ params: {}, data: {} }]
 * @returns {Promise}
 */
const requset = (url, method = 'GET', { params, data, option } = { params: {}, data: {} }) => {
  method = method.toUpperCase()
  const { responseType, timeout, withCredentials, header } = Object.assign({}, DefaultOption, option)
  const xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject()

  return new Promise((resolve, reject) => {
    xhr.onreadystatechange = () => {
      // 0, Instantiate; 1，open()；2，send()；3，response；4，end
      if (xhr.readyState === 4) {
        const { status, statusText, response } = xhr
        if ((status >= 200 && status < 300) || status === 304) {
          const result = { data: response, status, statusText }
          resolve(result)
        } else {
          reject(new Error({ status, statusText }))
        }
      }
    }

    xhr.ontimeout = () => {
      reject(new Error('The request for ' + url + ' timed out.'))
    }

    xhr.onerror = (e) => {
      reject(new Error(e))
    }

    if (params && Object.keys(params).length) {
      const queryString = paramsSerializer(params)
      url += `?${queryString}`
    }

    xhr.open(method, url, true)
    xhr.responseType = responseType
    xhr.timeout = timeout
    xhr.withCredentials = withCredentials

    if (method === 'GET' || method === 'DELETE') {
      xhr.send()
    } else if (method === 'POST' || method === 'PUT') {
      for (const key in header) {
        xhr.setRequestHeader(key, header[key])
      }
      xhr.send(JSON.stringify(data))
    }
  })
}

requset('https://admin.ywbang.icu/api/v1/pub/login/captchaid', 'GET', {
  params: { xxx: '' },
}).then((res) => {
  console.log('res: ', res)
})

requset('https://api.ywbang.icu/user/login', 'POST', {
  data: { password: '123456', username: 'admin' },
}).then((res) => {
  console.log('res: ', res)
})
