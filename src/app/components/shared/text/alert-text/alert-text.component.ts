import { Component, Input } from '@angular/core'
import { TextComponent } from '../text.component'

@Component({
  standalone: true,
  selector: 'app-alert-text',
  templateUrl: './alert-text.component.html',
  styleUrls: ['./alert-text.component.scss'],
  imports: [TextComponent],
})
export class AlertTextComponent {
  @Input() style?: Record<string, string>
}
