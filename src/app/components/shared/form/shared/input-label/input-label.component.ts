import { Component, EventEmitter, Input, Output } from '@angular/core'

@Component({
  selector: 'app-input-label',
  templateUrl: './input-label.component.html',
  styleUrls: ['./input-label.component.scss'],
})
export class InputLabelComponent {
  @Input() label!: string
  @Input() for?: string
  @Input() labelPosition?: 'top' | 'side'
  @Input() labelWidth?: string

  @Output() click = new EventEmitter<void>()

  get doesLabelContainsLineBreak() {
    return !!this.label && this.label.includes('\n')
  }

  readonly getLineBrokenLabel = (label: string) => {
    const idx = label.indexOf('\n')
    if (idx === -1) return [label, '']

    return [label.substring(0, idx), label.substring(idx + 1)]
  }

  readonly onClick = () => {
    this.click.emit()
  }
}
