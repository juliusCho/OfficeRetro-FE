import { Component, Input } from '@angular/core'

@Component({
  selector: 'app-length-text',
  templateUrl: './length-text.component.html',
  styleUrls: ['./length-text.component.scss'],
})
export class LengthTextComponent {
  @Input() length?: number = 0
  @Input() maxLength?: number = 50
  @Input() flexStart?: boolean = false
}
