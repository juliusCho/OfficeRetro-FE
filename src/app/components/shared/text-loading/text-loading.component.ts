import { Component, Input } from '@angular/core'

@Component({
  selector: 'app-text-loading',
  templateUrl: './text-loading.component.html',
  styleUrls: ['./text-loading.component.scss'],
})
export class TextLoadingComponent {
  @Input() type: 'title' | 'text' = 'text'
  @Input() isLoading = true
}
