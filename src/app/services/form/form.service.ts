import { Injectable, OnDestroy } from '@angular/core'
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
} from '@angular/forms'
import * as moment from 'moment'
import { Observable, of, shareReplay, Subscription } from 'rxjs'
import {
  isArray,
  isDateArray,
  isStringArray,
} from 'src/app/helpers/type-checkers'
import { FormInputSpec } from 'src/app/models/client-specs/form/form-spec'
import { COLOR_PICKER_DEFAULT_COLOR } from 'src/app/models/constants/form-constants'

@Injectable()
export class FormService implements OnDestroy {
  private _initialized = false
  private _form!: FormGroup
  private _formValueChanges$!: Observable<unknown>
  private _formValueChangeSubscription$?: Subscription
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

  ngOnDestroy(): void {
    this._formValueChangeSubscription$?.unsubscribe()
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
      this._setFormGroup(inputInfo, formGroup)
    })

    this._form = this._formBuilder.group(formGroup)
    this._formValueChanges$ = this._form.valueChanges.pipe(
      shareReplay({ bufferSize: 1, refCount: true }),
    )

    this._initialized = true
  }

  readonly subscribeValueChange = () => {
    this.ngOnDestroy()

    this._formValueChangeSubscription$ = this._formValueChanges$.subscribe()
  }

  readonly reinitializeData = () => {
    if (!this._initialized) return

    const formValue: Record<string, unknown> = {}

    this._inputInfos.forEach((inputInfo) => {
      switch (inputInfo.inputType) {
        case 'text-color':
          this._setInitPair(inputInfo.inputType, inputInfo, formValue)
          break
        case 'password-confirm':
          this._setInitPair(inputInfo.inputType, inputInfo, formValue)
          break
        case 'date-range':
          this._setInitDateRange(inputInfo, formValue)
          break
        default:
          formValue[inputInfo.key] = inputInfo.initValue ?? null
          break
      }
    })

    this._form.setValue(formValue)
    this._form.markAsPristine()
  }

  readonly getFormValue$ = <T>(key: string) => {
    return this._form.get(key) as FormControl<T>
  }

  private readonly _setFormGroup = (
    inputInfo: FormInputSpec<unknown>,
    formGroup: Record<string, FormControl>,
  ) => {
    switch (inputInfo.inputType) {
      case 'text-color':
        this._setPairToFormControl(inputInfo.inputType, inputInfo, formGroup)
        break
      case 'password-confirm':
        this._setPairToFormControl(inputInfo.inputType, inputInfo, formGroup)
        break
      case 'date':
        this._setDateToFormControl(inputInfo, formGroup)
        break
      case 'date-range':
        this._setDateRangeToFormControl(inputInfo, formGroup)
        break
      default:
        if (this._isFormValidatorPair(inputInfo.formValidators)) return

        formGroup[inputInfo.key] = new FormControl(
          inputInfo.initValue,
          inputInfo.formValidators,
        )
        break
    }
  }

  private readonly _isFormValidatorPair = (
    formValidators?: ValidatorFn[] | [ValidatorFn[], ValidatorFn[]],
  ): formValidators is [ValidatorFn[], ValidatorFn[]] => {
    return (
      !!formValidators &&
      formValidators.length > 0 &&
      isArray(formValidators[0])
    )
  }

  private readonly _setPairToFormControl = (
    type: 'text-color' | 'password-confirm',
    inputInfo: FormInputSpec<unknown>,
    formGroup: Record<string, unknown>,
  ) => {
    if (!isStringArray(inputInfo.initValue) || inputInfo.initValue.length < 2)
      return
    if (this._isFormValidatorPair(inputInfo.formValidators)) return

    formGroup[inputInfo.key] = new FormControl(
      inputInfo.initValue[0] ?? '',
      inputInfo.formValidators,
    )

    if (type === 'text-color') {
      formGroup[`${inputInfo.key}Color`] = new FormControl(
        inputInfo.initValue[1] ?? COLOR_PICKER_DEFAULT_COLOR,
      )
      return
    }

    formGroup[`${inputInfo.key}Confirm`] = new FormControl(
      inputInfo.initValue[1] ?? '',
      inputInfo.formValidators,
    )
  }

  private readonly _setDateToFormControl = (
    inputInfo: FormInputSpec<unknown>,
    formGroup: Record<string, unknown>,
  ) => {
    if (this._isFormValidatorPair(inputInfo.formValidators)) return

    formGroup[inputInfo.key] = new FormControl(
      inputInfo.initValue ? moment(inputInfo.initValue) : undefined,
      inputInfo.formValidators,
    )
  }

  private readonly _setDateRangeToFormControl = (
    inputInfo: FormInputSpec<unknown>,
    formGroup: Record<string, unknown>,
  ) => {
    if (!isDateArray(inputInfo.initValue) || inputInfo.initValue.length < 2)
      return

    if (this._isFormValidatorPair(inputInfo.formValidators)) {
      formGroup[`${inputInfo.key}Start`] = new FormControl(
        inputInfo.initValue[0] ? moment(inputInfo.initValue[0]) : undefined,
        inputInfo.formValidators[0],
      )
      formGroup[`${inputInfo.key}End`] = new FormControl(
        inputInfo.initValue[1] ? moment(inputInfo.initValue[1]) : undefined,
        inputInfo.formValidators[1],
      )
      return
    }

    formGroup[`${inputInfo.key}Start`] = new FormControl(
      inputInfo.initValue[0] ? moment(inputInfo.initValue[0]) : undefined,
    )
    formGroup[`${inputInfo.key}End`] = new FormControl(
      inputInfo.initValue[1] ? moment(inputInfo.initValue[1]) : undefined,
    )
  }

  private readonly _setInitPair = (
    type: 'text-color' | 'password-confirm',
    inputInfo: FormInputSpec<unknown>,
    formGroup: Record<string, unknown>,
  ) => {
    if (!isStringArray(inputInfo.initValue) || inputInfo.initValue.length < 2)
      return

    formGroup[inputInfo.key] = inputInfo.initValue[0] ?? ''
    formGroup[
      `${inputInfo.key}${type === 'text-color' ? 'Color' : 'Confirm'}`
    ] = inputInfo.initValue[1] ?? ''
  }

  private readonly _setInitDateRange = (
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
