import { Component, Input } from '@angular/core'
import { AbstractControl } from '@angular/forms'
import { CustomValidationErrors } from 'src/app/models/client-specs/form/form-input-types'
import { CssSize } from 'src/app/models/client-specs/shared/css-specs'
import { CssService } from 'src/app/services/shared/css.service'

@Component({
  selector: 'app-input-alert-text',
  templateUrl: './input-alert-text.component.html',
  styleUrls: ['./input-alert-text.component.scss'],
})
export class InputAlertTextComponent {
  @Input() control?: AbstractControl | null
  @Input() controls?: [AbstractControl | null, AbstractControl | null]
  @Input() label?: string
  @Input() labelPosition?: 'side' | 'top' = 'side'
  @Input() labelWidth?: CssSize

  get errorMessage() {
    if (!this.control || !this.control.dirty || !this.control.touched) return ''

    return this._getControlErrorMessage(this.control.errors)
  }

  get errorMessageWithControls() {
    if (
      !this.controls ||
      this.controls.length < 2 ||
      this.controls.some((c) => c === null)
    )
      return ''

    const [firstControl, secondControl] = this.controls

    if (!firstControl?.dirty || !firstControl?.touched) {
      if (!secondControl?.dirty || !secondControl?.touched) return ''

      return this._getControlErrorMessage(secondControl.errors ?? null)
    }

    const firstError = this._getControlErrorMessage(firstControl.errors ?? null)
    if (!firstError) {
      if (!secondControl?.dirty || !secondControl?.touched) return ''

      return this._getControlErrorMessage(secondControl.errors ?? null)
    }

    return firstError
  }

  get isError() {
    return this.errorMessage !== '' || this.errorMessageWithControls !== ''
  }

  get paddingStyle() {
    if (!this.labelWidth || this.labelPosition === 'top') return {}

    return {
      'padding-left': `calc(${this._cssService.getSize(
        this.labelWidth,
      )} - ${this._cssService.getSize('unit-7')})`,
    }
  }

  get _labelParsed() {
    return (this.label ?? 'This field').replace(/\\n/g, ' ')
  }

  constructor(private readonly _cssService: CssService) {}

  private readonly _getControlErrorMessage = (
    errors: CustomValidationErrors | null,
  ) => {
    if (errors === null) return ''

    const errList = Object.values(errors)
      .filter((e) => e.priority)
      .sort((a, b) => a.priority - b.priority)
    if (errList.length === 0) return ''

    return `${this._labelParsed} ${errList[0].message}`
  }
}
