import { ValidatorFn } from '@angular/forms'
import { FormInputOption, InputType } from './form-input-types'

export interface FormInputSpec<T> {
  key: string
  label?: string
  /**for ListInputComponent */
  listInputLabel?: string
  labelPosition?: 'side' | 'top'
  initValue: T
  formValidators?: ValidatorFn[] | [ValidatorFn[], ValidatorFn[]]
  inputType: InputType
  placeholder?: string
  min?: string
  /**-1: infinite length */
  max?: string
  required?: boolean
  disabled?: boolean
  options?: FormInputOption[]
  optionsFetchUrl?: string
  columnCount?: number
  width?: string
  height?: string
}
