import { Location } from '@angular/common'
import { Component } from '@angular/core'
import { ICONS } from 'src/app/models/constants/css-constants'

@Component({
  selector: 'app-back-button',
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.scss'],
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
