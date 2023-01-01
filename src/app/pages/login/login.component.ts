import { Component } from '@angular/core'
import { BasePageComponent } from '../base-page.component'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent extends BasePageComponent {
  input = {
    email: '',
    password: '',
  }

  readonly onChange = (key: 'email' | 'password', value: string) => {
    this.input[key] = value
    console.log(`key: ${key}, value: ${value}`)
  }

  readonly onSubmit = () => {
    console.log('onSubmit')
  }
}
