import { Injectable } from '@angular/core'
import { BehaviorSubject, shareReplay } from 'rxjs'
import { FormInputSpec } from 'src/app/models/client-specs/form/form-spec'
import { CssSize } from 'src/app/models/client-specs/shared/css-specs'
import {
  Modal,
  ModalAlert,
  ModalConfirm,
  ModalForm,
  TopAlert,
} from 'src/app/models/client-specs/shared/ui-specs'

type ModalAlertInput = Omit<Required<ModalAlert>, 'width'> & {
  width?: CssSize
}
type ModalConfirmInput = Omit<Required<ModalConfirm>, 'width'> & {
  width?: CssSize
}
type ModalFormInput = Omit<
  Required<ModalForm>,
  'title' | 'width' | 'confirmModal' | 'isClearButtonExist'
> & {
  title?: string
  width?: CssSize
  confirmModal?: Omit<ModalConfirm, 'show' | 'onSubmit'>
  formInputSpecs?: FormInputSpec<unknown>[]
  isClearButtonExist?: boolean
}

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  private _isLoading$ = new BehaviorSubject(false)
  private _topAlert$ = new BehaviorSubject<TopAlert>({ show: false })
  private _modal$ = new BehaviorSubject<Modal>({ show: false })

  get isLoading$() {
    return this._getObservable(this._isLoading$)
  }

  get isLoading() {
    return this._isLoading$.value
  }

  set isLoading(value: boolean) {
    this._isLoading$.next(value)
  }

  get topAlert$() {
    return this._getObservable(this._topAlert$)
  }

  get topAlert() {
    return this._topAlert$.value
  }

  set topAlert(value: TopAlert) {
    this._topAlert$.next(value)
  }

  get modal$() {
    return this._getObservable(this._modal$)
  }

  get modal() {
    return this._modal$.value
  }

  set alertModal(value: ModalAlertInput) {
    this._modal$.next({ ...value, type: 'alert' })
  }

  set confirmModal(value: ModalConfirmInput) {
    this._modal$.next({ ...value, type: 'confirm' })
  }

  set formModal(value: ModalFormInput) {
    this._modal$.next({ ...value, type: 'form' })
  }

  private readonly _getObservable = <T>(subject$: BehaviorSubject<T>) => {
    return subject$
      .asObservable()
      .pipe(shareReplay({ bufferSize: 1, refCount: true }))
  }
}
