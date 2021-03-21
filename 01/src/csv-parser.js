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

    this.rows = lines.map((line) => line.trim().split(separator))

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

export default CsvParser

// interface Person {
//    name: string;
//    age: number;
//    parent: Person[];
//    children: Person[];
// }
