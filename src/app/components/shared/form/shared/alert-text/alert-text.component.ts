import { Component, Input } from '@angular/core'
import { CssService } from 'src/app/services/shared/css.service'

@Component({
  selector: 'app-alert-text',
  templateUrl: './alert-text.component.html',
  styleUrls: ['./alert-text.component.scss'],
})
export class AlertTextComponent {
  @Input() text = ''
  @Input() labelPosition?: 'side' | 'top' = 'side'
  @Input() labelWidth?: string

  get paddingStyle() {
    if (!this.labelWidth || this.labelPosition === 'top') return {}

    return {
      'padding-left': `calc(${this.labelWidth} - ${this._cssService.getSize(
        'unit-7',
      )})`,
    }
  }

  constructor(private readonly _cssService: CssService) {}
}
