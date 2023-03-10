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
  private readonly _COMPONENT_UNIQUE_ID = uuid()

  get columnWidth() {
    return { width: `calc(100% / ${this._columnCount})` }
  }

  get componentUniqueId() {
    return this._COMPONENT_UNIQUE_ID
  }

  get _columnCount() {
    return this.formInputSpec?.columnCount ?? 2
  }

  readonly getItems = (optionValues: FormInputOption[]) => {
    return convertToColumnizedArray(optionValues, this._columnCount ?? 0)
  }

  readonly trackByIndex = (index: number) => {
    return index
  }
}
