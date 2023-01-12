import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core'
import { BaseInputComponent } from '../inheritances/base-input/base-input.component'

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextInputComponent
  extends BaseInputComponent
  implements AfterViewInit
{
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

    return inputType === 'password-login' || inputType === 'password-confirm'
      ? 'password'
      : 'text'
  }

  ngAfterViewInit(): void {
    this.valueChangeSubscription$ = this.valueChangeObservable$?.subscribe()

    this.isInnerContentExist =
      (this.innerContentRef?.nativeElement.children.length ?? 0) > 0

    this.changeDetectorRef.detectChanges()
  }

  readonly onEnter = () => {
    this.showValidationMessage = true

    this.changeDetectorRef.markForCheck()

    this.enter.emit()
  }
}
