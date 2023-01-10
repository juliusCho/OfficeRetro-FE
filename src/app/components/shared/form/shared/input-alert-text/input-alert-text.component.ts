import { Component, Input } from '@angular/core'
import { CssSize } from 'src/app/models/client-specs/shared/css-specs'
import { CssService } from 'src/app/services/shared/css.service'

@Component({
  selector: 'app-input-alert-text',
  templateUrl: './input-alert-text.component.html',
  styleUrls: ['./input-alert-text.component.scss'],
})
export class InputAlertTextComponent {
  @Input() text = ''
  @Input() labelPosition?: 'side' | 'top' = 'side'
  @Input() labelWidth?: CssSize

  get paddingStyle() {
    if (!this.labelWidth || this.labelPosition === 'top') return {}

    return {
      'padding-left': `calc(${this._cssService.getSize(
        this.labelWidth,
      )} - ${this._cssService.getSize('unit-7')})`,
    }
  }

  constructor(private readonly _cssService: CssService) {}
}
