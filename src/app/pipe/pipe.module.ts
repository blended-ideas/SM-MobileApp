import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InrPipe} from './inr.pipe';


@NgModule({
  declarations: [
    InrPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    InrPipe
  ]
})
export class PipeModule {
}
