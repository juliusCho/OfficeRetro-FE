import { Component, Input } from '@angular/core'

@Component({
  standalone: true,
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
})
export class TooltipComponent {
  @Input() text!: string
}
