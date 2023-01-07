import { AbstractControl, ValidatorFn } from '@angular/forms'
import * as moment from 'moment'

export const forbiddenStringValidator = (stringRe: RegExp): ValidatorFn => {
  return (
    control: AbstractControl,
  ): { [key: string]: { value: string } } | null => {
    const forbidden = stringRe.test(control.value)
    return forbidden ? { forbiddenString: { value: control.value } } : null
  }
}

export const listMinimumSelectValidator = (
  minimumCount: number,
): ValidatorFn => {
  return (
    control: AbstractControl,
  ): { [key: string]: { value: string[] } } | null => {
    const forbidden = control.value.length < minimumCount
    return forbidden ? { forbiddenString: { value: control.value } } : null
  }
}

export const listMaximumSelectValidator = (
  maximumCount: number,
): ValidatorFn => {
  return (
    control: AbstractControl,
  ): { [key: string]: { value: string[] } } | null => {
    const forbidden = control.value.length > maximumCount
    return forbidden ? { forbiddenString: { value: control.value } } : null
  }
}

export const dateMinimumValidator = (minDate: moment.Moment): ValidatorFn => {
  return (
    control: AbstractControl,
  ): { [key: string]: { value?: moment.Moment } } | null => {
    if (!control.value) return null
    const forbidden = minDate.diff(control.value, 'days') > 0
    return forbidden ? { forbiddenString: { value: control.value } } : null
  }
}

export const dateMaximumValidator = (maxDate: moment.Moment): ValidatorFn => {
  return (
    control: AbstractControl,
  ): { [key: string]: { value?: moment.Moment } } | null => {
    if (!control.value) return null
    const forbidden = control.value.diff(maxDate, 'days') > 0
    return forbidden ? { forbiddenString: { value: control.value } } : null
  }
}
