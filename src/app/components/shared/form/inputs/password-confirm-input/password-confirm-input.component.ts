import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { AbstractControl, ValidatorFn } from '@angular/forms'
import { Observable, of, shareReplay, Subscription, tap } from 'rxjs'
import { AutoUnsubscribe } from 'src/app/decorators/auto-unsubscribe/auto-unsubscribe.decorator'
import { CustomValidator } from 'src/app/helpers/custom-form-validator'
import { isArray, isNumber } from 'src/app/helpers/type-checkers'
import { InputUnderneathDisplay } from 'src/app/models/client-specs/form/form-input-types'
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

  get _passwordValidators() {
    if (this.isDisabled) return []

    let preset = [CustomValidator.noBlank]

    if (this.max !== '0' && isNumber(this.max)) {
      preset.unshift(CustomValidator.maxLength(Number(this.max)))
    }

    if (this.formInputSpec.required) {
      if (this.min !== '0' && isNumber(this.min)) {
        preset.unshift(CustomValidator.minLength(Number(this.min)))
      }

      preset.push(CustomValidator.required)
    }

    const formValidators = this.formInputSpec.formValidators
    if (
      formValidators &&
      isArray(formValidators) &&
      formValidators.length > 0
    ) {
      if (isArray(formValidators[0])) {
        preset = [...preset, ...formValidators[0]]
      } else {
        preset = [...preset, ...(formValidators as ValidatorFn[])]
      }
    }

    return preset
  }

  override ngOnInit(): void {
    super.ngOnInit()

    const controlObservable$ = (this.control?.valueChanges ??
      of('')) as Observable<string>

    const confirmControlObservable$ = (this.getControlByName(
      `${this.name}Confirm`,
    )?.valueChanges ?? of('')) as Observable<string>

    this._passwordChange$ = controlObservable$
      .pipe(
        shareReplay({ bufferSize: 1, refCount: true }),
        tap(this._setDynamicEqualToValidator),
      )
      .subscribe()

    this._passwordConfirmChange$ = confirmControlObservable$
      .pipe(
        shareReplay({ bufferSize: 1, refCount: true }),
        tap((_) => this._setDynamicEqualToValidator(this.control?.value ?? '')),
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

  private readonly _setDynamicEqualToValidator = (targetValue: string) => {
    const confirmControl = this.getControlByName(`${this.name}Confirm`)

    if (!this.control || this.control.invalid || !confirmControl) return
    if (confirmControl.invalid && !confirmControl.hasError('equalTo')) return

    if (targetValue === confirmControl.value) {
      let { errors } = confirmControl

      if (
        !errors ||
        !confirmControl.hasError('equalTo') ||
        !('equalTo' in errors)
      ) {
        return
      }

      delete errors['equalTo']

      confirmControl.setErrors({ ...errors })
      confirmControl.setValidators(this._passwordValidators)

      confirmControl.updateValueAndValidity({ onlySelf: true })
      return
    }

    if (confirmControl.hasError('equalTo')) return

    confirmControl.setValidators([
      ...this._passwordValidators,
      CustomValidator.equalTo(targetValue),
    ])

    confirmControl.updateValueAndValidity({ onlySelf: true })
  }
}
