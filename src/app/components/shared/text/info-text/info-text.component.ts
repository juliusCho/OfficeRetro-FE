import { Component, Input } from '@angular/core'

@Component({
  selector: 'app-info-text',
  templateUrl: './info-text.component.html',
  styleUrls: ['./info-text.component.scss'],
})
export class InfoTextComponent {
  @Input() style?: Record<string, string>
}
