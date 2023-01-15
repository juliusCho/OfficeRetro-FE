import { Component } from '@angular/core'
import { Router } from '@angular/router'
import { ICONS } from 'src/app/models/constants/css-constants'

@Component({
  selector: 'app-password-reset-button',
  templateUrl: './password-reset-button.component.html',
  styleUrls: ['./password-reset-button.component.scss'],
})
export class PasswordResetButtonComponent {
  get passwordResetIcon() {
    return ICONS.PASSWORD_RESET
  }

  constructor(private readonly _router: Router) {}

  readonly onClick = () => {
    this._router.navigateByUrl('pw-reset')
  }
}
