import { ChangeDetectionStrategy, Component } from '@angular/core'
import { convertToColumnizedArray } from 'src/app/helpers/object-converters'
import { HttpCommonService } from 'src/app/services/https/http-common.service'
import { v4 as uuid } from 'uuid'
import { BaseSelectComponent } from '../shared/base-select.component.ts/base-select.component'

@Component({
  selector: 'app-radio-input',
  templateUrl: './radio-input.component.html',
  styleUrls: [
    '../../../../styles/templates/select-options-input.component.scss',
  ],
  providers: [HttpCommonService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioInputComponent extends BaseSelectComponent {
  private readonly _componentUniqueId = uuid()

  get columnCount() {
    return this.formInputSpec?.columnCount ?? 2
  }

  get columnWidth() {
    return `calc(100% / ${this.columnCount})`
  }

  get componentUniqueId() {
    return this._componentUniqueId
  }

  readonly getItems = (
    optionValues: Array<{ label: string; value: string }>,
  ) => {
    return convertToColumnizedArray(optionValues, this.columnCount ?? 0)
  }
}
