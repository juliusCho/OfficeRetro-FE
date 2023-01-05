import { Injectable, OnDestroy } from '@angular/core'
import { FormBuilder, FormControl, FormGroup } from '@angular/forms'
import { BehaviorSubject, Observable, of, Subscription, tap } from 'rxjs'
import {
  isBoolean,
  isNumber,
  isString,
  isStringArray,
} from 'src/app/helpers/type-checkers'
import { FormInputSpec } from 'src/app/models/client-specs/form/form-spec'

@Injectable()
export class FormService implements OnDestroy {
  private _initialized = false
  private _form!: FormGroup
  private _formSubjects: { [key: string]: BehaviorSubject<unknown> } = {}
  private _formValueChanges$!: Observable<unknown>
  private _formSubscription$!: Subscription
  private _inputInfos!: FormInputSpec<unknown>[]

  get form() {
    if (!this._initialized)
      return this._formBuilder.group<Record<string, FormControl>>({})
    return this._form as FormGroup<Record<string, FormControl>>
  }

  get formValueChange() {
    if (!this._initialized) return of()
    return this._formValueChanges$
  }

  constructor(private readonly _formBuilder: FormBuilder) {}

  ngOnDestroy() {
    if (!this._initialized) return

    this._formSubscription$.unsubscribe()
    this._formSubscription$.closed = true

    Object.values(this._formSubjects).forEach((subject) => {
      subject.unsubscribe()
      subject.closed = true
    })
  }

  readonly initialize = (
    inputInfos: Array<
      FormInputSpec<unknown> | [FormInputSpec<unknown>, FormInputSpec<unknown>]
    >,
  ) => {
    if (this._initialized) return

    this._inputInfos = inputInfos.flat()

    const formGroup: Record<string, FormControl> = {}

    this._inputInfos.forEach((inputInfo) => {
      formGroup[inputInfo.key] = new FormControl(
        inputInfo.initValue,
        inputInfo.formValidators,
      )
      this._formSubjects[inputInfo.key] = new BehaviorSubject(
        inputInfo.initValue,
      )
    })

    this._form = this._formBuilder.group(formGroup)

    this.bindToValueChanges()

    this._initialized = true
  }

  readonly getValueObservable = (key: string): BehaviorSubject<any> => {
    if (!this._initialized) {
      return new BehaviorSubject(null)
    }

    return this._formSubjects[key]
  }

  readonly reinitializeData = () => {
    if (!this._initialized) return

    const formGroup: Record<string, unknown> = {}

    this._inputInfos.forEach((inputInfo) => {
      formGroup[inputInfo.key] = inputInfo.initValue
    })

    this._form.setValue(formGroup)
  }

  readonly subscribe = () => {
    if (!this._initialized) return
    this._formSubscription$ = this._formValueChanges$.subscribe()
  }

  private readonly bindToValueChanges = () => {
    this._formValueChanges$ = this._form.valueChanges.pipe(
      tap((v: { [key: string]: unknown }) => {
        this._inputInfos.forEach((inputInfo) => {
          const formValue = v[inputInfo.key]
          if (isString(formValue)) {
            this._formSubjects[inputInfo.key].next(String(formValue ?? ''))
          } else if (isNumber(formValue)) {
            this._formSubjects[inputInfo.key].next(Number(formValue ?? 0))
          } else if (isBoolean(formValue)) {
            this._formSubjects[inputInfo.key].next(Boolean(formValue ?? false))
          } else if (isStringArray(formValue)) {
            this._formSubjects[inputInfo.key].next(
              formValue ? [...formValue] : [],
            )
          }
        })
      }),
    )
  }
}
