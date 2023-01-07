import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
} from '@angular/core'
import { HttpCommonService } from 'src/app/services/https/http-common.service'
import { CssService } from 'src/app/services/shared/css.service'
import { BaseSelectComponent } from '../shared/base/base-input/base-select-input/base-select.component'

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
          this.isDisabled ? '0px' : this._cssService.getSize('unit-3')
        }) - ${this.labelWidth})`,
      }
    }

    return {
      width: `calc(100% - ${
        this.isDisabled ? '0px' : this._cssService.getSize('unit-3')
      })`,
    }
  }

  constructor(
    private readonly _cssService: CssService,
    protected override readonly requestService: HttpCommonService,
    protected override readonly changeDetectorRef: ChangeDetectorRef,
  ) {
    super(requestService, changeDetectorRef)
  }

  readonly toggleDropdown = () => {
    if (this.isDisabled) return

    this.isDropdownOpened = !this.isDropdownOpened
    if (this.isDropdownOpened) {
      this.showValidationMessage = false
    }

    this.changeDetectorRef.detectChanges()
  }

  override readonly selectOption = (option: {
    value: string
    label: string
  }) => {
    if (this.isDisabled) return

    this.form.get(this.name)?.setValue(option.value)

    this.isDropdownOpened = false

    this.changeDetectorRef.detectChanges()

    this.onFocusOut()
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
