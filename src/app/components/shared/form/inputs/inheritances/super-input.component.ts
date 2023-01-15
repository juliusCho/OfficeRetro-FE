import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core'
import { FormGroup } from '@angular/forms'
import * as moment from 'moment'
import { CustomValidator } from 'src/app/helpers/custom-form-validator'
import { isConvertibleToMoment, isNumber } from 'src/app/helpers/type-checkers'
import { InputUnderneathDisplay } from 'src/app/models/client-specs/form/form-input-types'
import { FormInputSpec } from 'src/app/models/client-specs/form/form-spec'
import {
  CssSize,
  FontWeight,
} from 'src/app/models/client-specs/shared/css-specs'
import { CssService } from 'src/app/services/shared/css.service'

@Component({
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuperInputComponent<T> implements OnInit {
  @Input() input!: {
    form: FormGroup
    labelArea?: {
      width?: CssSize
      labelSize?: CssSize
      labelWeight?: FontWeight
    }
    isValidationDisplaying?: boolean // each input's underneath will have blank space for validation message display if true
    formInputSpec: FormInputSpec<T>
    infoTextType?: InputUnderneathDisplay // text display underneath the input
  }

  @Output() enter = new EventEmitter<void>()

  protected isDisabled = false

  get form() {
    return this.input.form
  }
  get formInputSpec() {
    return this.input.formInputSpec
  }
  get name() {
    return this.formInputSpec.key
  }
  get control() {
    return this.form.get(this.name)
  }
  get label() {
    return this.formInputSpec.label
  }
  get min() {
    // for string value's length
    return this.formInputSpec.min ?? '0'
  }
  get max() {
    // for string value's length
    return this.formInputSpec.max ?? '0'
  }
  get maxLength() {
    // for string value's length
    return isNumber(this.max) ? Number(this.max) : -1
  }
  get minDate() {
    return isConvertibleToMoment(this.min) ? moment(this.min) : undefined
  }
  get maxDate() {
    return isConvertibleToMoment(this.max)
      ? moment(this.max).toDate()
      : undefined
  }
  get isValidationDisplaying() {
    return this.input.isValidationDisplaying ?? false
  }
  get infoTextType() {
    return this.input.infoTextType ?? 'none'
  }
  get displayLength() {
    return this.infoTextType === 'all' || this.infoTextType === 'length'
  }
  get displayAlert() {
    return (
      this.isValidationDisplaying &&
      (this.infoTextType === 'all' || this.infoTextType === 'alert')
    )
  }
  get width() {
    return this.formInputSpec.width ?? ''
  }
  get height() {
    return this.formInputSpec.height ?? ''
  }
  get labelAreaWidth() {
    return this.input.labelArea?.width
  }
  get labelStyle() {
    return this.input.labelArea
      ? {
          labelSize: this.input.labelArea?.labelSize,
          labelWeight: this.input.labelArea?.labelWeight,
        }
      : {}
  }
  get placeholder() {
    return this.formInputSpec?.placeholder ?? ''
  }
  get labelPosition() {
    return this.formInputSpec?.labelPosition ?? 'side'
  }
  get containerClass() {
    return { 'label-top': this.labelPosition === 'top' }
  }
  get inputAreaClass() {
    return {
      disabled: this.isDisabled,
      'no-label': !this.label || this.labelPosition === 'top',
    }
  }
  get inputAreaStyle() {
    const areaStyle = { height: this.cssService.getUntypedSize(this.height) }

    if (this.label && this.labelPosition !== 'top') {
      return this.labelAreaWidth
        ? {
            ...areaStyle,
            width: `calc(100% - ${
              this.cssService.getSize(this.labelAreaWidth) ?? '0px'
            })`,
          }
        : {
            ...areaStyle,
            width: '100%',
          }
    }

    return areaStyle
  }

  constructor(
    protected readonly cssService: CssService,
    protected readonly changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    if (this.formInputSpec.disabled) {
      this._setDisabled()
      return
    }

    if (this.max !== '0' && isNumber(this.max)) {
      this._setMaxValidator()
    }

    if (this.min !== '0') {
      this._setMinValidator()
    }

    this._setExtraValidator()

    if (this.formInputSpec.required) {
      this._setRequired()
    }
  }

  protected readonly getControlByName = (name: string) => {
    return this.form.get(name)
  }

  protected readonly onEnter = () => {
    this.enter.emit()
  }

  private readonly _setDisabled = () => {
    switch (this.formInputSpec.inputType) {
      case 'date-range':
        this.getControlByName(`${this.name}Start`)?.disable()
        this.getControlByName(`${this.name}End`)?.disable()
        break
      case 'password-confirm':
        this.control?.disable()
        this.getControlByName(`${this.name}Confirm`)?.disable()
        break
      case 'text-color':
        this.control?.disable()
        this.getControlByName(`${this.name}Color`)?.disable()
        break
      default:
        this.control?.disable()
        break
    }

    this.isDisabled = true

    this.changeDetectorRef.markForCheck()
  }

  private readonly _setRequired = () => {
    switch (this.formInputSpec.inputType) {
      case 'date-range':
        this.getControlByName(`${this.name}Start`)?.addValidators(
          CustomValidator.required,
        )
        this.getControlByName(`${this.name}Start`)?.updateValueAndValidity()
        this.getControlByName(`${this.name}End`)?.addValidators(
          CustomValidator.required,
        )
        this.getControlByName(`${this.name}End`)?.updateValueAndValidity()
        break
      case 'password-confirm':
        this.control?.addValidators(CustomValidator.required)
        this.control?.updateValueAndValidity()
        this.getControlByName(`${this.name}Confirm`)?.addValidators(
          CustomValidator.required,
        )
        this.getControlByName(`${this.name}Confirm`)?.updateValueAndValidity()
        break
      default:
        this.control?.addValidators(CustomValidator.required)
        this.control?.updateValueAndValidity()
        break
    }
  }

  private readonly _setMinValidator = () => {
    if (this.formInputSpec.inputType === 'select') return

    if (isNumber(this.min)) {
      const min = Number(this.min)

      switch (this.formInputSpec.inputType) {
        case 'checkbox':
        case 'list':
          this.control?.addValidators(CustomValidator.listMin(min))
          this.control?.updateValueAndValidity()
          break
        case 'date':
          break
        case 'date-range':
          break
        case 'password-confirm':
          if (this.formInputSpec.required) {
            this.control?.addValidators(CustomValidator.minLength(min))
            this.control?.updateValueAndValidity()
            this.getControlByName(`${this.name}Confirm`)?.addValidators(
              CustomValidator.minLength(min),
            )
            this.getControlByName(
              `${this.name}Confirm`,
            )?.updateValueAndValidity()
          }
          break
        default:
          if (this.formInputSpec.required) {
            this.control?.addValidators(CustomValidator.minLength(min))
            this.control?.updateValueAndValidity()
          }
          break
      }
    } else if (isConvertibleToMoment(this.min)) {
      switch (this.formInputSpec.inputType) {
        case 'date':
          this.control?.addValidators(CustomValidator.dateMin(moment(this.min)))
          this.control?.updateValueAndValidity()
          break
        case 'date-range':
          this.getControlByName(`${this.name}Start`)?.addValidators(
            CustomValidator.dateMin(moment(this.min)),
          )
          this.getControlByName(`${this.name}Start`)?.updateValueAndValidity()
          this.getControlByName(`${this.name}End`)?.addValidators(
            CustomValidator.dateMin(moment(this.min)),
          )
          this.getControlByName(`${this.name}End`)?.updateValueAndValidity()
          break
        default:
          break
      }
    }
  }

  private readonly _setMaxValidator = () => {
    if (this.formInputSpec.inputType === 'select') return

    if (isNumber(this.max)) {
      const max = Number(this.max)

      switch (this.formInputSpec.inputType) {
        case 'checkbox':
        case 'list':
          this.control?.addValidators(CustomValidator.listMax(max))
          this.control?.updateValueAndValidity()
          break
        case 'date':
          break
        case 'date-range':
          break
        case 'password-confirm':
          this.control?.addValidators(CustomValidator.maxLength(max))
          this.control?.updateValueAndValidity()
          this.getControlByName(`${this.name}Confirm`)?.addValidators(
            CustomValidator.maxLength(max),
          )
          this.getControlByName(`${this.name}Confirm`)?.updateValueAndValidity()
          break
        default:
          this.control?.addValidators(CustomValidator.maxLength(max))
          this.control?.updateValueAndValidity()
          break
      }
    } else if (moment(this.max).isValid()) {
      switch (this.formInputSpec.inputType) {
        case 'date':
          this.control?.addValidators(CustomValidator.dateMax(moment(this.max)))
          this.control?.updateValueAndValidity()
          break
        case 'date-range':
          this.getControlByName(`${this.name}Start`)?.addValidators(
            CustomValidator.dateMax(moment(this.max)),
          )
          this.getControlByName(`${this.name}Start`)?.updateValueAndValidity()
          this.getControlByName(`${this.name}End`)?.addValidators(
            CustomValidator.dateMax(moment(this.max)),
          )
          this.getControlByName(`${this.name}End`)?.updateValueAndValidity()
          break
        default:
          break
      }
    }
  }

  private readonly _setExtraValidator = () => {
    switch (this.formInputSpec.inputType) {
      case 'email':
        this.control?.addValidators(CustomValidator.email)
        this.control?.addValidators(CustomValidator.noBlank)
        this.control?.updateValueAndValidity()
        break
      case 'password':
      case 'password-login':
        this.control?.addValidators(CustomValidator.noBlank)
        this.control?.updateValueAndValidity()
        break
      case 'password-confirm':
        this.control?.addValidators(CustomValidator.noBlank)
        this.control?.updateValueAndValidity()
        this.getControlByName(`${this.name}Confirm`)?.addValidators(
          CustomValidator.noBlank,
        )
        this.getControlByName(`${this.name}Confirm`)?.updateValueAndValidity()
        break
      case 'date':
        this.control?.addValidators(CustomValidator.date)
        this.control?.updateValueAndValidity()
        break
      case 'date-range':
        this.getControlByName(`${this.name}Start`)?.addValidators(
          CustomValidator.date,
        )
        this.getControlByName(`${this.name}Start`)?.updateValueAndValidity()
        this.getControlByName(`${this.name}End`)?.addValidators(
          CustomValidator.date,
        )
        this.getControlByName(`${this.name}End`)?.updateValueAndValidity()
        break
      default:
        break
    }
  }
}
