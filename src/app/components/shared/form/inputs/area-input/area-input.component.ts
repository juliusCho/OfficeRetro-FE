import { ChangeDetectionStrategy, Component } from '@angular/core'
import { SuperInputComponent } from '../inheritances/super-input.component'

@Component({
  selector: 'app-area-input',
  templateUrl: './area-input.component.html',
  styleUrls: ['./area-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AreaInputComponent extends SuperInputComponent<string> {}
