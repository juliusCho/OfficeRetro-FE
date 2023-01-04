import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core'
import { BaseInputComponent } from '../shared/base-input/base-input.component'

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputComponent extends BaseInputComponent {
  @Input() type?: 'email' | 'text' | 'password' = 'text'

  @Output() enter = new EventEmitter<void>()

  @ViewChild('innerContent') innerContentRef?: ElementRef

  get isInnerContentExist() {
    return (this.innerContentRef?.nativeElement.children.length ?? 0) > 0
  }

  readonly onEnter = () => {
    this.showValidationMessage = true

    this._changeDetectorRef.detectChanges()

    this.enter.emit()
  }
}
