import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
} from '@angular/core'
import { FormInputOption } from 'src/app/models/client-specs/form/form-input-types'
import { ICONS } from 'src/app/models/constants/css-constants'
import { HttpCommonService } from 'src/app/services/https/http-common.service'
import { BaseSelectComponent } from '../inheritances/base-select-input/base-select.component'

@Component({
  selector: 'app-dropdown-input',
  templateUrl: './dropdown-input.component.html',
  styleUrls: ['./dropdown-input.component.scss'],
  providers: [HttpCommonService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownInputComponent extends BaseSelectComponent {
  @ViewChild('dropdownSection') dropdownSection!: ElementRef

  isDropdownOpened = false

  get dropdownInputAreaStyle() {
    if (this.label && this.labelPosition !== 'top' && this.labelWidth) {
      return {
        width: `calc(calc(100% - ${
          this.isDisabled ? '0px' : this.cssService.getSize('unit-3')
        }) - ${this.cssService.getSize(this.labelWidth)})`,
      }
    }

    return {
      width: `calc(100% - ${
        this.isDisabled ? '0px' : this.cssService.getSize('unit-3')
      })`,
    }
  }

  get caretDownIcon() {
    return ICONS.CARET_DOWN
  }

  override readonly selectOption = (option: FormInputOption) => {
    if (this.isDisabled) return

    this.form.get(this.name)?.setValue(option.value)

    this.isDropdownOpened = false

    this.changeDetectorRef.detectChanges()

    this.onFocusOut()
  }

  readonly toggleDropdown = () => {
    if (this.isDisabled) return

    this.isDropdownOpened = !this.isDropdownOpened
    if (this.isDropdownOpened) {
      this.showValidationMessage = false
    }

    this.changeDetectorRef.detectChanges()
  }

  @HostListener('document:mousedown', ['$event'])
  private readonly onGlobalClick = (event: MouseEvent) => {
    if (this.isDisabled || !this.isDropdownOpened) return
    if (this.dropdownSection.nativeElement.contains(event.target)) {
      return
    }

    this.isDropdownOpened = false

    this.changeDetectorRef.detectChanges()

    this.onFocusOut()
  }
}
