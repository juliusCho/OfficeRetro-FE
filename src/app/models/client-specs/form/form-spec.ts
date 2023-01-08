import { ValidatorFn } from '@angular/forms'
import { FormInputOption, InputType } from './form-input-types'

export interface FormInputSpec<T> {
  key: string
  label?: string
  listInputLabel?: string // for ListInputComponent
  labelPosition?: 'side' | 'top'
  initValue: T
  formValidators?: ValidatorFn[] | [ValidatorFn[], ValidatorFn[]]
  validMessageGenerator?: (value?: T) => string
  inputType: InputType
  placeholder?: string
  min?: string
  max?: string // -1: infinite length
  required?: boolean
  disabled?: boolean
  options?: FormInputOption[]
  optionsFetchUrl?: string
  columnCount?: number
  width?: string
  height?: string
}
