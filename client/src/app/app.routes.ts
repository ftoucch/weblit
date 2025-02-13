import { Routes } from '@angular/router';
import { guardGuard } from './auth/guard.guard';
export const routes: Routes = [
  {
    path: 'signup',
    loadComponent: () =>
      import('./pages/signup/signup.component').then((c) => c.SignupComponent),
  },
  {
    path: 'signin',
    loadComponent: () =>
      import('./pages/signin/signin.component').then((c) => c.SigninComponent),
  },

  {
    path: 'dashboard',
    canActivate: [guardGuard],
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then(
        (c) => c.DashboardComponent
      ),
    children: [
      {
        path: '',
        data: {
          title: 'Reviews',
        },
        loadComponent: () =>
          import('./pages/dashboard/home/home.component').then(
            (c) => c.HomeComponent
          ),
      },
      {
        path: 'research',
        data: {
          title: 'Systematic Reviews',
        },
        loadComponent: () =>
          import('./pages/dashboard/research/research.component').then(
            (c) => c.ResearchComponent
          ),
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./pages/dashboard/research/home/home.component').then(
                (c) => c.HomeComponent
              ),
          },
          {
            path: ':id',
            loadComponent: () =>
              import(
                './pages/dashboard/research/details/details.component'
              ).then((c) => c.DetailsComponent),
          },
        ],
      },
      {
        path: 'documents',
        data: {
          title: 'Documents',
        },
        loadComponent: () =>
          import('./pages/dashboard/documents/documents.component').then(
            (c) => c.DocumentsComponent
          ),
      },
      {
        path: 'settings',
        data: {
          title: 'Settings',
        },
        loadComponent: () =>
          import('./pages/dashboard/settings/settings.component').then(
            (c) => c.SettingsComponent
          ),
      },
      {
        path: 'profile',
        data: {
          title: 'Profile',
        },
        loadComponent: () =>
          import('./pages/dashboard/profile/profile.component').then(
            (c) => c.ProfileComponent
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'signin',
    pathMatch: 'full',
  },
];
