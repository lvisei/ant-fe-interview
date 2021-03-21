import csvToJson from '../src/csv-to-json'

const csv = `
 name,age,parent
 Bob,30,David
 David,60,
 Anna,10,Bob
 Tom,23,David
`
const treeSchema = { id: 'name', pid: 'parent', children: 'children' }

test('csv to json', () => {
  expect(csvToJson(csv, { treeSchema: treeSchema })).toEqual([
    {
      name: 'David',
      age: '60',
      parent: '',
      children: [
        { name: 'Bob', age: '30', parent: 'David', children: [{ name: 'Anna', age: '10', parent: 'Bob' }] },
        { name: 'Tom', age: '23', parent: 'David' },
      ],
    },
  ])
})
