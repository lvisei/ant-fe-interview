export interface CsvParserOption {
  separator: string
  newline: RegExp
}

interface CsvRecord {
  [propName: string]: unknown
}

const Defaults: CsvParserOption = {
  separator: ',',
  newline: /[\r?\n]{1,2}/,
}

class CsvParser {
  options: CsvParserOption
  rows: string[][]
  headRow: string[]
  bodyRows: string[][]
  headMap: Map<number, string>

  constructor(opts?: CsvParserOption) {
    this.options = Object.assign({}, Defaults, opts)
    this.rows = []
    this.headRow = []
    this.bodyRows = []
    this.headMap = new Map()
  }

  parse(csvString: string) {
    const { newline, separator } = this.options
    const lines = csvString.trim().split(newline)

    this.rows = lines.map((line) => line.trim().split(separator))

    this.headRow = this.rows.slice(0, 1)[0]
    this.bodyRows = this.rows.slice(1)

    this.headMap = this.headRow.reduce((pre, cur, index) => {
      pre.set(index, cur)
      return pre
    }, this.headMap)

    return this
  }

  toList(skipHead = false): string[][] {
    return skipHead ? this.bodyRows : this.rows
  }

  toJson(): CsvRecord[] {
    const records = this.bodyRows.map((row) => {
      const initialValue: CsvRecord = {}
      const record = row.reduce((pre, cur, index) => {
        const key = this.headMap.get(index)

        if (key) {
          const vaule = Number(cur)
          if (cur === '' || Number.isNaN(vaule)) {
            pre[key] = cur
          } else {
            pre[key] = vaule
          }
        }
        return pre
      }, initialValue)
      return record
    })

    return records
  }
}

export default CsvParser
