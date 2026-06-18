import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GovernanceComponent } from './governance.component';

@NgModule({
  declarations: [GovernanceComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      { path: '', component: GovernanceComponent }
    ])
  ],
  exports: [GovernanceComponent]
})
export class GovernanceModule { }
