import { Location } from '@angular/common'
import { Component } from '@angular/core'
import { ICONS } from 'src/app/models/constants/css-constants'
import { ButtonComponent } from '../button.component'

@Component({
  standalone: true,
  selector: 'app-back-button',
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.scss'],
  imports: [ButtonComponent],
})
export class BackButtonComponent {
  get arrowIcon() {
    return ICONS.ARROW_LEFT
  }

  constructor(private readonly _location: Location) {}

  readonly onClick = () => {
    this._location.back()
  }
}
