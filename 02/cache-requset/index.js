import { LRUCache, deepClone } from './helper.js'
import request from './request.js'

const CacheRequsetStatus = {
  PENDING: 'PENDING',
  RESOLVED: 'RESOLVED',
  REJECTED: 'REJECTED',
}

const CacheSchema = {
  status: CacheRequsetStatus.PENDING,
  time: null,
  response: null,
  resolves: [],
  rejects: [],
}

class CacheRequset extends LRUCache {
  constructor(capacity) {
    super(capacity)
  }

  get(url, params = {}, { options, cacheKey } = {}) {
    const key = cacheKey || url + JSON.stringify(params)

    return this.requset(url, 'GET', { params, options }, key)
  }

  post(url, data = {}, { options, cacheKey } = {}) {
    const key = cacheKey || url + JSON.stringify(data)

    return this.requset(url, 'POST', { data, options }, key)
  }

  requset(url, method, config, cacheKey) {
    if (!cacheKey) cacheKey = url
    if (!this.hasCache(cacheKey)) {
      const cacheSchema = Object.assign({}, CacheSchema, { status: CacheRequsetStatus.PENDING })
      this.putCache(cacheKey, cacheSchema)
      return this._newRequset(cacheSchema, url, method, config)
    }

    const cacheSchema = this.getCache(cacheKey)
    if (cacheSchema.status === CacheRequsetStatus.PENDING) {
      return new Promise((resolve, reject) => {
        cacheSchema.resolves.push(resolve)
        cacheSchema.rejects.push(reject)
      })
    }

    if (cacheSchema.status === CacheRequsetStatus.RESOLVED) {
      return Promise.resolve(deepClone(cacheSchema.response))
    }

    if (cacheSchema.status === CacheRequsetStatus.REJECTED) {
      // repeat new requset
      return this._newRequset(cacheSchema, url, method, config)
    }
  }

  _newRequset(cacheSchema, url, method, config) {
    return request(url, method, config)
      .then((data) => {
        const response = Object.assign({}, data, { fromCache: true })
        cacheSchema.time = Date.now()
        cacheSchema.status = CacheRequsetStatus.RESOLVED
        cacheSchema.response = deepClone(response)
        Promise.resolve().then(() => {
          while (cacheSchema.resolves.length) {
            const resolve = cacheSchema.resolves.shift()
            resolve(Promise.resolve().then(deepClone(cacheSchema.response)))
          }
        })

        return Promise.resolve(data)
      })
      .catch((error) => {
        const response = Object.assign({}, error, { fromCache: true })
        cacheSchema.time = Date.now()
        cacheSchema.status = CacheRequsetStatus.REJECTED
        cacheSchema.response = deepClone(response)
        while (cacheSchema.rejects.length) {
          const reject = cacheSchema.rejects.shift()
          reject(deepClone(cacheSchema.response))
        }
        return Promise.reject(error)
      })
  }

  // overwrite deleteCache
  deleteCache() {
    for (const [key, value] of this.cache) {
      if (value && value.status !== CacheRequsetStatus.PENDING) {
        this.cache.delete(key)
        break
      }
    }
  }
}

export default CacheRequset
