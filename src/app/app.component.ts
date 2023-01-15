import { Component, OnInit } from '@angular/core'
import { CssService } from './services/shared/css.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [CssService],
})
export class AppComponent implements OnInit {
  constructor(private readonly _cssService: CssService) {}

  ngOnInit(): void {
    this._cssService.loadSizes()
    this._cssService.loadColors()
  }

  readonly onActivate = () => {
    document.body.scrollTop = 0
  }
}
