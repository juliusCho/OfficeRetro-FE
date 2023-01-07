import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core'
import { BaseInputComponent } from '../shared/base/base-input/base-input.component'

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputComponent extends BaseInputComponent {
  @Input() lengthLabelPosition?: 'left' | 'right' = 'right'

  @Output() enter = new EventEmitter<void>()

  @ViewChild('innerContent') innerContentRef!: ElementRef

  isInnerContentExist = false

  get type() {
    const inputType = this.formInputSpec?.inputType ?? 'text'

    if (
      inputType === 'text' ||
      inputType === 'email' ||
      inputType === 'password'
    ) {
      return inputType
    }

    return inputType === 'password-login' ? 'password' : 'text'
  }

  override ngAfterViewInit(): void {
    this.valueChangeSubscription$ = this.valueChangeObservable$?.subscribe()

    this.isInnerContentExist =
      (this.innerContentRef?.nativeElement.children.length ?? 0) > 0

    this.changeDetectorRef.detectChanges()
  }

  readonly onEnter = () => {
    this.showValidationMessage = true

    this.changeDetectorRef.detectChanges()

    this.enter.emit()
  }
}
