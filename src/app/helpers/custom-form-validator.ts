import { AbstractControl } from '@angular/forms'
import * as moment from 'moment'
import * as punycode from 'punycode/'
import { CustomValidationErrors } from '../models/client-specs/form/form-input-types'
import { DATE_DISPLAY_FORMAT } from '../models/constants/form-constants'
import { isArray, isNumber, isString } from './type-checkers'

export class CustomValidator {
  static readonly required = (
    control: AbstractControl,
  ): CustomValidationErrors | null => {
    if (
      !control.value ||
      (isArray(control.value) && control.value.length === 0)
    ) {
      return { required: { message: 'is a required field', priority: 1 } }
    }

    return null
  }

  static readonly min = (minimum: number) => {
    return (control: AbstractControl): CustomValidationErrors | null => {
      if (minimum < 0 || !isNumber(control.value)) return null

      return control.value < minimum
        ? {
            min: {
              message: `should not be smaller than ${minimum}`,
              priority: 5,
            },
          }
        : null
    }
  }

  static readonly max = (maximum: number) => {
    return (control: AbstractControl): CustomValidationErrors | null => {
      if (maximum < 0 || !isNumber(control.value)) return null

      return control.value > maximum
        ? {
            max: {
              message: `should not be larger than ${maximum}`,
              priority: 6,
            },
          }
        : null
    }
  }

  static readonly minLength = (minimum: number) => {
    return (control: AbstractControl): CustomValidationErrors | null => {
      if (minimum < 0 || !isString(control.value)) return null

      return control.value.length < minimum
        ? {
            minLength: {
              message: `should be longer than ${minimum} character(s)`,
              priority: 5,
            },
          }
        : null
    }
  }

  static readonly maxLength = (maximum: number) => {
    return (control: AbstractControl): CustomValidationErrors | null => {
      if (maximum < 0 || !isString(control.value)) return null

      return control.value.length > maximum
        ? {
            maxLength: {
              message: `should be shorter than ${maximum} character(s)`,
              priority: 6,
            },
          }
        : null
    }
  }

  static readonly listMin = (minimumCount: number) => {
    return (control: AbstractControl): CustomValidationErrors | null => {
      if (!isArray(control.value)) return null

      const isNotEnough = control.value.length < minimumCount
      return isNotEnough
        ? {
            listMin: {
              message: `requires at least ${minimumCount} item(s)`,
              priority: 2,
            },
          }
        : null
    }
  }

  static readonly listMax = (maximumCount: number) => {
    return (control: AbstractControl): CustomValidationErrors | null => {
      if (!isArray(control.value)) return null

      const isExceeded = control.value.length > maximumCount
      return isExceeded
        ? {
            listMax: {
              message: `should not contain more than ${maximumCount} item(s)`,
              priority: 3,
            },
          }
        : null
    }
  }

  static readonly noBlank = (
    control: AbstractControl,
  ): CustomValidationErrors | null => {
    if (!control.value || !isString(control.value)) return null

    return / /g.test(control.value)
      ? { noBlank: { message: 'should not contain blank space', priority: 4 } }
      : null
  }

  static readonly email = (
    control: AbstractControl,
  ): CustomValidationErrors | null => {
    if (!control.value || !isString(control.value)) return null

    const value = punycode.toASCII(control.value)

    const regex =
      /(?:[a-z0-9+!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i

    return value.match(regex)
      ? null
      : { email: { message: 'format is not valid', priority: 7 } }
  }

  static readonly password = (
    control: AbstractControl,
  ): CustomValidationErrors | null => {
    if (!control.value || !isString(control.value)) return null

    return control.value.match(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*\\\/\(\)\-__+\.\[\]\'\"\{\}\;\:\?\<\>\,\=\`\~\|])/,
    )
      ? null
      : {
          password: {
            message: 'must combine alphanumeric & special characters',
            priority: 8,
          },
        }
  }

  static readonly excludeString = (str: string) => {
    return (control: AbstractControl): CustomValidationErrors | null => {
      if (!control.value || !isString(control.value)) return null

      const regex = new RegExp(str, 'g')
      return regex.test(control.value)
        ? {
            excludeString: {
              message: `should not contain ${str}`,
              priority: 3,
            },
          }
        : null
    }
  }

  static readonly date = (
    control: AbstractControl,
  ): CustomValidationErrors | null => {
    if (!control.value) null

    return moment(control.value).isValid()
      ? null
      : {
          date: {
            message: `must be in date format("${DATE_DISPLAY_FORMAT}")`,
            priority: 2,
          },
        }
  }

  static readonly dateMin = (minDate: moment.Moment) => {
    return (control: AbstractControl): CustomValidationErrors | null => {
      if (!control.value || !moment(control.value).isValid()) return null

      const isTooEarly = minDate.diff(control.value, 'days') > 0
      return isTooEarly
        ? {
            dateMin: {
              message: `cannot be earlier than ${minDate.format(
                DATE_DISPLAY_FORMAT,
              )}`,
              priority: 3,
            },
          }
        : null
    }
  }

  static readonly dateMax = (maxDate: moment.Moment) => {
    return (control: AbstractControl): CustomValidationErrors | null => {
      if (!control.value || !moment(control.value).isValid()) return null

      const isTooLate = control.value.diff(maxDate, 'days') > 0
      return isTooLate
        ? {
            dateMax: {
              message: `cannot be later than ${maxDate.format(
                DATE_DISPLAY_FORMAT,
              )}`,
              priority: 4,
            },
          }
        : null
    }
  }

  static readonly equalTo = (stringToCompare: string) => {
    return (control: AbstractControl): CustomValidationErrors | null => {
      if (!control.value || !isString(control.value)) return null

      return control.value === stringToCompare
        ? null
        : { equalTo: { message: `should be matched`, priority: 7 } }
    }
  }
}
