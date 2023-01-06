import * as moment from 'moment'
import { DATE_DISPLAY_FORMAT } from '../models/client-specs/form/constants'
import { isNumber } from './type-checkers'
import { valueToDateRange } from './value-converters'

export const getBasicStringInputValidationMsg = (arg: {
  value?: string
  label?: string
  required?: boolean
  min?: string
  max?: string
}) => {
  const { value, label, required, min, max } = arg
  const lbl = (label ?? 'This field').replace(/\n/g, ' ')

  if (!value) {
    if (required) {
      return `${lbl} is a required field`
    }

    if (!isNumber(min) || !isNumber(max)) return ''
    const minLength = Number(min)

    if (!!minLength && minLength > 0) {
      return `${lbl} must contain at least ${minLength} character(s)`
    }

    return ''
  }

  if (!isNumber(min) || !isNumber(max)) return ''
  const maxLength = Number(max)
  const minLength = Number(min)

  if (maxLength === -1) {
    if (!!minLength && minLength > 0 && minLength > value.length) {
      return `${lbl} should contain less than ${minLength} character(s)`
    }

    return ''
  }

  if (!!minLength && minLength > 0) {
    if (minLength > value.length || (!!maxLength && value.length > maxLength)) {
      return `${lbl} should contain ${minLength}-${maxLength} characters`
    }

    return ''
  }

  if (!!maxLength && value.length > maxLength) {
    return `${lbl} should not contain more than ${maxLength} character(s)`
  }

  return ''
}

export const getBasicListInputValidationMsg = (arg: {
  value?: string[]
  label?: string
  required?: boolean
  min?: string
  max?: string
}) => {
  const { value, label, required, min, max } = arg
  const lbl = (label ?? 'This field').replace(/\\n/g, ' ')

  if (!value || value.length === 0) {
    if (required) {
      return `${lbl} requires at least 1 item`
    }

    if (!isNumber(min) || !isNumber(max)) return ''
    const minLength = Number(min)

    if (!!minLength && minLength > 0) {
      return `${lbl} must contain at least\n${minLength} item(s)`
    }

    return ''
  }

  if (!isNumber(min) || !isNumber(max)) return ''
  const maxLength = Number(max)
  const minLength = Number(min)

  if (maxLength === -1) {
    if (!!minLength && minLength > 0 && minLength > value.length) {
      return `${lbl} should contain less than ${minLength} item(s)`
    }

    return ''
  }

  if (!!minLength && minLength > 0) {
    if (minLength > value.length || (!!maxLength && value.length > maxLength)) {
      return `${lbl} should contain ${minLength}-${maxLength} items`
    }

    return ''
  }

  if (!!maxLength && value.length > maxLength) {
    return `${lbl} should not contain more than ${maxLength} item(s)`
  }

  return ''
}

export const getBasicDateRangeInputValidationMsg = (arg: {
  value?: [string | undefined, string | undefined]
  label?: string
  required?: boolean
  min?: string
  max?: string
}) => {
  const { value, label, required, min, max } = arg
  const lbl = (label ?? 'This field').replace(/\\n/g, ' ')

  if (!required) {
    if (!value) return ''
    if (!value[0] && !value[1]) return ''
  }

  if (required && (!value || !value[0] || !value[1])) {
    return `${lbl} requires range of dates to be filled in`
  }

  if (!value) return ''

  const [startDateString, endDateString] = value
  const startDate = moment(startDateString)
  const endDate = moment(endDateString)
  const [minDateString, maxDateString] = valueToDateRange([min, max])
  const minDate = moment(minDateString)
  const maxDate = moment(maxDateString)

  if (startDateString) {
    if (endDateString) {
      if (minDateString) {
        if (minDate.diff(startDate, 'days') > 0) {
          return `${lbl} cannot have the start date set earlier than "${minDate.format(
            DATE_DISPLAY_FORMAT,
          )}"`
        }

        if (minDate.diff(endDate, 'days') > 0) {
          return `${lbl} cannot have the end date set earlier than "${minDate.format(
            DATE_DISPLAY_FORMAT,
          )}"`
        }
      }

      if (maxDateString) {
        if (startDate.diff(maxDate, 'days') > 0) {
          return `${lbl} cannot have the start date set later than "${maxDate.format(
            DATE_DISPLAY_FORMAT,
          )}"`
        }

        if (endDate.diff(maxDate, 'days') > 0) {
          return `${lbl} cannot have the end date set later than "${maxDate.format(
            DATE_DISPLAY_FORMAT,
          )}"`
        }
      }

      return ''
    }

    if (minDateString) {
      if (minDate.diff(startDate, 'days') > 0) {
        return `${lbl} cannot have the start date set earlier than "${minDate.format(
          DATE_DISPLAY_FORMAT,
        )}"`
      }
    }

    if (maxDateString) {
      if (startDate.diff(maxDate, 'days') > 0) {
        return `${lbl} cannot have the start date set later than "${maxDate.format(
          DATE_DISPLAY_FORMAT,
        )}"`
      }
    }
  }

  if (endDateString) {
    if (minDateString) {
      if (minDate.diff(endDate, 'days') > 0) {
        return `${lbl} cannot have the end date set earlier than "${minDate.format(
          DATE_DISPLAY_FORMAT,
        )}"`
      }
    }

    if (maxDateString) {
      if (endDate.diff(maxDate, 'days') > 0) {
        return `${lbl} cannot have the end date set later than "${maxDate.format(
          DATE_DISPLAY_FORMAT,
        )}"`
      }
    }
  }

  return ''
}

export const getBasicDateInputValidationMsg = (arg: {
  value?: string
  label?: string
  required?: boolean
  min?: string
  max?: string
}) => {
  const { value, label, required, min, max } = arg
  const lbl = (label ?? 'This field').replace(/\\n/g, ' ')

  if (!value) {
    if (required) return `${lbl} is a required field`
    return ''
  }

  const date = moment(value)
  const [minDateString, maxDateString] = valueToDateRange([min, max])
  const minDate = moment(minDateString)
  const maxDate = moment(maxDateString)

  if (minDateString) {
    if (minDate.diff(date, 'days') > 0) {
      return `${lbl} cannot have the date set earlier than "${minDate.format(
        DATE_DISPLAY_FORMAT,
      )}"`
    }
  }

  if (maxDateString) {
    if (date.diff(maxDate, 'days') > 0) {
      return `${lbl} cannot have the date set later than "${maxDate.format(
        DATE_DISPLAY_FORMAT,
      )}"`
    }
  }

  return ''
}
