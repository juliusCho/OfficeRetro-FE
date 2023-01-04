import { ValidatorFn } from '@angular/forms'
import { InputType, InputUnderneathDisplay } from './form-input-types'

export interface FormSpec<T> {
  key: string
  label?: string
  labelPosition?: 'side' | 'top'
  initValue: T
  formValidators?: ValidatorFn[]
  validMessageGenerator?: (value?: T) => string
  inputType: InputType
  infoTextType?: InputUnderneathDisplay
  placeholder?: string
  minLength?: number
  maxLength?: number
  required?: boolean
  disabled?: boolean
  options?: Record<string, string>[]
  optionsFetchUrl?: string
  columnCount?: number
  width?: string
  height?: string
}
