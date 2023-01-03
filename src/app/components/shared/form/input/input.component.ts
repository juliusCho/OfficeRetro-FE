import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core'
import { BaseInputComponent } from '../shared/base-input/base-input.component'

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputComponent extends BaseInputComponent {
  @Input() type: 'email' | 'text' | 'password' = 'text'
  @Input() showPasswordResetIcon = false

  @Output() enter = new EventEmitter<void>()

  readonly onEnter = () => {
    this.showValidationMessage = true

    this._changeDetectorRef.detectChanges()

    this.enter.emit()
  }
}
