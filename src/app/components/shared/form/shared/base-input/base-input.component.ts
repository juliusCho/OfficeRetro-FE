import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core'
import { BehaviorSubject, Observable, Subscription, tap } from 'rxjs'
import { AutoUnsubscribe } from 'src/app/decorators/auto-unsubscribe/auto-unsubscribe.decorator'
import { SuperInputComponent } from '../super-input.component'

@AutoUnsubscribe()
@Component({
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseInputComponent
  extends SuperInputComponent
  implements OnInit, AfterViewInit
{
  @Input() formChange$?: BehaviorSubject<string> // form.valueChange observable
  @Input() validator?: (value?: string) => string // fn for validate value & get invalid message

  protected _formChangeSubscription$?: Subscription
  protected _formChangeObservable$?: Observable<string>

  ngOnInit(): void {
    if (this.isDisabled) {
      this.form?.get(this.name)?.disable()
      return
    }

    this.form?.get(this.name)?.enable()

    this._formChangeObservable$ = this.formChange$?.pipe(
      tap((v) => {
        this.showValidationMessage = false
        this.validationMessage = this.validate(v)
        this._changeDetectorRef.markForCheck()
      }),
    )
  }

  ngAfterViewInit(): void {
    this._formChangeSubscription$ = this._formChangeObservable$?.subscribe()
  }

  private readonly validate = (value?: string) => {
    if (this.isDisabled) return ''

    const result = this.validator ? this.validator(value) : ''
    if (result !== '') return result

    if (!value) {
      if (this.required) {
        return `${this.label} is a required field`
      }

      if (this.minLength > 0) {
        return `${this.label} must contain at least\n${this.minLength} character(s)`
      }

      return ''
    }

    if (this.maxLength === -1) {
      if (this.minLength > 0 && this.minLength > value.length) {
        return `${this.label} should contain\n less than ${this.minLength} character(s)`
      }

      return ''
    }

    if (this.minLength > 0) {
      if (this.minLength > value.length || value.length > this.maxLength) {
        return `${this.label} should contain\n${this.minLength}-${this.maxLength} characters`
      }

      return ''
    }

    if (value.length > this.maxLength) {
      return `${this.label} should not contain\n more than ${this.maxLength} character(s)`
    }

    return ''
  }
}
