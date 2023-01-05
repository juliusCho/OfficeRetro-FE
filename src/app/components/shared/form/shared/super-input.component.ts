import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core'
import { FormGroup } from '@angular/forms'
import { AutoUnsubscribe } from 'src/app/decorators/auto-unsubscribe/auto-unsubscribe.decorator'
import { FormInputSpec } from 'src/app/models/client-specs/form/form-spec'

@AutoUnsubscribe()
@Component({
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuperInputComponent<T> {
  @Input() form!: FormGroup
  @Input() labelWidth?: string
  @Input() isValidationNeeded?: boolean = false // each input's underneath will have blank space for validation message display if true
  @Input() formInputSpec!: FormInputSpec<T>

  @Input() set showValidationMessage(value: boolean) {
    this._showValidationMessage = value
  }

  private _showValidationMessage = false
  private _maxLength?: number

  protected validationMessage = ''

  get label() {
    return this.formInputSpec?.label
  }
  get name() {
    return this.formInputSpec?.key
  }
  get width() {
    return this.formInputSpec?.width ?? ''
  }
  get minLength() {
    return this.formInputSpec?.minLength ?? 0
  }
  get maxLength() {
    return this._maxLength ?? this.formInputSpec?.maxLength ?? 0
  }
  set maxLength(value: number) {
    this._maxLength = value
  }
  get isDisabled() {
    return this.formInputSpec?.disabled ?? false
  }
  get required() {
    return this.formInputSpec?.required ?? false
  }
  get infoTextType() {
    return this.formInputSpec?.infoTextType ?? 'none'
  }
  get placeholder() {
    return this.formInputSpec?.placeholder ?? ''
  }
  get labelPosition() {
    return this.formInputSpec?.labelPosition ?? 'side'
  }

  get showValidationMessage() {
    return this._showValidationMessage
  }

  get displayLength() {
    return this.infoTextType === 'all' || this.infoTextType === 'length'
  }

  get displayAlert() {
    return this.infoTextType === 'all' || this.infoTextType === 'alert'
  }

  get alertMessage() {
    return this._showValidationMessage ? this.validationMessage : ''
  }

  get inputAreaClass() {
    return {
      disabled: this.isDisabled,
      'no-label': !this.label || this.labelPosition === 'top',
    }
  }

  get inputAreaStyle() {
    if (this.label && this.labelPosition !== 'top' && this.labelWidth) {
      return { width: `calc(100% - ${this.labelWidth})` }
    }

    return {}
  }

  constructor(protected readonly _changeDetectorRef: ChangeDetectorRef) {}

  protected readonly onFocusOut = () => {
    this.showValidationMessage = true
    this._changeDetectorRef.detectChanges()
  }
}
