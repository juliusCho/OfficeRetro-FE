import { ValidatorFn } from '@angular/forms'
import { InputType, InputUnderneathDisplay } from './form-input-types'

export interface FormInputSpec<T> {
  key: string
  label?: string
  labelPosition?: 'side' | 'top'
  initValue: T
  formValidators?: ValidatorFn[]
  validMessageGenerator?: (value?: T) => string
  inputType: InputType
  infoTextType?: InputUnderneathDisplay // text display underneath the input
  placeholder?: string
  minLength?: number
  maxLength?: number // -1: infinite length
  required?: boolean
  disabled?: boolean
  options?: Record<string, string>[]
  optionsFetchUrl?: string
  columnCount?: number
  width?: string
  height?: string
}
