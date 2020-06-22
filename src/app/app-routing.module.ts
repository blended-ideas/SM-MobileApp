import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {AuthGuard} from './services/routerGuards/auth-guard.service';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
    },
    {
        path: 'login',
        loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
    },
    {
        path: 'dashboard',
        loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardPageModule)
    },
    {
        path: 'product',
        loadChildren: () => import('./pages/product-list/product-list.module').then(m => m.ProductListPageModule)
    },
    {
        path: 'shift',
        loadChildren: () => import('./pages/shift-list/shift-list.module').then(m => m.ShiftListPageModule)
    },
    {
        path: 'profile',
        loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfilePageModule)
    },
    {
        path: 'change-password',
        loadChildren: () => import('./pages/change-password/change-password.module').then(m => m.ChangePasswordPageModule)
    },
    {
        path: 'create-product',
        loadChildren: () => import('./pages/create-product/create-product.module').then(m => m.CreateProductPageModule)
    },
    {
        path: 'create-product/:productId',
        loadChildren: () => import('./pages/create-product/create-product.module').then(m => m.CreateProductPageModule)
    },
    {
        path: 'create-shift',
        loadChildren: () => import('./pages/create-shift/create-shift.module').then(m => m.CreateShiftPageModule)
    },
    {
        path: 'create-shift/:shiftId',
        loadChildren: () => import('./pages/create-shift/create-shift.module').then(m => m.CreateShiftPageModule)
    },
    {
        path: 'view-shift/:shiftId',
        loadChildren: () => import('./pages/view-shift/view-shift.module').then(m => m.ViewShiftPageModule)
    },
    {
        path: 'view-product/:productId',
        loadChildren: () => import('./pages/view-product/view-product.module').then(m => m.ViewProductPageModule)
    },
    {
        path: 'margin',
        loadChildren: () => import('./pages/margin/margin.module').then(m => m.MarginPageModule)
    },
    {
        path: 'manage-users',
        loadChildren: () => import('./pages/manage-users/manage-users.module').then(m => m.ManageUsersPageModule)
    },
    {path: '**', redirectTo: '/login', pathMatch: 'full'},
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
    ],
    exports: [RouterModule],
    providers: [AuthGuard]
})
export class AppRoutingModule {
}
