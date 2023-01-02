import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core'
import { FormGroup } from '@angular/forms'
import { BehaviorSubject, tap } from 'rxjs'
import { AutoUnsubscribe } from 'src/app/decorators/auto-unsubscribe/auto-unsubscribe.decorator'

@AutoUnsubscribe()
@Component({
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseInputComponent implements OnInit {
  @Input() label?: string
  @Input() name = ''
  @Input() width = ''
  @Input() minLength = 0
  @Input() maxLength = 50
  @Input() isDisabled = false
  @Input() required = false
  @Input() infoTextType: 'none' | 'all' | 'alert' | 'length' = 'none'
  @Input() form: FormGroup = new FormGroup({})
  @Input() formChange$ = new BehaviorSubject<string>('')
  @Input() validator?: (value?: string) => string
  @Input() placeholder = ''

  @Input() set showValidationMessage(value: boolean) {
    this._showValidationMessage = value
  }

  protected _showValidationMessage = false

  validationMessage = ''

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

  ngOnInit(): void {
    if (this.isDisabled) {
      this.form.get(this.name)?.disable()
      return
    }

    this.form.get(this.name)?.enable()

    this.formChange$
      .pipe(
        tap((v) => {
          this._showValidationMessage = false
          this.validationMessage = this.validate(v)
          this._changeDetectorRef.markForCheck()
        }),
      )
      .subscribe()
  }

  readonly onFocusOut = () => {
    this._showValidationMessage = true
    this._changeDetectorRef.detectChanges()
  }

  private readonly validate = (value?: string) => {
    const result = this.validator ? this.validator(value) : ''

    if (result !== '') return result

    if (!value) {
      if (this.required) {
        return `${this.label} must be filled in`
      }

      if (this.minLength > 0) {
        return `${this.label} must contain at least ${this.minLength} of characters`
      }

      return ''
    }

    if (this.minLength > value.length || value.length > this.maxLength) {
      return `${this.label} should contain ${this.minLength}-${this.maxLength} of characters`
    }

    return ''
  }
}
