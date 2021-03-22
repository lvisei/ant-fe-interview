interface ListItem {
  [propName: string]: unknown
}

interface JsonTree {
  [propName: string]: unknown | JsonTree[]
}

interface CacheMap {
  [propName: string]: JsonTree
}

export interface TreeKeysOption {
  id: string
  pid: string
  children: string
}

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

export const listToTree = (
  list: ListItem[],
  { id, pid, children }: TreeKeysOption = { id: 'id', pid: 'pid', children: 'children' }
) => {
  const cloneList = deepClone<ListItem[]>(list)
  const cacheMap: CacheMap = {}
  const jsonTree: JsonTree[] = []

  cloneList.forEach((item) => {
    const key = item[id] as string
    cacheMap[key] = item
    cacheMap[key][children] = []
  })

  cloneList.forEach((item) => {
    const key = item[pid] as string
    const parent = cacheMap[key]
    if (parent) {
      const _children = parent[children] as JsonTree[]
      _children.push(item)
    } else {
      jsonTree.push(item)
    }
  })

  return jsonTree
}
