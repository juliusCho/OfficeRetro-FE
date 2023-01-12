import { Injectable } from '@angular/core'
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
} from '@angular/forms'
import * as moment from 'moment'
import { Observable, of } from 'rxjs'
import {
  isArray,
  isDateArray,
  isStringArray,
} from 'src/app/helpers/type-checkers'
import { FormInputSpec } from 'src/app/models/client-specs/form/form-spec'
import { COLOR_PICKER_DEFAULT_COLOR } from 'src/app/models/constants/form-constants'

@Injectable()
export class FormService {
  private _initialized = false
  private _form!: FormGroup
  private _formValueChanges$!: Observable<unknown>
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
    this._formValueChanges$ = this._form.valueChanges

    this._initialized = true
  }

  readonly reinitializeData = () => {
    if (!this._initialized) return

    const formGroup: Record<string, unknown> = {}

    this._inputInfos.forEach((inputInfo) => {
      switch (inputInfo.inputType) {
        case 'text-color':
          this.setInitPair(inputInfo.inputType, inputInfo, formGroup)
          break
        case 'password-confirm':
          this.setInitPair(inputInfo.inputType, inputInfo, formGroup)
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

  readonly getFormValue$ = <T>(key: string) => {
    return this._form.get(key) as FormControl<T>
  }

  private readonly setFormGroupAndSubject = (
    inputInfo: FormInputSpec<unknown>,
    formGroup: Record<string, FormControl>,
  ) => {
    switch (inputInfo.inputType) {
      case 'text-color':
        this.setPairToFormAndSubject(inputInfo.inputType, inputInfo, formGroup)
        break
      case 'password-confirm':
        this.setPairToFormAndSubject(inputInfo.inputType, inputInfo, formGroup)
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

  private readonly setPairToFormAndSubject = (
    type: 'text-color' | 'password-confirm',
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

  private readonly setDateToFormAndSubject = (
    inputInfo: FormInputSpec<unknown>,
    formGroup: Record<string, unknown>,
  ) => {
    if (this.isFormValidatorPair(inputInfo.formValidators)) return

    formGroup[inputInfo.key] = new FormControl(
      inputInfo.initValue ? moment(inputInfo.initValue) : undefined,
      inputInfo.formValidators as ValidatorFn[],
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
      return
    }

    formGroup[`${inputInfo.key}Start`] = new FormControl(
      inputInfo.initValue[0] ? moment(inputInfo.initValue[0]) : undefined,
    )
    formGroup[`${inputInfo.key}End`] = new FormControl(
      inputInfo.initValue[1] ? moment(inputInfo.initValue[1]) : undefined,
    )
  }

  private readonly setInitPair = (
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
