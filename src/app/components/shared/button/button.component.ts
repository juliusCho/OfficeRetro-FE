import { Component, EventEmitter, Input, Output } from '@angular/core'
import {
  ButtonColor,
  CssSize,
} from 'src/app/models/client-specs/shared/css-specs'
import { CssService } from 'src/app/services/shared/css.service'

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  @Input() isDisabled?: boolean = false
  @Input() isPale?: boolean = false // button label color to be pale
  @Input() isLargeFont?: boolean = false
  @Input() width?: CssSize
  @Input() height?: CssSize
  @Input() style?: string = ''
  @Input() color?: ButtonColor = 'default'

  @Output() click = new EventEmitter<void>()

  constructor(private readonly _cssService: CssService) {}

  readonly getExtraCssClass = (): Record<string, boolean> => {
    return {
      'pale-color': !!this.isPale,
      enabled: !this.isDisabled,
      disabled: !!this.isDisabled,
      'large-font': !!this.isLargeFont,
      primary: this.color === 'primary',
      clear: this.color === 'clear',
    }
  }

  readonly getExtraCssStyle = () => {
    return {
      width: this._cssService.getSize(this.width) || 'fit-content',
      height: this._cssService.getSize(this.height) || '',
    }
  }
}
