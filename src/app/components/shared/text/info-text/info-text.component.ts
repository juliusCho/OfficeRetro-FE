import { Component, Input } from '@angular/core'
import { TextComponent } from '../text.component'

@Component({
  standalone: true,
  selector: 'app-info-text',
  templateUrl: './info-text.component.html',
  styleUrls: ['./info-text.component.scss'],
  imports: [TextComponent],
})
export class InfoTextComponent {
  @Input() style?: Record<string, string>
}
