import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core'
import { FormGroup } from '@angular/forms'
import { AutoUnsubscribe } from 'src/app/decorators/auto-unsubscribe/auto-unsubscribe.decorator'
import { InputUnderneathDisplay } from 'src/app/models/client-specs/form/form-input-types'

@AutoUnsubscribe()
@Component({
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuperInputComponent {
  @Input() label?: string
  @Input() name!: string
  @Input() width?: string = ''
  @Input() minLength?: number = 0
  @Input() maxLength?: number = -1 // -1: infinite length
  @Input() isDisabled?: boolean = false
  @Input() required?: boolean = false
  @Input() infoTextType?: InputUnderneathDisplay = 'none' // text display underneath the input
  @Input() placeholder?: string = ''
  @Input() labelPosition?: 'side' | 'top' = 'side'
  @Input() form!: FormGroup

  @Input() set showValidationMessage(value: boolean) {
    this._showValidationMessage = value
  }

  private _showValidationMessage = false

  protected validationMessage = ''

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

  constructor(protected readonly _changeDetectorRef: ChangeDetectorRef) {}

  protected readonly onFocusOut = () => {
    this.showValidationMessage = true
    this._changeDetectorRef.detectChanges()
  }
}
