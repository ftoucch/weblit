import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ResearchComponent } from './pages/dashboard/research/research.component';
import { HomeComponent } from './pages/dashboard/home/home.component';
export const routes: Routes = [
    {
        path: 'signup',
        loadComponent:  () => import('./pages/signup/signup.component').then((c) => c.SignupComponent),
    },
    {
        path: 'signin',
        loadComponent:  () => import('./pages/signin/signin.component').then((c) => c.SigninComponent),
    }, 

    {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then((c) => c.DashboardComponent),
        children: [
            {
                path:'',
                loadComponent: () => import('./pages/dashboard/home/home.component').then((c)=> c.HomeComponent)
            },
            {
                path:'research',
                loadComponent: () => import('./pages/dashboard/research/research.component').then((c)=> c.ResearchComponent)
            },
            {
                path:'documents',
                loadComponent: () => import('./pages/dashboard/documents/documents.component').then((c) => c.DocumentsComponent)
            },
            {
                path: 'settings',
                loadComponent: () => import ('./pages/dashboard/settings/settings.component').then((c) => c.SettingsComponent)
            },
            {
                path: 'profile',
                loadComponent: () => import ('./pages/dashboard/profile/profile.component').then((c)=> c.ProfileComponent)
            }
        ]
    },
    {
        path:'**',
        redirectTo: 'signin',
        pathMatch: 'full'
    }
];
