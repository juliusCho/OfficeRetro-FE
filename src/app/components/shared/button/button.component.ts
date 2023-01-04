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
  @Input() isDisabled?: boolean = false
  @Input() isPale?: boolean = false // button label color to be pale
  @Input() isLargeFont?: boolean = false
  @Input() width?: string = ''
  @Input() style?: string = ''

  @Output() click = new EventEmitter<void>()

  readonly getExtraCssClass = (): Record<string, boolean> => {
    return {
      'pale-color': !!this.isPale,
      enabled: !this.isDisabled,
      disabled: !!this.isDisabled,
      'large-font': !!this.isLargeFont,
    }
  }
}
