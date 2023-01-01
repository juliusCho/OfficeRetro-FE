import { Component, EventEmitter, Input, Output } from '@angular/core'

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  @Input() type: 'button' | 'submit' = 'button'
  @Input() isDisabled = false
  @Input() isPale = false
  @Input() isLargeFont = false
  @Input() width = ''
  @Input() style = ''

  @Output() click = new EventEmitter<void>()

  readonly getExtraCssClass = (): Record<string, boolean> => {
    return {
      'pale-color': this.isPale,
      disabled: this.isDisabled,
      'large-font': this.isLargeFont,
    }
  }

  readonly onClick = () => {
    this.click.emit()
  }
}
