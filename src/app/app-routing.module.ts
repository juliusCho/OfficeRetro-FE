import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AuthGuard } from './guards/auth.guard'
import { PreloadingStrategyService } from './services/shared/preloading-strategy.service'

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'error',
    data: { preload: true, loadAfterSeconds: 1 },
    loadChildren: () =>
      import('./pages/shared/error/error.module').then((m) => m.ErrorModule),
  },
  {
    path: 'about',
    loadChildren: () =>
      import('./pages/shared/about/about.module').then((m) => m.AboutModule),
  },
  {
    path: 'login',
    data: { preload: true },
    loadChildren: () =>
      import('./pages/init/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'pw-reset',
    loadChildren: () =>
      import(
        './pages/init/password-reset-request/password-reset-request.module'
      ).then((m) => m.PasswordResetRequestModule),
  },
  {
    path: 'signup',
    loadChildren: () =>
      import('./pages/init/signup/signup.module').then((m) => m.SignupModule),
  },
  {
    path: 'inquiries',
    loadChildren: () =>
      import('./pages/inquiry/inquiry.module').then((m) => m.InquiryModule),
  },
  {
    path: 'profiles',
    data: { preload: true, loadAfterSeconds: 2 },
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./pages/profile/profile.module').then((m) => m.ProfileModule),
  },
  {
    path: '**',
    loadChildren: () =>
      import('./pages/shared/not-found/not-found.module').then(
        (m) => m.NotFoundModule,
      ),
  },
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadingStrategyService,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
