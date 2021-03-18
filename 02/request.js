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
 * @param {Object} [{ params, data, options }={ params: {}, data: {} }]
 * @returns {Promise}
 */
const requset = (url, method = 'GET', { params, data, options } = { params: {}, data: {} }) => {
  method = method.toUpperCase()
  const { responseType, timeout, withCredentials, header } = Object.assign({}, DefaultOption, options)
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
          reject({ status, statusText })
        }
      }
    }

    xhr.ontimeout = () => {
      reject({ error: 'The request for ' + url + ' timed out.' })
    }

    xhr.onerror = (e) => {
      reject(e)
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

export default requset
