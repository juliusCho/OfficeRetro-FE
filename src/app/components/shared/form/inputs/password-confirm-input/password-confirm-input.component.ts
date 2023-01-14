import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { AbstractControl } from '@angular/forms'
import { Observable, of, shareReplay, Subscription, tap } from 'rxjs'
import { AutoUnsubscribe } from 'src/app/decorators/auto-unsubscribe/auto-unsubscribe.decorator'
import { CustomValidator } from 'src/app/helpers/custom-form-validator'
import {
  CustomValidationErrors,
  InputUnderneathDisplay,
} from 'src/app/models/client-specs/form/form-input-types'
import { SuperInputComponent } from '../inheritances/super-input.component'

@AutoUnsubscribe()
@Component({
  selector: 'app-password-confirm-input',
  templateUrl: './password-confirm-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordConfirmInputComponent extends SuperInputComponent<
  [string, string]
> {
  @Input() lengthLabelPosition?: 'left' | 'right' = 'right'

  private _passwordChange$!: Subscription
  private _passwordConfirmChange$!: Subscription
  private _equalToValidator?: (
    control: AbstractControl,
  ) => CustomValidationErrors | null

  get length(): number {
    if (!this.displayLength) return 0

    const passwordLength = this.control?.value.length ?? 0
    const passwordConfirmLength =
      this.getControlByName(`${this.name}Confirm`)?.value.length ?? 0

    return passwordLength > passwordConfirmLength
      ? passwordLength
      : passwordConfirmLength
  }

  get alertableControls(): [AbstractControl | null, AbstractControl | null] {
    return [this.control, this.getControlByName(`${this.name}Confirm`)]
  }

  get confirmLabel() {
    return this.label ? `${this.label} & Confirm` : undefined
  }

  override ngOnInit(): void {
    super.ngOnInit()

    const confirmControl = this.getControlByName(`${this.name}Confirm`)

    this._passwordChange$ = (
      (this.control?.valueChanges ?? of('')) as Observable<string>
    )
      .pipe(
        shareReplay({ bufferSize: 1, refCount: true }),
        tap((v) => {
          if (!this.control || this.control.invalid || !confirmControl) return
          if (!confirmControl.hasError('equalTo')) return

          if (v === confirmControl.value) {
            let { errors } = confirmControl
            if (
              confirmControl.hasError('equalTo') &&
              errors &&
              'equalTo' in errors
            ) {
              delete errors['equalTo']
              confirmControl.setErrors({ ...errors })
            } else {
              confirmControl.setErrors(errors ?? null)
            }

            if (this._equalToValidator) {
              confirmControl.removeValidators(this._equalToValidator)

              this._equalToValidator = undefined

              this.changeDetectorRef.detectChanges()
            }

            confirmControl.updateValueAndValidity({ onlySelf: true })
            this.form.updateValueAndValidity()
          } else if (!confirmControl.hasError('equalTo')) {
            const equalToValidator = CustomValidator.equalTo(v)
            confirmControl.addValidators(equalToValidator)

            confirmControl.updateValueAndValidity({ onlySelf: true })
            this.form.updateValueAndValidity()

            this._equalToValidator = equalToValidator
            this.changeDetectorRef.detectChanges()
          }
        }),
      )
      .subscribe()

    this._passwordConfirmChange$ = (
      (this.getControlByName(`${this.name}Confirm`)?.valueChanges ??
        of('')) as Observable<string>
    )
      .pipe(
        shareReplay({ bufferSize: 1, refCount: true }),
        tap((v) => {
          if (!confirmControl || !this.control || this.control.invalid) return
          if (!confirmControl.hasError('equalTo')) return

          if (v === this.control.value) {
            let { errors } = confirmControl
            if (
              confirmControl.hasError('equalTo') &&
              errors &&
              'equalTo' in errors
            ) {
              delete errors['equalTo']
              confirmControl.setErrors({ ...errors })
            } else {
              confirmControl.setErrors(errors ?? null)
            }

            if (this._equalToValidator) {
              confirmControl.removeValidators(this._equalToValidator)

              this._equalToValidator = undefined

              this.changeDetectorRef.detectChanges()
            }

            confirmControl.updateValueAndValidity({ onlySelf: true })
            this.form.updateValueAndValidity()
          } else if (!confirmControl.hasError('equalTo')) {
            const equalToValidator = CustomValidator.equalTo(this.control.value)
            confirmControl.addValidators(equalToValidator)

            confirmControl.updateValueAndValidity({ onlySelf: true })
            this.form.updateValueAndValidity()

            this._equalToValidator = equalToValidator
            this.changeDetectorRef.detectChanges()
          }
        }),
      )
      .subscribe()

    this.changeDetectorRef.markForCheck()
  }

  readonly getInput = (isPasswordConfirm?: boolean) => {
    return {
      ...this.input,
      formInputSpec: {
        ...this.input.formInputSpec,
        key: isPasswordConfirm ? `${this.name}Confirm` : this.name,
        name: isPasswordConfirm ? `${this.name}Confirm` : this.name,
        label: isPasswordConfirm
          ? this.label
            ? 'Confirm'
            : undefined
          : this.label,
        initValue: this.formInputSpec.initValue[isPasswordConfirm ? 1 : 0],
      },
      infoTextType: 'none' as InputUnderneathDisplay,
      isValidationDisplaying: false,
    }
  }
}
