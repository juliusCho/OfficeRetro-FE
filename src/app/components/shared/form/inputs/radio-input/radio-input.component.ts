import { ChangeDetectionStrategy, Component } from '@angular/core'
import { convertToColumnizedArray } from 'src/app/helpers/value-converters'
import { FormInputOption } from 'src/app/models/client-specs/form/form-input-types'
import { HttpCommonService } from 'src/app/services/https/http-common.service'
import { v4 as uuid } from 'uuid'
import { BaseSelectInputComponent } from '../inheritances/base-select-input/base-select-input.component'

@Component({
  selector: 'app-radio-input',
  templateUrl: './radio-input.component.html',
  styleUrls: [
    '../../../../../styles/templates/select-options-input.component.scss',
  ],
  providers: [HttpCommonService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioInputComponent extends BaseSelectInputComponent {
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

  readonly getItems = (optionValues: FormInputOption[]) => {
    return convertToColumnizedArray(optionValues, this.columnCount ?? 0)
  }

  readonly trackByIndex = (index: number) => {
    return index
  }
}
