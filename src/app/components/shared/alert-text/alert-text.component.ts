import { Component, Input } from '@angular/core'

@Component({
  selector: 'app-alert-text',
  templateUrl: './alert-text.component.html',
  styleUrls: ['./alert-text.component.scss'],
})
export class AlertTextComponent {
  @Input() text = ''
}
