import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Input,
  ViewChild,
} from '@angular/core'
import { map, Observable, of } from 'rxjs'
import { AutoUnsubscribe } from 'src/app/decorators/auto-unsubscribe/auto-unsubscribe.decorator'
import { HttpCommonService } from 'src/app/services/https/http-common.service'
import { BaseInputComponent } from '../shared/base-input/base-input.component'

@AutoUnsubscribe()
@Component({
  selector: 'app-dropdown-input',
  templateUrl: './dropdown-input.component.html',
  styleUrls: ['./dropdown-input.component.scss'],
  providers: [HttpCommonService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownInputComponent
  extends BaseInputComponent
  implements AfterContentInit
{
  @Input() options?: Record<string, string>[]
  @Input() optionsFetchUrl?: string
  @Input() excludeValue?: string

  optionValues$: Observable<Array<{ label: string; value: string }>> = of()
  isDropdownOpened = false

  @ViewChild('dropdownSection') dropdownSection?: ElementRef

  constructor(
    private readonly _requestService: HttpCommonService,
    protected readonly _changeDetector: ChangeDetectorRef,
  ) {
    super(_changeDetector)
  }

  ngAfterContentInit() {
    if (this.options && this.options.length > 0) {
      this.optionValues$ = of([
        { label: '', value: '' },
        ...this.options
          .filter((o) => Object.values(o)[0] !== this.excludeValue)
          .map((o) => {
            const [value, label] = Object.entries(o)[0]
            return { value, label }
          }),
      ])
      this._changeDetector.detectChanges()
      return
    }

    if (!this.optionsFetchUrl) return

    this.fetchOptions()
  }

  readonly toggleDropdown = () => {
    this.isDropdownOpened = !this.isDropdownOpened
    if (this.isDropdownOpened) {
      this._showValidationMessage = false
    }
    this._changeDetector.detectChanges()
  }

  readonly selectOption = (value: string) => {
    this.form.setValue({ ...this.form.value, [this.name]: value })
    this.isDropdownOpened = false
    this.onFocusOut()
  }

  @HostListener('document:mousedown', ['$event'])
  private readonly onGlobalClick = (event: MouseEvent) => {
    if (!this.isDropdownOpened) return
    if (this.dropdownSection?.nativeElement.contains(event.target)) {
      return
    }

    this.isDropdownOpened = false
    this.onFocusOut()
  }

  private readonly fetchOptions = () => {
    if (!this.optionsFetchUrl) return

    this.optionValues$ = this._requestService
      .getGeneralFetch(this.optionsFetchUrl)
      .pipe(
        map((data) => [
          { label: '', value: '' },
          ...data
            .filter((d) => String(d.id) !== this.excludeValue)
            .map((d) => ({
              label: d.name,
              value: String(d.id),
            })),
        ]),
      )
    this._changeDetector.detectChanges()
  }
}
