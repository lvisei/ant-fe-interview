import { listToTree, TreeKeysOption } from '../src/helper'

const list = [
  { name: 'Bob', age: 30, parent: 'David' },
  { name: 'David', age: 60, parent: '' },
  { name: 'Anna', age: 10, parent: 'Bob' },
]
const config: TreeKeysOption = { id: 'name', pid: 'parent', children: 'children' }

test('json list to json tree', () => {
  expect(listToTree(list, config)).toEqual([
    {
      name: 'David',
      age: 60,
      parent: '',
      children: [
        { name: 'Bob', age: 30, parent: 'David', children: [{ name: 'Anna', age: 10, parent: 'Bob', children: [] }] },
      ],
    },
  ])
})
