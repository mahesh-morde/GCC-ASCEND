import { Routes } from '@angular/router';
import { ThemeToggleComponent } from './components/theme-toggle/theme-toggle.component';

export const routes: Routes = [
  {
    path: '',
    component: ThemeToggleComponent,
    children: [
      { path: '', redirectTo: 'awos', pathMatch: 'full' },
      {
        path: 'awos',
        loadChildren: () => import('./components/awos/awos.module').then(m => m.AwosModule)
      },
      {
        path: 'governance',
        loadChildren: () => import('./components/governance/governance.module').then(m => m.GovernanceModule)
      },
      {
        path: 'sentinel',
        loadChildren: () => import('./components/sentinel/sentinel.module').then(m => m.SentinelModule)
      }
    ]
  }
];

