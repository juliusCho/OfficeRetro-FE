export const isString = (value: unknown): value is string => {
  return typeof value === 'string' || value instanceof String
}

export const isNumber = (value: unknown): value is number => {
  return (
    typeof value === 'number' ||
    value instanceof Number ||
    (isString(value) && !Number.isNaN(Number(value)))
  )
}

export const isBoolean = (value: unknown): value is boolean => {
  return typeof value === 'boolean' || value instanceof Boolean
}

export const isConvertibleToMoment = (value: unknown): value is string => {
  if (!value) return true
  if (Object.prototype.toString.call(value) === '[object Date]') return true
  if (!isString(value)) return false
  if (value.length !== 10 && value.length < 19) return false

  const firstHyphenIdx = value.indexOf('-')
  if (firstHyphenIdx === -1 || firstHyphenIdx !== 4) return false

  const secondHyphenIdx = value.lastIndexOf('-')
  if (
    secondHyphenIdx === -1 ||
    secondHyphenIdx === firstHyphenIdx ||
    secondHyphenIdx !== 7
  )
    return false

  return true
}

export const isDate = (value: unknown): value is Date => {
  if (!value) return false
  if (!isConvertibleToMoment(value)) return false

  const timeAliasIdx = value.indexOf('T')
  if (timeAliasIdx === -1 || timeAliasIdx !== 10) return false

  const firstColonIdx = value.indexOf(':')
  if (firstColonIdx === -1 || firstColonIdx !== 13) return false

  const str = value.substring(firstColonIdx + 1)
  const secondColonIdx = str.indexOf(':')
  if (secondColonIdx === -1 || secondColonIdx !== 2) return false
  return true
}

export const isArray = (value: unknown): value is Array<unknown> => {
  return Array.isArray(value)
}

export const isStringArray = (value: unknown): value is string[] => {
  return (
    isArray(value) &&
    (value.length === 0 || value.every((v) => isString(v) && !isDate(v)))
  )
}

export const isDateArray = (
  value: unknown,
): value is [
  Date | string | null | undefined,
  Date | string | null | undefined,
] => {
  return (
    isArray(value) &&
    value.length >= 2 &&
    value.every((v) => isDate(v) || isConvertibleToMoment(v))
  )
}
