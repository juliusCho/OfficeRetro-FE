import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core'
import { FormGroup } from '@angular/forms'
import { BehaviorSubject } from 'rxjs'
import { AutoUnsubscribe } from 'src/app/decorators/auto-unsubscribe/auto-unsubscribe.decorator'
import { isNumber } from 'src/app/helpers/type-checkers'
import { InputUnderneathDisplay } from 'src/app/models/client-specs/form/form-input-types'
import { FormInputSpec } from 'src/app/models/client-specs/form/form-spec'
import {
  CssSize,
  FontWeight,
} from 'src/app/models/client-specs/shared/css-specs'
import { CssService } from 'src/app/services/shared/css.service'

@AutoUnsubscribe()
@Component({
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuperInputComponent<T> {
  @Input() form!: FormGroup
  @Input() valueChange$!: BehaviorSubject<T>
  @Input() labelAreaWidth?: CssSize
  @Input() labelStyle?: { labelSize?: CssSize; labelWeight?: FontWeight }
  @Input() isValidationNeeded?: boolean = false // each input's underneath will have blank space for validation message display if true
  @Input() formInputSpec!: FormInputSpec<T>
  @Input() infoTextType?: InputUnderneathDisplay = 'none' // text display underneath the input

  @Input() set showValidationMessage(value: boolean) {
    this._showValidationMessage = value
  }

  private _showValidationMessage = false
  private _max?: string

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
  get height() {
    return this.formInputSpec?.height ?? ''
  }
  get min() {
    return this.formInputSpec?.min ?? '0'
  }
  get max() {
    return this._max ?? this.formInputSpec?.max ?? '0'
  }
  set max(value: string) {
    this._max = value
    this.changeDetectorRef.markForCheck()
  }
  get maxLength() {
    return isNumber(this.max) ? Number(this.max) : -1
  }
  get isDisabled() {
    return this.formInputSpec?.disabled ?? false
  }
  get required() {
    return this.formInputSpec?.required ?? false
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
    return (
      this.isValidationNeeded &&
      (this.infoTextType === 'all' || this.infoTextType === 'alert')
    )
  }

  get alertMessage() {
    return this._showValidationMessage ? this.validationMessage : ''
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

  protected readonly onFocusOut = () => {
    if (!this.isValidationNeeded) return

    this.showValidationMessage = true
    this.changeDetectorRef.markForCheck()
  }
}
