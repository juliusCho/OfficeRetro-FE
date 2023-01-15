import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, Input } from '@angular/core'

@Component({
  standalone: true,
  selector: 'app-text-loading',
  templateUrl: './text-loading.component.html',
  styleUrls: ['./text-loading.component.scss'],
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextLoadingComponent {
  @Input() type: 'title' | 'text' = 'text'
  @Input() isLoading = true
}
