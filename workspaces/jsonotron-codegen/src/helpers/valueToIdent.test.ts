import { expect, test } from '@jest/globals'
import { valueToIdent } from './valueToIdent'

test('Convert a value into an ident.', async () => {
  expect(valueToIdent('myType')).toEqual('myType')
  expect(valueToIdent('my Type')).toEqual('my_Type')
  expect(valueToIdent('my%Type')).toEqual('my_Type')
  expect(valueToIdent('_my Type')).toEqual('_my_Type')
  expect(valueToIdent('123')).toEqual('_123')
})

test('Convert an undefined into a ident.', async () => {
  expect(valueToIdent()).toEqual('')
})
