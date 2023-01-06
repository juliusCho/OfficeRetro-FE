import { ValidatorFn } from '@angular/forms'
import { InputType } from './form-input-types'

export interface FormInputSpec<T> {
  key: string
  label?: string
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
  options?: Record<string, string>[]
  optionsFetchUrl?: string
  columnCount?: number
  width?: string
  height?: string
}
