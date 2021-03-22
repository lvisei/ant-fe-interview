import csvToJson from '../index'
import { TreeKeysOption } from '../src/helper'

const csv = `
 name,age,parent
 Bob,30,David
 David,60,
 Anna,10,Bob
 Tom,23,David
`
const treeKeys: TreeKeysOption = { id: 'name', pid: 'parent', children: 'children' }

interface Person {
  name: string
  age: number
  parent: string
  children: Person[]
}

const result: Person[] = [
  {
    name: 'David',
    age: 60,
    parent: '',
    children: [
      { name: 'Bob', age: 30, parent: 'David', children: [{ name: 'Anna', age: 10, parent: 'Bob', children: [] }] },
      { name: 'Tom', age: 23, parent: 'David', children: [] },
    ],
  },
]

test('csv to json', () => {
  expect(csvToJson(csv, { treeKeys: treeKeys })).toEqual(result)
})
