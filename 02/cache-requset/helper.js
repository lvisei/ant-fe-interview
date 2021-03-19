export class LRUCache {
  constructor(capacity = 5) {
    this.cache = new Map()
    this.capacity = capacity
  }

  /**
   * @param {any} key
   * @return {boolean}
   */
  hasCache(key) {
    return this.cache.has(key)
  }

  /**
   * @param {any} key
   * @return {number|any}
   */
  getCache(key) {
    if (this.hasCache(key)) {
      // 存在即更新
      const temp = this.cache.get(key)
      this.cache.delete(key)
      this.cache.set(key, temp)
      return temp
    }
    return -1
  }

  /**
   * @param {any} key
   * @param {any} value
   * @return {void}
   */
  putCache(key, value) {
    if (this.hasCache(key)) {
      // 存在即更新（删除后加入）
      this.cache.delete(key)
    } else if (this.cache.size >= this.capacity) {
      // 缓存超过最大值，则移除最近没有使用的
      this.deleteCache()
    }
    // 不存在即加入
    this.cache.set(key, value)
  }

  deleteCache() {
    this.cache.delete(this.cache.keys().next().value)
  }

  deleteAllCache() {
    this.cache = new Map()
  }
}

export const deepClone = (target, map = new WeakMap()) => {
  if (!target || typeof target !== 'object') return target
  if (map.get(target)) return map.get(target)
  const result = Array.isArray(target) ? [] : {}
  map.set(target, result)
  for (const key in target) {
    if (Object.hasOwnProperty.call(target, key)) {
      result[key] = deepClone(target[key], map)
    }
  }

  return result
}

// const cache = new LRUCache(2)
// cache.putCache('key', 'value')
// cache.putCache('key1', 'value1')
// cache.putCache('key2', 'value2')
// console.log('cache.get(key): ', cache.getCache('key'))
