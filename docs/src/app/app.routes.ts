import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'getting-started',
    loadComponent: () =>
      import('./pages/getting-started/getting-started').then((m) => m.GettingStarted),
  },
  {
    path: 'services',
    loadComponent: () => import('./pages/services/services').then((m) => m.Services),
  },
  {
    path: 'services/:id',
    loadComponent: () =>
      import('./pages/service-detail/service-detail').then((m) => m.ServiceDetail),
  },
  {
    path: 'tools',
    loadComponent: () => import('./pages/tools/tools').then((m) => m.Tools),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
