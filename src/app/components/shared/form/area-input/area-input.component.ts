import { ChangeDetectionStrategy, Component } from '@angular/core'
import { BaseInputComponent } from '../shared/base/base-input/base-input.component'

@Component({
  selector: 'app-area-input',
  templateUrl: './area-input.component.html',
  styleUrls: ['./area-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AreaInputComponent extends BaseInputComponent {}
