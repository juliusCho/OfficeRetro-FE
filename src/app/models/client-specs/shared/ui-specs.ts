import { FormInputSpec } from '../form/form-spec'
import { CssSize } from './css-specs'

export type Toast = {
  show: boolean
  type?: 'info' | 'alert'
  message?: string
}

export type ModalConfirm = {
  show: boolean
  message?: string
  buttons?: {
    submit: string
    cancel: string
  }
  onSubmit?: () => void
  width?: CssSize
}

export interface Modal extends Omit<ModalConfirm, 'onSubmit'> {
  type?: 'alert' | 'confirm' | 'form'
  title?: string
  confirmModal?: Omit<ModalConfirm, 'show' | 'onSubmit'>
  formInputSpecs?: FormInputSpec<unknown>[]
  isClearButtonExist?: boolean
  onSubmit?: (formValue?: Record<string, unknown>) => void
}

export interface ModalAlert
  extends Pick<Modal, 'show' | 'message' | 'title' | 'width'> {}

export interface ModalForm extends Omit<Modal, 'type' | 'message'> {}
