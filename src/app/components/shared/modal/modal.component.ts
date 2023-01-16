import { Component, EventEmitter, Input, Output } from '@angular/core'
import { CssSize } from 'src/app/models/client-specs/shared/css-specs'
import { CssService } from 'src/app/services/shared/css.service'

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  @Input() show!: boolean
  @Input() type!: 'alert' | 'confirm' | 'form'
  @Input() title?: string
  @Input() submitLabel?: string
  @Input() cancelLabel?: string
  @Input() width?: CssSize
  @Input() isNested?: boolean

  @Output() submitAction = new EventEmitter<void>()
  @Output() cancelAction = new EventEmitter<void>()
  @Output() clickOuter = new EventEmitter<void>()

  get outerStyle() {
    return { 'z-index': this.isNested ? 20 : 10 }
  }

  get modalStyle() {
    const width = this._cssService.getSize(this.width)

    if (width) {
      const unit7 = this._cssService.getSize('unit-7')
      const paddingOffset = `calc(${unit7} + ${unit7})`

      return { width: `calc(${width} + ${paddingOffset})` }
    }

    return {}
  }

  get submitButtonStyle() {
    return { 'margin-right': this._cssService.getSize('unit-9') ?? '' }
  }

  get isButtonAreaExist() {
    return this.type !== 'form'
  }

  constructor(private readonly _cssService: CssService) {}

  readonly onClickModal = (e: Event) => {
    e.stopPropagation()
  }

  readonly onCancel = () => {
    this.cancelAction.emit()
  }

  readonly onSubmit = () => {
    this.submitAction.emit()
  }

  readonly onClickOuter = () => {
    this.clickOuter.emit()
  }
}
