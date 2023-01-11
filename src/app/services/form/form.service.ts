import { Injectable, OnDestroy } from '@angular/core'
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
} from '@angular/forms'
import * as moment from 'moment'
import {
  BehaviorSubject,
  Observable,
  of,
  shareReplay,
  Subscription,
  tap,
} from 'rxjs'
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
import { COLOR_PICKER_DEFAULT_COLOR } from 'src/app/models/constants/form-constants'

@Injectable()
export class FormService implements OnDestroy {
  private _initialized = false
  private _form!: FormGroup
  private _formSubjects: { [key: string]: BehaviorSubject<unknown> } = {}
  private _formValueChanges$!: Observable<unknown>
  private _formSubscription$?: Subscription
  private _inputInfos!: FormInputSpec<unknown>[]

  get form() {
    if (!this._initialized)
      return this._formBuilder.group<Record<string, FormControl>>({})
    return this._form as FormGroup<Record<string, FormControl>>
  }

  get formValueChange$() {
    if (!this._initialized) return of()
    return this._formValueChanges$
  }

  set formValueChange$(value: Observable<unknown>) {
    this._formValueChanges$ = value
  }

  constructor(private readonly _formBuilder: FormBuilder) {}

  ngOnDestroy() {
    if (!this._initialized) return

    if (this._formSubscription$) {
      this._formSubscription$.unsubscribe()
      this._formSubscription$.closed = true
    }

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

    this._initialized = true
  }

  readonly bindToValueChanges = () => {
    this._formValueChanges$ = this._form.valueChanges.pipe(
      shareReplay({ bufferSize: 1, refCount: true }),
      tap((v: { [key: string]: unknown }) => {
        this._inputInfos.forEach((inputInfo) => {
          const formValue = v[inputInfo.key]

          switch (inputInfo.inputType) {
            case 'text-color':
              this.bindTextColorToSubject(inputInfo.key, v)
              break
            case 'password-confirm':
              this.bindPasswordConfirmToSubject(inputInfo.key, v)
              break
            case 'date':
              this.bindDateToSubject(inputInfo.key, formValue)
              break
            case 'date-range':
              this.bindDateRangeToSubject(inputInfo.key, v)
              break
            default:
              if (isString(formValue)) {
                this._formSubjects[inputInfo.key].next(String(formValue ?? ''))
              } else if (isNumber(formValue)) {
                this._formSubjects[inputInfo.key].next(Number(formValue ?? 0))
              } else if (isBoolean(formValue)) {
                this._formSubjects[inputInfo.key].next(
                  Boolean(formValue ?? false),
                )
              } else if (isStringArray(formValue)) {
                this._formSubjects[inputInfo.key].next(
                  formValue ? [...formValue] : [],
                )
              }
              break
          }
        })
      }),
    )
  }

  readonly subscribeValueChanges = () => {
    if (!this._initialized) return

    if (this._formSubscription$) {
      this._formSubscription$.unsubscribe()
    }

    this._formSubscription$ = this._formValueChanges$.subscribe()
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
      switch (inputInfo.inputType) {
        case 'text-color':
          this.setInitTextColor(inputInfo, formGroup)
          break
        case 'password-confirm':
          this.setInitPasswordConfirm(inputInfo, formGroup)
          break
        case 'date-range':
          this.setInitDateRange(inputInfo, formGroup)
          break
        default:
          formGroup[inputInfo.key] = inputInfo.initValue ?? null
          break
      }
    })

    this._form.setValue(formGroup)
  }

  private readonly setFormGroupAndSubject = (
    inputInfo: FormInputSpec<unknown>,
    formGroup: Record<string, FormControl>,
  ) => {
    switch (inputInfo.inputType) {
      case 'text-color':
        this.setTextColorToFormAndSubject(inputInfo, formGroup)
        break
      case 'password-confirm':
        this.setPasswordConfirmToFormAndSubject(inputInfo, formGroup)
        break
      case 'date':
        this.setDateToFormAndSubject(inputInfo, formGroup)
        break
      case 'date-range':
        this.setDateRangeToFormAndSubject(inputInfo, formGroup)
        break
      default:
        if (this.isFormValidatorPair(inputInfo.formValidators)) return

        formGroup[inputInfo.key] = new FormControl(
          inputInfo.initValue,
          inputInfo.formValidators as ValidatorFn[],
        )

        this._formSubjects[inputInfo.key] = new BehaviorSubject(
          inputInfo.initValue as unknown,
        )
        break
    }
  }

  private readonly isFormValidatorPair = (
    formValidators?: ValidatorFn[] | [ValidatorFn[], ValidatorFn[]],
  ): formValidators is [ValidatorFn[], ValidatorFn[]] => {
    return (
      !!formValidators &&
      formValidators.length > 0 &&
      isArray(formValidators[0])
    )
  }

  private readonly setTextColorToFormAndSubject = (
    inputInfo: FormInputSpec<unknown>,
    formGroup: Record<string, unknown>,
  ) => {
    if (!isStringArray(inputInfo.initValue) || inputInfo.initValue.length < 2)
      return
    if (this.isFormValidatorPair(inputInfo.formValidators)) return

    formGroup[`${inputInfo.key}Text`] = new FormControl(
      inputInfo.initValue[0] ?? '',
      inputInfo.formValidators,
    )
    formGroup[`${inputInfo.key}Color`] = new FormControl(
      inputInfo.initValue[1] ?? COLOR_PICKER_DEFAULT_COLOR,
    )

    this._formSubjects[inputInfo.key] = new BehaviorSubject(
      inputInfo.initValue as unknown,
    )
  }

  private readonly setPasswordConfirmToFormAndSubject = (
    inputInfo: FormInputSpec<unknown>,
    formGroup: Record<string, unknown>,
  ) => {
    if (!isStringArray(inputInfo.initValue) || inputInfo.initValue.length < 2)
      return
    if (this.isFormValidatorPair(inputInfo.formValidators)) return

    formGroup[inputInfo.key] = new FormControl(
      inputInfo.initValue[0] ?? '',
      inputInfo.formValidators,
    )
    formGroup[`${inputInfo.key}Confirm`] = new FormControl(
      inputInfo.initValue[1] ?? '',
      inputInfo.formValidators,
    )

    this._formSubjects[inputInfo.key] = new BehaviorSubject(
      inputInfo.initValue as unknown,
    )
  }

  private readonly setDateToFormAndSubject = (
    inputInfo: FormInputSpec<unknown>,
    formGroup: Record<string, unknown>,
  ) => {
    if (this.isFormValidatorPair(inputInfo.formValidators)) return

    formGroup[inputInfo.key] = new FormControl(
      inputInfo.initValue ? moment(inputInfo.initValue) : undefined,
      inputInfo.formValidators as ValidatorFn[],
    )

    this._formSubjects[inputInfo.key] = new BehaviorSubject(
      valueToDateString(inputInfo.initValue) as unknown,
    )
  }

  private readonly setDateRangeToFormAndSubject = (
    inputInfo: FormInputSpec<unknown>,
    formGroup: Record<string, unknown>,
  ) => {
    if (!isDateArray(inputInfo.initValue) || inputInfo.initValue.length < 2)
      return

    if (this.isFormValidatorPair(inputInfo.formValidators)) {
      formGroup[`${inputInfo.key}Start`] = new FormControl(
        inputInfo.initValue[0] ? moment(inputInfo.initValue[0]) : undefined,
        inputInfo.formValidators[0],
      )
      formGroup[`${inputInfo.key}End`] = new FormControl(
        inputInfo.initValue[1] ? moment(inputInfo.initValue[1]) : undefined,
        inputInfo.formValidators[1],
      )
    } else {
      formGroup[`${inputInfo.key}Start`] = new FormControl(
        inputInfo.initValue[0] ? moment(inputInfo.initValue[0]) : undefined,
      )
      formGroup[`${inputInfo.key}End`] = new FormControl(
        inputInfo.initValue[1] ? moment(inputInfo.initValue[1]) : undefined,
      )
    }

    this._formSubjects[inputInfo.key] = new BehaviorSubject(
      valueToDateRange(inputInfo.initValue) as unknown,
    )
  }

  private readonly bindTextColorToSubject = (
    key: string,
    form: { [key: string]: unknown },
  ) => {
    const textValue = form[`${key}Text`]
    const colorValue = form[`${key}Color`]

    this._formSubjects[key].next([textValue ?? '', colorValue ?? ''])
  }

  private readonly bindPasswordConfirmToSubject = (
    key: string,
    form: { [key: string]: unknown },
  ) => {
    const password = form[key]
    const passwordConfirm = form[`${key}Confirm`]

    this._formSubjects[key].next([password ?? '', passwordConfirm ?? ''])
  }

  private readonly bindDateToSubject = (key: string, formValue: unknown) => {
    this._formSubjects[key].next(momentToDateString(formValue) as unknown)
  }

  private readonly bindDateRangeToSubject = (
    key: string,
    form: { [key: string]: unknown },
  ) => {
    const startValue = form[`${key}Start`]
    const endValue = form[`${key}End`]

    this._formSubjects[key].next(
      momentToDateRange([startValue, endValue]) as unknown,
    )
  }

  private readonly setInitTextColor = (
    inputInfo: FormInputSpec<unknown>,
    formGroup: Record<string, unknown>,
  ) => {
    if (!isStringArray(inputInfo.initValue) || inputInfo.initValue.length < 2)
      return

    formGroup[`${inputInfo.key}Text`] = inputInfo.initValue[0] ?? ''
    formGroup[`${inputInfo.key}Color`] = inputInfo.initValue[1] ?? ''
  }

  private readonly setInitPasswordConfirm = (
    inputInfo: FormInputSpec<unknown>,
    formGroup: Record<string, unknown>,
  ) => {
    if (!isStringArray(inputInfo.initValue) || inputInfo.initValue.length < 2)
      return

    formGroup[inputInfo.key] = inputInfo.initValue[0] ?? ''
    formGroup[`${inputInfo.key}Confirm`] = inputInfo.initValue[1] ?? ''
  }

  private readonly setInitDateRange = (
    inputInfo: FormInputSpec<unknown>,
    formGroup: Record<string, unknown>,
  ) => {
    if (!isDateArray(inputInfo.initValue) || inputInfo.initValue.length < 2)
      return

    const [start, end] = inputInfo.initValue
    if (!moment(start).isValid() || !moment(end).isValid()) return

    formGroup[`${inputInfo.key}Start`] = start ? moment(start) : null
    formGroup[`${inputInfo.key}End`] = end ? moment(end) : null
  }
}
