import { Component, EventEmitter, Input, Output } from '@angular/core'
import {
  CssSize,
  FontWeight,
} from 'src/app/models/client-specs/shared/css-specs'
import { CssService } from 'src/app/services/shared/css.service'

@Component({
  selector: 'app-input-label',
  templateUrl: './input-label.component.html',
  styleUrls: ['./input-label.component.scss'],
})
export class InputLabelComponent {
  @Input() label!: string
  @Input() for?: string
  @Input() labelPosition?: 'top' | 'side'
  @Input() width?: string | CssSize
  @Input() labelSize?: CssSize
  @Input() labelWeight?: FontWeight

  @Output() click = new EventEmitter<void>()

  get doesLabelContainsLineBreak() {
    return !!this.label && this.label.includes('\n')
  }

  get extraStyle() {
    return {
      width: this._cssService.getUntypedSize(this.width) || 'fit-content',
      'font-size': this._cssService.getSize(this.labelSize),
      'font-weight': this.labelWeight,
    }
  }

  constructor(private readonly _cssService: CssService) {}

  readonly getLineBrokenLabel = (label: string) => {
    const idx = label.indexOf('\n')
    if (idx === -1) return [label, '']

    return [label.substring(0, idx), label.substring(idx + 1)]
  }

  readonly onClick = () => {
    this.click.emit()
  }
}
