const listToTree = (list, { id, pid, children } = { id: 'id', pid: 'pid', children: 'children' }) => {
  const idMap = {}
  const jsonTree = []

  list.forEach((item) => (idMap[item[id]] = item))

  list.forEach((item) => {
    const parent = idMap[item[pid]]
    if (parent) {
      if (!parent[children]) {
        parent[children] = []
      }
      parent[children].push(item)
    } else {
      jsonTree.push(item)
    }
  })

  return jsonTree
}

export default listToTree
