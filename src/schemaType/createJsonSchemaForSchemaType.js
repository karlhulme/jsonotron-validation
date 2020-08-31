import check from 'check-types'
import { createJsonSchemaFragmentForSchemaType } from './createJsonSchemaFragmentForSchemaType'
import { createJsonSchemaDefinition } from './createJsonSchemaDefinition'
import { consts } from '../utils'

/**
 * Creates a JSON Schema for the given schema type.
 * @param {Object} schemaType A schema type.
 * @param {Array} schemaTypes An array of schema types that may be referenced by the given schema type.
 * @param {Array} enumTypes An array of enum types that may be referenced by the given schema type.
 */
export function createJsonSchemaForSchemaType (schemaType, schemaTypes, enumTypes) {
  check.assert.object(schemaType)
  check.assert.string(schemaType.name)
  check.assert.array.of.object(schemaTypes)
  check.assert.array.of.object(enumTypes)

  return {
    $schema: consts.JSON_SCHEMA_DECLARATION,
    title: `Schema Type "${schemaType.name}"`,
    ...createJsonSchemaFragmentForSchemaType(schemaType, consts.JSON_SCHEMA_DEFINITIONS_PATH),
    definitions: createJsonSchemaDefinition(schemaType.referencedSchemaTypes, schemaType.referencedEnumTypes, schemaTypes, enumTypes)
  }
}
