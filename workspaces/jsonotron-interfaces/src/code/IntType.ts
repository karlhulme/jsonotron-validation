import { JsonotronType } from './JsonotronType'

/**
 * Represents an integer.
 */
export interface IntType extends JsonotronType {
  /**
   * Specifies the minimum value of the integer.
   */
  minimum: number

  /**
   * Specifies the maximum value of the integer.
   */
  maximum: number
}
