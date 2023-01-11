import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core'
import { BehaviorSubject, Subscription, tap } from 'rxjs'
import { getBasicPasswordConfirmValidationMsg } from 'src/app/helpers/input-valid-msg-generators'
import { FormInputSpec } from 'src/app/models/client-specs/form/form-spec'
import { SuperInputComponent } from '../inheritances/super-input.component'

@Component({
  selector: 'app-password-confirm-input',
  templateUrl: './password-confirm-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordConfirmInputComponent
  extends SuperInputComponent<[string, string]>
  implements AfterContentInit
{
  @Input() lengthLabelPosition?: 'left' | 'right' = 'right'

  @Output() enter = new EventEmitter<void>()

  passwordChange$ = new BehaviorSubject<string>('')
  passwordConfirmChange$ = new BehaviorSubject<string>('')

  private _valueChangeSubscription$!: Subscription

  ngAfterContentInit(): void {
    if (this.isDisabled) {
      this.form?.get(this.name)?.disable()
      return
    }

    this._valueChangeSubscription$ = this.valueChange$
      .pipe(
        tap((v) => {
          this.passwordChange$.next(v[0])
          this.passwordConfirmChange$.next(v[1])

          this.setFormValidator(v)
        }),
      )
      .subscribe()

    this.changeDetectorRef.detectChanges()
  }

  readonly getInputSpec = (isPasswordConfirm?: boolean) => {
    return {
      ...this.formInputSpec,
      key: isPasswordConfirm ? `${this.name}Confirm` : this.name,
      label: isPasswordConfirm ? 'Confirm' : 'Password',
      validMessageGenerator: isPasswordConfirm ? this.validate() : undefined,
      required: true,
    } as unknown as FormInputSpec<string>
  }

  readonly onEnter = () => {
    this.enter.emit()
  }

  private readonly validate = () => {
    if (this.isDisabled || !this.isValidationNeeded) return

    const _this = this

    return (value?: string) => {
      const result = _this.formInputSpec.validMessageGenerator
        ? _this.formInputSpec.validMessageGenerator([
            _this.passwordChange$.value,
            value ?? '',
          ])
        : ''
      if (result !== '') return result

      return getBasicPasswordConfirmValidationMsg({
        password: _this.passwordChange$.value,
        passwordConfirm: value,
        min: _this.min,
        max: _this.max,
      })
    }
  }

  private readonly setFormValidator = (value: [string, string]) => {
    if (value[0] !== value[1]) {
      this.form?.get(this.name)?.setErrors({ incorrect: true })
      this.form?.get(`${this.name}Confirm`)?.setErrors({ incorrect: true })
    } else if (!this.validationMessage) {
      this.form?.get(this.name)?.setErrors(null)
      this.form?.get(`${this.name}Confirm`)?.setErrors(null)
    }

    this.changeDetectorRef.detectChanges()
  }
}
