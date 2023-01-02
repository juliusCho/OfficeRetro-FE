import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  selector: 'app-centre-title',
  templateUrl: './centre-title.component.html',
  styleUrls: ['./centre-title.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CentreTitleComponent {}
