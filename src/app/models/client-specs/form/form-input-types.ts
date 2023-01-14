import { ValidationErrors } from '@angular/forms'

export type InputType =
  | 'text'
  | 'text-color'
  | 'email'
  | 'password'
  | 'password-login' // password input with reset page routing
  | 'password-confirm' // password input with confirm input
  | 'textarea'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'date'
  | 'date-range'
  | 'list'

export type InputUnderneathDisplay = 'none' | 'all' | 'alert' | 'length'

export type FormInputOption = {
  value: string
  label: string
  color?: string
  order?: number
}

export interface FormListInputOption extends Required<FormInputOption> {}

export interface CustomValidationErrors extends ValidationErrors {
  [key: string]: { message: string; priority: number }
}
