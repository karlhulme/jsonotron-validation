/* eslint-env jest */
const createJsonSchemaForDocTypeConstructorParameters = require('./createJsonSchemaForDocTypeConstructorParameters')

const fieldTypes = [{
  name: 'money',
  jsonSchema: { type: 'float' }
}, {
  name: 'dateTimeUtc',
  jsonSchema: { type: 'string' }
}]

const docType = {
  name: 'candidate',
  fields: {},
  ctor: {
    parameters: {
      amount: { type: 'money', isRequired: true },
      event: { type: 'dateTimeUtc' }
    }
  }
}

test('Build a JSON Schema for doc type constructor parameters.', () => {
  expect(createJsonSchemaForDocTypeConstructorParameters(docType, fieldTypes)).toEqual({
    title: 'Doc Type "candidate" (Constructor)',
    $schema: 'http://json-schema.org/draft-07/schema#',
    type: 'object',
    additionalProperties: false,
    properties: {
      amount: { $ref: '#/definitions/money' },
      event: { $ref: '#/definitions/dateTimeUtc' }
    },
    required: ['amount'],
    definitions: {
      dateTimeUtc: { type: 'string' },
      money: { type: 'float' }
    }
  })
})
