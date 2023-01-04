export const getBasicStringInputValidationMsg = (arg: {
  value?: string
  label?: string
  required?: boolean
  minLength?: number
  maxLength?: number
}) => {
  const { value, label, required, minLength, maxLength } = arg
  const lbl = label ?? 'This field'

  if (!value) {
    if (required) {
      return `${lbl} is a required field`
    }

    if (!!minLength && minLength > 0) {
      return `${lbl} must contain at least\n${minLength} character(s)`
    }

    return ''
  }

  if (maxLength === -1) {
    if (!!minLength && minLength > 0 && minLength > value.length) {
      return `${lbl} should contain\n less than ${minLength} character(s)`
    }

    return ''
  }

  if (!!minLength && minLength > 0) {
    if (minLength > value.length || (!!maxLength && value.length > maxLength)) {
      return `${lbl} should contain\n${minLength}-${maxLength} characters`
    }

    return ''
  }

  if (!!maxLength && value.length > maxLength) {
    return `${lbl} should not contain\n more than ${maxLength} character(s)`
  }

  return ''
}

export const getBasicListInputValidationMsg = (arg: {
  value?: string[]
  label?: string
  required?: boolean
  minLength?: number
  maxLength?: number
}) => {
  const { value, label, required, minLength, maxLength } = arg
  const lbl = label ?? 'This field'

  if (!value || value.length === 0) {
    if (required) {
      return `${lbl} requires at least 1 item`
    }

    if (!!minLength && minLength > 0) {
      return `${lbl} must contain at least\n${minLength} item(s)`
    }

    return ''
  }

  if (maxLength === -1) {
    if (!!minLength && minLength > 0 && minLength > value.length) {
      return `${lbl} should contain\n less than ${minLength} item(s)`
    }

    return ''
  }

  if (!!minLength && minLength > 0) {
    if (minLength > value.length || (!!maxLength && value.length > maxLength)) {
      return `${lbl} should contain\n${minLength}-${maxLength} items`
    }

    return ''
  }

  if (!!maxLength && value.length > maxLength) {
    return `${lbl} should not contain\n more than ${maxLength} item(s)`
  }

  return ''
}
