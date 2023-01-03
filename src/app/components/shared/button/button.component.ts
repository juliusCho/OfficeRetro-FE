import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core'

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  @Input() isDisabled = false
  @Input() isPale = false // button label color to be pale
  @Input() isLargeFont = false
  @Input() width = ''
  @Input() style = ''

  @Output() click = new EventEmitter<void>()

  readonly getExtraCssClass = (): Record<string, boolean> => {
    return {
      'pale-color': this.isPale,
      enabled: !this.isDisabled,
      disabled: this.isDisabled,
      'large-font': this.isLargeFont,
    }
  }
}
