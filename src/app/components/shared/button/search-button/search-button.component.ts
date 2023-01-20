import { Component, EventEmitter, Input, Output } from '@angular/core'
import {
  ButtonColor,
  CssSize,
} from 'src/app/models/client-specs/shared/css-specs'
import { ICONS } from 'src/app/models/constants/css-constants'
import { CssService } from 'src/app/services/shared/css.service'

@Component({
  selector: 'app-search-button',
  templateUrl: './search-button.component.html',
  styleUrls: ['./search-button.component.scss'],
})
export class SearchButtonComponent {
  @Input() isDisabled?: boolean = false
  @Input() height?: CssSize
  @Input() iconSize?: CssSize = 'unit-5'
  @Input() style?: Record<string, string>
  @Input() color?: ButtonColor = 'default'

  @Output() click = new EventEmitter<void>()

  get glassIcon() {
    return ICONS.MAGNIFYING
  }

  get cssIconSize() {
    return this._cssService.getSize(this.iconSize ?? 'unit-5')
  }

  constructor(private readonly _cssService: CssService) {}

  readonly onClick = () => {
    this.click.emit()
  }
}
