export type InputType =
  | 'text'
  | 'text-color'
  | 'email'
  | 'password'
  | 'password-login'
  | 'password-confirm'
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
