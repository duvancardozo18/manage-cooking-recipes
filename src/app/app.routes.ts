import { Routes } from '@angular/router';
import { routeLoggingGuard, routeExitLoggingGuard } from './core/guards/route-logging.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/listPage', pathMatch: 'full' },

    {
        path: 'listPage',
        loadComponent: () => import('./components/list-page/list-page.component').then(m => m.ListPageComponent),
        canActivate: [routeLoggingGuard],
        canDeactivate: [routeExitLoggingGuard]
    },
    {
        path: 'formPage',
        loadComponent: () => import('./components/form-page/form-page.component').then(m => m.FormPageComponent),
        canActivate: [routeLoggingGuard],
        canDeactivate: [routeExitLoggingGuard]
    },

    {
        path: 'recipes',
        loadComponent: () => import('./components/recipe-list/recipe-list.component').then(m => m.RecipeListComponent),
        canActivate: [routeLoggingGuard],
        canDeactivate: [routeExitLoggingGuard]
    },
    {
        path: 'recipes/new',
        loadComponent: () => import('./components/recipe-form/recipe-form.component').then(m => m.RecipeFormComponent),
        canActivate: [routeLoggingGuard],
        canDeactivate: [routeExitLoggingGuard]
    },
    {
        path: 'recipes/:id',
        loadComponent: () => import('./components/recipe-detail/recipe-detail.component').then(m => m.RecipeDetailComponent),
        canActivate: [routeLoggingGuard],
        canDeactivate: [routeExitLoggingGuard]
    },
    {
        path: 'recipes/:id/edit',
        loadComponent: () => import('./components/recipe-form/recipe-form.component').then(m => m.RecipeFormComponent),
        canActivate: [routeLoggingGuard],
        canDeactivate: [routeExitLoggingGuard]
    },

    { path: '**', redirectTo: '/listPage' }
];
