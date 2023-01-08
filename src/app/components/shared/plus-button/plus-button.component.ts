import { Component, EventEmitter, Input, Output } from '@angular/core'
import { isNumber } from 'src/app/helpers/type-checkers'
import {
  ButtonColor,
  CssSize,
} from 'src/app/models/client-specs/shared/css-specs'
import { ICONS } from 'src/app/models/constants/css-constants'
import { CssService } from 'src/app/services/shared/css.service'

@Component({
  selector: 'app-plus-button',
  templateUrl: './plus-button.component.html',
  styleUrls: ['./plus-button.component.scss'],
})
export class PlusButtonComponent {
  @Input() isDisabled?: boolean = false
  @Input() size?: CssSize = 'unit-11'
  @Input() iconSize?: CssSize = 'unit-5'
  @Input() style?: string = ''
  @Input() color?: ButtonColor = 'default'

  @Output() click = new EventEmitter<void>()

  get plusIcon() {
    return ICONS.PLUS
  }

  get cssIconSize() {
    return this._cssService.getSize(this.iconSize ?? 'unit-5')
  }

  get plusStyle() {
    if (this.style?.includes('padding')) return this.style

    const size = this._cssService.getSize(this.size ?? 'unit-11') ?? ''
    const iconSize = this.cssIconSize ?? ''

    return `padding:${this.getCalculatedPadding(size, iconSize)};${this.style}`
  }

  constructor(private readonly _cssService: CssService) {}

  readonly onClick = () => {
    this.click.emit()
  }

  private readonly getCalculatedPadding = (size: string, iconSize: string) => {
    const sizeNum = Number(size.replace(/ /g, '').replace(/rem/g, ''))
    if (!isNumber(sizeNum)) return ''

    const iconSizeNum = Number(iconSize.replace(/ /g, '').replace(/rem/g, ''))
    if (!isNumber(iconSizeNum)) return ''

    return `${(sizeNum - iconSizeNum) / 2}rem`
  }
}
