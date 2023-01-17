import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { LoadingComponent } from './loading.component'
import { TextLoadingComponent } from './text-loading/text-loading.component'

export const declarations = [LoadingComponent, TextLoadingComponent]

@NgModule({
  declarations,
  imports: [CommonModule],
  exports: declarations,
})
export class LoadingModule {}
