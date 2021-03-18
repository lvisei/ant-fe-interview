import LRUCache from './lru-cache.js'
import request from './request.js'

const CacheRequsetStatus = {
  PENDING: 'PENDING',
  RESOLVED: 'RESOLVED',
  REJECTED: 'REJECTED',
}

const CacheSchema = {
  status: CacheRequsetStatus.PENDING,
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

    return this.requset(key, url, 'GET', { params, options })
  }

  post(url, data = {}, { options, cacheKey } = {}) {
    const key = cacheKey || url + JSON.stringify(data)

    return this.requset(key, url, 'POST', { data, options })
  }

  requset(cacheKey, url, method, config) {
    if (!this.hasCache(cacheKey)) return this._newRequset(cacheKey, url, method, config)

    const cacheSchema = this.getCache(cacheKey)
    if (cacheSchema.status === CacheRequsetStatus.PENDING) {
      return new Promise((resolve, reject) => {
        cacheSchema.resolves.push(resolve)
        cacheSchema.rejects.push(reject)
        this.putCache(cacheKey, cacheSchema)
      })
    }

    if (cacheSchema.status === CacheRequsetStatus.RESOLVED) {
      this.putCache(cacheKey, cacheSchema)
      return Promise.resolve(cacheSchema.response)
    }

    if (cacheSchema.status === CacheRequsetStatus.REJECTED) {
      return this._newRequset(cacheKey, url, method, config)
    }
  }

  _newRequset(key, url, method, config) {
    this.putCache(key, Object.assign({}, CacheSchema, { status: CacheRequsetStatus.PENDING }))

    return request(url, method, config)
      .then((data) => {
        const cacheSchema = this.getCache(key)
        cacheSchema.status = CacheRequsetStatus.RESOLVED
        cacheSchema.response = data
        cacheSchema.resolves.forEach((resolve) => resolve(data))

        return Promise.resolve(data)
      })
      .catch((error) => {
        const cacheSchema = this.getCache(key)
        cacheSchema.status = CacheRequsetStatus.REJECTED
        cacheSchema.response = error
        cacheSchema.rejects.forEach((reject) => reject(error))

        return Promise.reject(error)
      })
  }

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
