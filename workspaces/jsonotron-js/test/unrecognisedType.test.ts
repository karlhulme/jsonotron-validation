import { expect, test } from '@jest/globals'
import { parseTypeLibrary, UnrecognisedTypeError, ValueValidator } from '../src'
import { asError, TEST_DOMAIN } from './shared.test'

test('An attempt to validate against an unrecognised type is rejected.', () => {
  const typeLibrary = parseTypeLibrary({})
  const validator = new ValueValidator(typeLibrary, TEST_DOMAIN)
  expect(() => validator.validateValue('test/unrecognised', 'any')).toThrow(asError(UnrecognisedTypeError))
})
