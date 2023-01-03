import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core'
import { FormGroup } from '@angular/forms'
import { AutoUnsubscribe } from 'src/app/decorators/auto-unsubscribe/auto-unsubscribe.decorator'

@AutoUnsubscribe()
@Component({
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuperInputComponent {
  @Input() label?: string
  @Input() name = ''
  @Input() width = ''
  @Input() minLength = 0
  @Input() maxLength = -1 // -1: infinite length
  @Input() isDisabled = false
  @Input() required = false
  @Input() infoTextType: 'none' | 'all' | 'alert' | 'length' = 'none' // text display underneath the input
  @Input() placeholder = ''
  @Input() form?: FormGroup

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

  get formGroup() {
    return this.form as FormGroup
  }

  constructor(protected readonly _changeDetectorRef: ChangeDetectorRef) {}

  protected readonly onFocusOut = () => {
    this.showValidationMessage = true
    this._changeDetectorRef.detectChanges()
  }
}
