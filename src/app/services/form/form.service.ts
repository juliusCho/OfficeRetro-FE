import { Injectable, OnDestroy } from '@angular/core'
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
} from '@angular/forms'
import * as moment from 'moment'
import { BehaviorSubject, Observable, of, Subscription, tap } from 'rxjs'
import {
  isArray,
  isBoolean,
  isDateArray,
  isNumber,
  isString,
  isStringArray,
} from 'src/app/helpers/type-checkers'
import {
  momentToDateRange,
  momentToDateString,
  valueToDateRange,
  valueToDateString,
} from 'src/app/helpers/value-converters'
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
      this.setFormGroupAndSubject(inputInfo, formGroup)
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

  readonly subscribe = () => {
    if (!this._initialized) return
    this._formSubscription$ = this._formValueChanges$.subscribe()
  }

  readonly reinitializeData = () => {
    if (!this._initialized) return

    const formGroup: Record<string, unknown> = {}

    this._inputInfos.forEach((inputInfo) => {
      if (
        inputInfo.inputType === 'date-range' &&
        isDateArray(inputInfo.initValue)
      ) {
        formGroup[`${inputInfo.key}Start`] = inputInfo.initValue[0]
          ? moment(inputInfo.initValue[0])
          : null
        formGroup[`${inputInfo.key}End`] = inputInfo.initValue[1]
          ? moment(inputInfo.initValue[1])
          : null
      } else {
        formGroup[inputInfo.key] = inputInfo.initValue
      }
    })

    this._form.setValue(formGroup)
  }

  private readonly setFormGroupAndSubject = (
    inputInfo: FormInputSpec<unknown>,
    formGroup: Record<string, FormControl>,
  ) => {
    if (
      inputInfo.inputType === 'date-range' &&
      isArray(inputInfo.formValidators) &&
      inputInfo.formValidators.length === 2 &&
      isArray(inputInfo.formValidators[0]) &&
      isArray(inputInfo.formValidators[1]) &&
      isDateArray(inputInfo.initValue)
    ) {
      formGroup[`${inputInfo.key}Start`] = new FormControl(
        inputInfo.initValue[0] ? moment(inputInfo.initValue[0]) : undefined,
        inputInfo.formValidators[0],
      )
      formGroup[`${inputInfo.key}End`] = new FormControl(
        inputInfo.initValue[1] ? moment(inputInfo.initValue[1]) : undefined,
        inputInfo.formValidators[1],
      )

      this._formSubjects[inputInfo.key] = new BehaviorSubject(
        valueToDateRange(inputInfo.initValue) as unknown,
      )
    } else if (inputInfo.inputType === 'date') {
      formGroup[inputInfo.key] = new FormControl(
        inputInfo.initValue ? moment(inputInfo.initValue) : undefined,
        inputInfo.formValidators as ValidatorFn[],
      )

      this._formSubjects[inputInfo.key] = new BehaviorSubject(
        valueToDateString(inputInfo.initValue) as unknown,
      )
    } else if (
      !inputInfo.formValidators ||
      inputInfo.formValidators.length === 0 ||
      !isArray(inputInfo.formValidators[0])
    ) {
      formGroup[inputInfo.key] = new FormControl(
        inputInfo.initValue,
        inputInfo.formValidators as ValidatorFn[],
      )

      this._formSubjects[inputInfo.key] = new BehaviorSubject(
        inputInfo.initValue,
      )
    }
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
          } else if (!formValue && inputInfo.inputType === 'date-range') {
            const startValue = v[`${inputInfo.key}Start`]
            const endValue = v[`${inputInfo.key}End`]
            this._formSubjects[inputInfo.key].next(
              momentToDateRange([startValue, endValue]) as unknown,
            )
          } else if (inputInfo.inputType === 'date') {
            this._formSubjects[inputInfo.key].next(
              momentToDateString(formValue) as unknown,
            )
          }
        })
      }),
    )
  }
}
