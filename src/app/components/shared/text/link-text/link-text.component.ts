import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'
import { TextComponent } from '../text.component'

@Component({
  standalone: true,
  selector: 'app-link-text',
  templateUrl: './link-text.component.html',
  styleUrls: ['./link-text.component.scss'],
  imports: [TextComponent, CommonModule],
})
export class LinkTextComponent {
  @Input() link!: string
  @Input() style?: Record<string, string>

  get validLink() {
    if (
      this.link.match(
        /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi,
      )
    ) {
      return this.link.includes('http') ? this.link : `https://${this.link}`
    }

    return false
  }
}
