import { snakeCase } from 'lodash'
import { EnumType, SchemaType, TypeMap, TypeMapObject } from 'jsonotron-interfaces'
import { convertJsonotronTypesToTypeMap } from '../typeMap'
import { wrapArrayIndicators, capitaliseInitialLetters, ensureInitialCharacter } from '../utils'

interface GenerateOptions {
  enumTypes: EnumType[]
  schemaTypes: SchemaType[]
}

export function generateGraphQL (options: GenerateOptions): string {
  const lines = [
    ...generateEnumTypeItem(),
    ...generateExtendedEnumTypeItems(options.enumTypes),
    ...generateEnumDeclarations(options.enumTypes),
    ...generateTypesForSchemaTypeObjects(options.enumTypes, options.schemaTypes)
  ]

  return lines.join('\n\n')
}

function generateEnumTypeItem (): string[] {
  return [generateEnumTypeItemTemplate('EnumTypeItem')]
}

function generateExtendedEnumTypeItems (enumTypes: EnumType[]): string[] {
  return enumTypes
    .filter(enumType => enumType.dataJsonSchema)
    .map(enumType => generateEnumTypeItemTemplate(
      `${capitaliseInitialLetters(enumType.name)}EnumTypeItem`,
      `${capitaliseInitialLetters(enumType.name)}Data`
    ))
}

function generateEnumDeclarations (enumTypes: EnumType[]): string[] {
  return enumTypes.map(enumType => {
    const itemLines = enumType.items.map(item => `  ${ensureInitialCharacter(snakeCase(item.value).toUpperCase())}`)

    return `enum ${capitaliseInitialLetters(enumType.name)} {\n${itemLines.join('\n')}\n}`
  })
}

function generateTypesForSchemaTypeObjects (enumTypes: EnumType[], schemaTypes: SchemaType[]): string[] {
  const typeMap = convertJsonotronTypesToTypeMap({ enumTypes, schemaTypes })

  return typeMap.objectTypes
    .map(t => {
      const propLines = t.properties.map(p => {
        const docBlock = p.documentation ? `  """\n  ${p.documentation}\n  """\n` : ''
        const resolvedType = resolveJsonotronTypeToGraphQLType(p.refTypeName, 0, typeMap)
        const reqMark = p.isRequired ? '!' : ''
        return `${docBlock}  ${p.propertyName}: ${resolvedType}${reqMark}`
      })

      const typeDocBlock = `"""\n${t.documentation}\n"""\n`
      const inputDocBlock = `"""\nThis is an input object.\n${t.documentation}\n"""\n`

      return `${typeDocBlock}type ${convertJsonotronTypeNameToGraphQLTypeName(t)} {\n${propLines.join('\n\n')}\n}\n\n` +
        `${inputDocBlock}input ${convertJsonotronTypeNameToGraphQLTypeName(t)}_Input {\n${propLines.join('\n\n')}\n}`
    })
}

function resolveJsonotronTypeToGraphQLType (fqnTypeName: string, arrayCount: number, map: TypeMap): string {
  const matchedRefType = map.refTypes.find(t => `${t.system}/${t.name}` === fqnTypeName)

  // we matched a ref type, if it's a scalar we can return that type
  // otherwise we need to repeat the search using the new (resolved) type name.
  if (matchedRefType) {
    if (matchedRefType.isEnumRef) {
      return wrapArrayIndicators(arrayCount + matchedRefType.refTypeArrayCount, capitaliseInitialLetters(matchedRefType.name))
    } else if (matchedRefType.isScalarRef) {
      return wrapArrayIndicators(arrayCount + matchedRefType.refTypeArrayCount, convertJsonotronScalarNameToGraphQLScalarName(matchedRefType.refTypeName))
    } else {
      return resolveJsonotronTypeToGraphQLType(matchedRefType.refTypeName, arrayCount + matchedRefType.refTypeArrayCount, map)
    }
  }

  const matchedObjectType = map.objectTypes.find(t => `${t.system}/${t.name}` === fqnTypeName)

  // we matched an object type, so we need to return it but apply formatting.
  /* istanbul ignore else */
  if (matchedObjectType) {
    return wrapArrayIndicators(arrayCount + matchedObjectType.objectTypeArrayCount, convertJsonotronTypeNameToGraphQLTypeName(matchedObjectType))
  } else {
    // we failed to resolve the type name
    return 'JSON'
  }
}

function convertJsonotronScalarNameToGraphQLScalarName (scalarName: string): string {
  if (scalarName === 'boolean') {
    return 'Boolean'
  } else if (scalarName === 'number') {
    return 'Float'
  } else if (scalarName === 'integer') {
    return 'Int'
  } else if (scalarName === 'string') {
    return 'String'
  } else {
    return 'JSON'
  }
}

function convertJsonotronTypeNameToGraphQLTypeName (obj: TypeMapObject): string {
  return capitaliseInitialLetters(obj.name)
}

function generateEnumTypeItemTemplate (typeName: string, dataTypeName?: string): string {
  const dataPropertyDeclaration = dataTypeName
    ? `  """\n  The custom data associated with the enum item.\n  """\n  data: ${dataTypeName}!`
    : ''

  return `
"""
Represents an enum type item
"""
type ${typeName} {
  """
  The underlying value of the item.
  """
  value: String!

  """
  The display text of the value in English.
  """
  text: String!

  """
  The documentation associated with this item.
  """
  documentation: String

  """
  If populated, this value explains why the value was deprecated and/or which item to use instead.
  """
  deprecated: String

  """
  A symbol associated with the item.
  """
  symbol: String

${dataPropertyDeclaration}
}`
}