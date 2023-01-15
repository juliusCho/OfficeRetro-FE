import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core'
import { SuperInputComponent } from '../inheritances/super-input.component'

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextInputComponent
  extends SuperInputComponent<string>
  implements AfterViewInit
{
  @Input() lengthLabelPosition?: 'left' | 'right' = 'right'

  @ViewChild('innerContent') _innerContentRef?: ElementRef

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
    this.isInnerContentExist =
      (this._innerContentRef?.nativeElement.children.length ?? 0) > 0

    this.changeDetectorRef.detectChanges()
  }
}
