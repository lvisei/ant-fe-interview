import CsvParser from './csv-parser'
import listToTree from './list-to-tree'

const csvToJson = (csvString, { parser, treeSchema }) => {
  const csvParser = new CsvParser(parser)
  const records = csvParser.parse(csvString).json()
  const jsonTree = listToTree(records, treeSchema)

  return jsonTree
}

export default csvToJson
