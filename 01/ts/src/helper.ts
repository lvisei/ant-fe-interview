interface listItem {
  [propName: string]: unknown
}

interface JsonTree {
  [propName: string]: unknown | JsonTree[]
}

interface cacheMap {
  [propName: string]: JsonTree
}

export interface TreeKeysOption {
  id: string
  pid: string
  children: string
}

export const listToTree = (
  list: listItem[],
  { id, pid, children }: TreeKeysOption = { id: 'id', pid: 'pid', children: 'children' }
) => {
  const idMap: cacheMap = {}
  const jsonTree: JsonTree[] = []

  list.forEach((item) => {
    idMap[item[id] as string] = item
    if (!item[children]) {
      item[children] = []
    }
  })

  list.forEach((item) => {
    const parent = idMap[item[pid] as string]
    if (parent) {
      const _children = parent[children] as JsonTree[]
      _children.push(item)
    } else {
      jsonTree.push(item)
    }
  })

  return jsonTree
}
