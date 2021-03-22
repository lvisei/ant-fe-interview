import CsvParser from '../src/csv-parser'

const csv = `
 name,age,parent
 Bob,30,David
 David,60,
`
test('csvParser parse csv to json', () => {
  const csvParser = new CsvParser()
  expect(csvParser.parse(csv).toJson()).toEqual([
    { name: 'Bob', age: 30, parent: 'David' },
    { name: 'David', age: 60, parent: '' },
  ])
})

test('csvParser parse csv to list', () => {
  const csvParser = new CsvParser()
  expect(csvParser.parse(csv).toList()).toEqual([
    ['name', 'age', 'parent'],
    ['Bob', '30', 'David'],
    ['David', '60', ''],
  ])
})

test('csvParser parse csv to list (skipHead)', () => {
  const csvParser = new CsvParser()
  expect(csvParser.parse(csv).toList(true)).toEqual([
    ['Bob', '30', 'David'],
    ['David', '60', ''],
  ])
})
