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
import { BaseSelectInputComponent } from '../inheritances/base-select-input/base-select-input.component'

@Component({
  selector: 'app-dropdown-input',
  templateUrl: './dropdown-input.component.html',
  styleUrls: ['./dropdown-input.component.scss'],
  providers: [HttpCommonService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownInputComponent extends BaseSelectInputComponent {
  @ViewChild('dropdownSection') dropdownSection!: ElementRef

  isDropdownOpened = false

  get dropdownInputAreaStyle() {
    if (this.label && this.labelPosition !== 'top' && this.labelAreaWidth) {
      return {
        width: `calc(calc(100% - ${
          this.isDisabled ? '0px' : this.cssService.getSize('unit-3')
        }) - ${this.cssService.getSize(this.labelAreaWidth)})`,
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

    this.isDropdownOpened = false

    this.changeDetectorRef.markForCheck()

    this.control?.setValue(option.value)
    this.control?.markAsDirty()
  }

  readonly toggleDropdown = () => {
    if (this.isDisabled) return

    this.isDropdownOpened = !this.isDropdownOpened

    this.changeDetectorRef.markForCheck()
  }

  @HostListener('document:mousedown', ['$event'])
  private readonly _onGlobalClick = (event: MouseEvent) => {
    if (this.isDisabled || !this.isDropdownOpened) return
    if (this.dropdownSection.nativeElement.contains(event.target)) {
      return
    }

    this.isDropdownOpened = false

    this.changeDetectorRef.markForCheck()
  }
}
