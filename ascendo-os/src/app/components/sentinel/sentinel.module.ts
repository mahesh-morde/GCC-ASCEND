import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SentinelComponent } from './sentinel.component';

@NgModule({
  declarations: [SentinelComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      { path: '', component: SentinelComponent }
    ])
  ],
  exports: [SentinelComponent]
})
export class SentinelModule { }
