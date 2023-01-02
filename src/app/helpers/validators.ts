import { AbstractControl, ValidatorFn } from '@angular/forms'

export const forbiddenStringValidator = (stringRe: RegExp): ValidatorFn => {
  return (
    control: AbstractControl,
  ): { [key: string]: { value: string } } | null => {
    const forbidden = stringRe.test(control.value)
    return forbidden ? { forbiddenString: { value: control.value } } : null
  }
}
