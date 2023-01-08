import * as moment from 'moment'
import { DATE_FORMAT } from '../models/constants/form-constants'
import { isArray, isConvertibleToMoment, isDate } from './type-checkers'

export const convertToColumnizedArray = <T>(
  value: T[],
  columnCount: number,
) => {
  const result: Array<T[]> = []

  if (columnCount <= 0) return result

  let stack: T[] = []
  let columnIdx = 0

  value.forEach((item) => {
    if (columnIdx + 1 === columnCount) {
      columnIdx = 0
      stack.push(item)
      result.push(stack)
      stack = []
    } else {
      columnIdx += 1
      stack.push(item)
    }
  })

  if (stack.length > 0) {
    result.push(stack)
  }

  return result
}

export const valueToMoment = (value: unknown) => {
  if (!value) return
  if (isDate(value)) return moment(value)
  if (!isConvertibleToMoment(value)) return

  return moment(value.substring(0, 10))
}

export const valueToDateString = (value: unknown) => {
  const result = valueToMoment(value)

  return result ? result.format(DATE_FORMAT) : undefined
}

export const momentToDateString = (value: unknown) => {
  if (!value || !moment.isMoment(value)) return
  return value.format(DATE_FORMAT)
}

export const valueToDateRange = (
  value: unknown,
): [string | undefined, string | undefined] => {
  return !isArray(value) || value.length === 0
    ? [undefined, undefined]
    : [
        valueToDateString(value[0]),
        value.length < 2 ? undefined : valueToDateString(value[1]),
      ]
}

export const momentToDateRange = (
  value: unknown,
): [string | undefined, string | undefined] => {
  return !isArray(value) || value.length === 0
    ? [undefined, undefined]
    : [
        momentToDateString(value[0]),
        value.length < 2 ? undefined : momentToDateString(value[1]),
      ]
}
