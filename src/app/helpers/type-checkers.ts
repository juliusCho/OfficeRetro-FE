export const isString = (value: unknown): value is string => {
  return typeof value === 'string' || value instanceof String
}

export const isNumber = (value: unknown): value is number => {
  return typeof value === 'number' || value instanceof Number
}

export const isBoolean = (value: unknown): value is boolean => {
  return typeof value === 'boolean' || value instanceof Boolean
}

export const isArray = (value: unknown): value is Array<unknown> => {
  return Array.isArray(value)
}

export const isStringArray = (value: unknown): value is string[] => {
  return (
    isArray(value) && (value.length === 0 || value.every((v) => isString(v)))
  )
}
