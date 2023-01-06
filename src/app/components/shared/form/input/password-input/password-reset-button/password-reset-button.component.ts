import { Component } from '@angular/core'
import { Router } from '@angular/router'

@Component({
  selector: 'app-password-reset-button',
  templateUrl: './password-reset-button.component.html',
  styleUrls: ['./password-reset-button.component.scss'],
})
export class PasswordResetButtonComponent {
  constructor(private readonly _router: Router) {}

  readonly onClick = () => {
    console.log('onClick')
  }
}
