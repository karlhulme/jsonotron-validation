import { TypeMap } from '../interfaces'
import { convertJsonotronTypeNameToTypescriptInterfaceName } from './convertJsonotronTypeNameToTypescriptInterfaceName'
import { resolveJsonotronTypeToTypescriptType } from './resolveJsonotronTypeToTypescriptType'

/**
 * Generates a GraphQL type definitions string.
 * @param map A GraphQL map.
 * @param props The properties that govern the GraphQL generation.
 */
export function generateTypescriptInterfaces (map: TypeMap): string {
  const typesString = map.objectTypes
    .map(t => {
      const propLines = t.properties.map(p => {
        const docBlock = p.documentation ? `  /**\n   * ${p.documentation}\n   */\n` : ''
        const resolvedType = resolveJsonotronTypeToTypescriptType(p.refTypeName, 0, map)
        return `${docBlock}  ${p.propertyName}?: ${resolvedType}`
      })

      const docBlock = `/**\n * ${t.documentation}\n */\n`
      return `${docBlock}export interface ${convertJsonotronTypeNameToTypescriptInterfaceName(t.name)} {\n${propLines.join('\n\n')}\n}\n`
    })
    .join('\n')

  return typesString
}