import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
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
export class InputComponent
  extends BaseInputComponent
  implements AfterContentInit
{
  @Output() enter = new EventEmitter<void>()

  @ViewChild('innerContent') innerContentRef!: ElementRef

  isInnerContentExist = false

  get type() {
    const result = this.formInputSpec?.inputType ?? 'text'
    if (result === 'text' || result === 'email' || result === 'password')
      return result
    if (result === 'password-login') return 'password'
    return 'text'
  }

  ngAfterContentInit(): void {
    this.isInnerContentExist =
      (this.innerContentRef?.nativeElement.children.length ?? 0) > 0

    this._changeDetectorRef.detectChanges()
  }

  readonly onEnter = () => {
    this.showValidationMessage = true

    this._changeDetectorRef.detectChanges()

    this.enter.emit()
  }
}
