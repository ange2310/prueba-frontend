import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { LoginGuard } from './core/guards/login.guard';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { LoginComponent } from './features/auth/login/login.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoginGuard]
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'personas',
        loadChildren: () => import('./features/personas/personas.module').then(m => m.PersonasModule)
      },
      {
        path: 'estudiantes',
        loadChildren: () => import('./features/estudiantes/estudiantes.module').then(m => m.EstudiantesModule)
      },
      {
        path: 'profesores',
        loadChildren: () => import('./features/profesores/profesores.module').then(m => m.ProfesoresModule)
      },
      {
        path: 'administrativos',
        loadChildren: () => import('./features/administrativos/administrativos.module').then(m => m.AdministrativosModule)
      },
      {
        path: 'cursos',
        loadChildren: () => import('./features/cursos/cursos.module').then(m => m.CursosModule)
      },
      {
        path: 'inscripciones',
        loadChildren: () => import('./features/inscripciones/inscripciones.module').then(m => m.InscripcionesModule)
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }