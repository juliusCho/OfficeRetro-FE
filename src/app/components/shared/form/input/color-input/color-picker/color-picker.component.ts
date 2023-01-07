import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core'
import { COLOR_PICKER_DEFAULT_COLOR } from 'src/app/models/client-specs/form/constants'

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorPickerComponent {
  @Input() color?: string
  @Input() isDisabled?: boolean = false

  @Output() select = new EventEmitter<string>()

  get defaultColor() {
    return COLOR_PICKER_DEFAULT_COLOR
  }

  readonly onSelect = (value: string) => {
    this.select.emit(value)
  }
}
