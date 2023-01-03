import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
} from '@angular/core'
import { HttpCommonService } from 'src/app/services/https/http-common.service'
import { BaseSelectComponent } from '../shared/base-select.component.ts/base-select.component'

@Component({
  selector: 'app-dropdown-input',
  templateUrl: './dropdown-input.component.html',
  styleUrls: ['./dropdown-input.component.scss'],
  providers: [HttpCommonService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownInputComponent extends BaseSelectComponent {
  @ViewChild('dropdownSection') dropdownSection?: ElementRef

  isDropdownOpened = false

  readonly toggleDropdown = () => {
    if (this.isDisabled) return

    this.isDropdownOpened = !this.isDropdownOpened
    if (this.isDropdownOpened) {
      this.showValidationMessage = false
    }

    this._changeDetectorRef.detectChanges()
  }

  override readonly selectOption = (option: {
    value: string
    label: string
  }) => {
    if (this.isDisabled) return

    this.form?.get(this.name)?.setValue(option.value)
    this.selectedOption$.next(option)

    this.isDropdownOpened = false

    this._changeDetectorRef.detectChanges()

    this.onFocusOut()
  }

  @HostListener('document:mousedown', ['$event'])
  private readonly onGlobalClick = (event: MouseEvent) => {
    if (this.isDisabled || !this.isDropdownOpened) return
    if (this.dropdownSection?.nativeElement.contains(event.target)) {
      return
    }

    this.isDropdownOpened = false

    this._changeDetectorRef.detectChanges()

    this.onFocusOut()
  }
}
