import CsvParser, { CsvParserOption } from './src/csv-parser'
import { listToTree, TreeKeysOption } from './src/helper'

const csvToJson = (
  csvString: string,
  { parser, treeKeys }: { parser?: CsvParserOption; treeKeys?: TreeKeysOption }
) => {
  const csvParser = new CsvParser(parser)
  const records = csvParser.parse(csvString).toJson()
  const jsonTree = listToTree(records, treeKeys)

  return jsonTree
}

export default csvToJson
