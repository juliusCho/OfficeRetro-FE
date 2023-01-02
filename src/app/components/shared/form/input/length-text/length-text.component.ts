import { ChangeDetectionStrategy, Component, Input } from '@angular/core'

@Component({
  selector: 'app-length-text',
  templateUrl: './length-text.component.html',
  styleUrls: ['./length-text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LengthTextComponent {
  @Input() length = 0
  @Input() maxLength = 50
}
