import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

@Component({
  selector: 'app-inquiry-list',
  templateUrl: './inquiry-list.component.html',
  styleUrls: ['./inquiry-list.component.scss'],
})
export class InquiryListComponent implements OnInit {
  constructor(private readonly _router: Router) {}

  ngOnInit() {
    this._router.navigateByUrl('error')
  }
}
