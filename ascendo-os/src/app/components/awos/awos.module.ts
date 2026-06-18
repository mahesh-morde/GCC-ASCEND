import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AwosComponent } from './awos.component';

@NgModule({
  declarations: [AwosComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      { path: '', component: AwosComponent }
    ])
  ],
  exports: [AwosComponent]
})
export class AwosModule { }
