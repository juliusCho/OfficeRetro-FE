import { CdkDragDrop } from '@angular/cdk/drag-drop'
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core'
import { AutoUnsubscribe } from 'src/app/decorators/auto-unsubscribe/auto-unsubscribe.decorator'
import { isArray } from 'src/app/helpers/type-checkers'
import { FormListInputOption } from 'src/app/models/client-specs/form/form-input-types'
import { FormInputSpec } from 'src/app/models/client-specs/form/form-spec'
import { ICONS } from 'src/app/models/constants/css-constants'
import {
  COLOR_PICKER_DEFAULT_COLOR,
  LIST_INPUT_NEW_ITEM_ALIAS,
} from 'src/app/models/constants/form-constants'
import { HttpCommonService } from 'src/app/services/https/http-common.service'
import { v4 as uuid } from 'uuid'
import { SuperInputComponent } from '../inheritances/super-input.component'

@AutoUnsubscribe()
@Component({
  selector: 'app-list-input',
  templateUrl: './list-input.component.html',
  styleUrls: ['./list-input.component.scss'],
  providers: [HttpCommonService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListInputComponent
  extends SuperInputComponent<FormListInputOption[]>
  implements OnChanges, AfterViewInit
{
  @Input() listInputLabel?: string = ''
  @Input() isFormSubmitted?: boolean = false // To check if the parent form has submitted

  @ViewChild('listSection') listSection!: ElementRef

  innerFormInputSpecs: FormInputSpec<unknown>[] = []
  innerFormSubmittable = false

  get upDownIcon() {
    return ICONS.UP_DOWN
  }

  get crossIcon() {
    return ICONS.CROSS
  }

  get optionValues() {
    return (
      (this.control?.value ?? []) as unknown as FormListInputOption[]
    ).sort((a, b) => a.order - b.order)
  }

  override ngOnInit(): void {
    super.ngOnInit()

    this.setFormInputOption()
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isFormSubmitted']?.previousValue === undefined) return

    const { previousValue, currentValue } = changes['isFormSubmitted']
    if (previousValue === currentValue || previousValue || !currentValue) return

    this.setInnerFormSubmittable(true)
    this.setInnerFormSubmittable(false)
    this.scrollListToTop()
  }

  ngAfterViewInit(): void {
    this.scrollListToTop()
  }

  readonly addOption = (formValue: Record<string, unknown>) => {
    if (
      this.isDisabled ||
      !this.isFormInputOption(formValue) ||
      !this.control ||
      !isArray(this.control.value)
    )
      return

    const existingList = this.optionValues.map((option) => ({
      ...option,
      order: option.order + 1,
    }))

    const newOption = {
      label: formValue.inputText,
      color: formValue.inputColor || COLOR_PICKER_DEFAULT_COLOR,
    }

    const newOptionList = [
      {
        ...newOption,
        value: `${LIST_INPUT_NEW_ITEM_ALIAS}${uuid()}`,
        order: 1,
      },
      ...existingList,
    ]

    this.setInnerFormSubmittable(true)

    this.control.setValue(newOptionList)
    this.control.markAsDirty()

    this.setInnerFormSubmittable(false)

    this.scrollListToTop()
  }

  readonly deleteOption = (option: FormListInputOption) => {
    if (this.isDisabled || !this.control || !isArray(this.control.value)) return

    let existingList = this.optionValues
      .filter((o) => o.value !== option.value)
      .map((o) => (o.order > option.order ? { ...o, order: o.order - 1 } : o))

    this.control.setValue(existingList)
    this.control.markAsDirty()
  }

  readonly changeOrder = (event: CdkDragDrop<FormListInputOption[]>) => {
    const { previousIndex, currentIndex } = event
    if (
      previousIndex === currentIndex ||
      !this.control ||
      !isArray(this.control.value)
    )
      return

    const existingList = this.optionValues

    const target = existingList.find((_, idx) => idx === previousIndex)
    if (!target) return

    let newOptionList: FormListInputOption[] = []

    if (previousIndex - currentIndex < 0) {
      newOptionList = existingList.map((o, idx) =>
        idx > previousIndex && currentIndex >= idx
          ? { ...o, order: o.order - 1 }
          : idx === previousIndex
          ? { ...target, order: currentIndex + 1 }
          : o,
      )
    } else {
      newOptionList = existingList.map((o, idx) =>
        idx < previousIndex && currentIndex <= idx
          ? { ...o, order: o.order + 1 }
          : idx === previousIndex
          ? { ...target, order: currentIndex + 1 }
          : o,
      )
    }

    this.control.setValue(newOptionList)
    this.control.markAsDirty()
  }

  private readonly setFormInputOption = () => {
    this.innerFormInputSpecs = [
      {
        key: 'input',
        label: this.listInputLabel,
        initValue: ['', COLOR_PICKER_DEFAULT_COLOR],
        inputType: 'text-color',
        placeholder: 'Please type-in to add',
        disabled: this.isDisabled,
        required: true,
        max: '50',
      },
    ]

    this.changeDetectorRef.detectChanges()
  }

  private readonly isFormInputOption = (
    value: Record<string, unknown>,
  ): value is { inputText: string; inputColor: string } => {
    return 'inputText' in value && 'inputColor' in value
  }

  private readonly setInnerFormSubmittable = (value: boolean) => {
    this.innerFormSubmittable = value
    this.changeDetectorRef.detectChanges()
  }

  private readonly scrollListToTop = () => {
    if (!this.listSection) return

    this.listSection.nativeElement.scrollTop = 0
    this.changeDetectorRef.markForCheck()
  }
}
