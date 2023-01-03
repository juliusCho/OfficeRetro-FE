import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core'
import { BehaviorSubject, tap } from 'rxjs'
import { AutoUnsubscribe } from 'src/app/decorators/auto-unsubscribe/auto-unsubscribe.decorator'
import { convertToColumnizedArray } from 'src/app/helpers/object-converters'
import { HttpCommonService } from 'src/app/services/https/http-common.service'
import { v4 as uuid } from 'uuid'
import { BaseListInputComponent } from '../shared/base-list-input.component.ts/base-list-input.component'

@AutoUnsubscribe()
@Component({
  selector: 'app-checkbox-input',
  templateUrl: './checkbox-input.component.html',
  styleUrls: ['./checkbox-input.component.scss'],
  providers: [HttpCommonService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxInputComponent
  extends BaseListInputComponent
  implements OnChanges
{
  @Input() columnCount = 2

  selectedOptions$ = new BehaviorSubject<string[]>([])

  private readonly _componentUniqueId = uuid()

  get columnWidth() {
    return `calc(100% / ${this.columnCount})`
  }

  get componentUniqueId() {
    return this._componentUniqueId
  }

  override ngAfterViewInit(): void {
    this._formChangeSubscription$ = this._formChangeObservable$
      ?.pipe(
        tap((v) => {
          if (v.length === 0) {
            this.selectedOptions$.next([])

            this._changeDetectorRef.markForCheck()
          }
        }),
      )
      .subscribe()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['optionValuesObservableSeq']?.previousValue) {
      this.optionValues$.pipe(tap(this.setSelectedOptionsSubject))
      return
    }

    const { previousValue, currentValue } = changes['optionValuesObservableSeq']
    if (previousValue === currentValue) return

    this.optionValues$.pipe(tap(this.setSelectedOptionsSubject))
  }

  readonly getItems = (
    optionValues: Array<{ label: string; value: string }>,
  ) => {
    return convertToColumnizedArray(optionValues, this.columnCount)
  }

  readonly isSelectedOption = (selectedOptions: string[], option: string) => {
    return selectedOptions.includes(option)
  }

  readonly selectOption = (value: string) => {
    if (this.isDisabled) return

    let formValues: string[] = [...(this.form?.value[this.name] ?? [])]
    if (formValues.includes(value)) {
      formValues = formValues.filter((v) => v !== value)
    } else {
      formValues.push(value)
    }
    this.form?.get(this.name)?.setValue(formValues)
    this.selectedOptions$.next(formValues)

    this._changeDetectorRef.detectChanges()

    this.onFocusOut()
  }

  private readonly setSelectedOptionsSubject = (
    values: Array<{ value: string; label: string }>,
  ) => {
    const vals = values
      .filter((item) => this.form?.value[this.name].includes(item.value))
      .map((item) => item.value)

    this.selectedOptions$.next(vals)

    this._changeDetectorRef.markForCheck()
  }
}
