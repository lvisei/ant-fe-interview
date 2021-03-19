const Defaults = {
  separator: ',',
  newline: /[\r?\n]{1,2}/,
}

class CsvParser {
  constructor(opts) {
    this.options = Object.assign({}, Defaults, opts)
    this.rows = []
    this.headRow = []
    this.bodyRows = []
    this.headMap = {}
  }

  parse(csvString) {
    const { newline, separator } = this.options
    const lines = csvString.trim().split(newline)

    this.rows = lines.map((line) => line.split(separator))

    this.headRow = this.rows.slice(0, 1)[0]
    this.bodyRows = this.rows.slice(1)

    this.headMap = this.headRow.reduce((pre, cur, index) => {
      pre[index] = cur
      return pre
    }, {})

    return this
  }

  list(skipHead = false) {
    return skipHead ? this.bodyRows : this.rows
  }

  json() {
    const records = this.bodyRows.map((row) => {
      const record = row.reduce((pre, cur, index) => {
        const key = this.headMap[index]
        key && (pre[key] = cur)
        return pre
      }, {})
      return record
    })

    return records
  }
}

const csv = `
name,age,parent
Bob,30,David
David,60,
Anna,10,Bob
`
const input = `
name,age,parent
Bob,30,David
`

// interface Person {
//    name: string;
//    age: number;
//    parent: Person[];
//    children: Person[];
// }
const csvParser = new CsvParser({})

const records = csvParser.parse(csv).json()
console.log('records: ', records)

const listToJsonTree = (list, { id, pid, children } = { id: 'id', pid: 'pid', children: 'children' }) => {
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

const jsonTree = listToJsonTree(records, { id: 'name', pid: 'parent', children: 'children' })
console.log('jsonTree: ', JSON.stringify(jsonTree))
