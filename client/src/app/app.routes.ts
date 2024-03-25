import { Routes } from '@angular/router';
import { SigninComponent } from './pages/signin/signin.component';
import { SignupComponent } from './pages/signup/signup.component';

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
        path:'**',
        redirectTo: 'signin',
        pathMatch: 'full'
    }
];
