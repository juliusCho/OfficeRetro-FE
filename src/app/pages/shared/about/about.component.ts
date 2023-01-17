import { Component } from '@angular/core'
import { FontWeight } from 'src/app/models/client-specs/shared/css-specs'
import { CssService } from 'src/app/services/shared/css.service'

@Component({
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent {
  get firstParagraphStyle() {
    return { 'font-size': this._cssService.getSize('unit-6') ?? '' }
  }

  get listTextStyle() {
    return { 'font-weight': String(700 as FontWeight) }
  }

  constructor(private readonly _cssService: CssService) {}
}
