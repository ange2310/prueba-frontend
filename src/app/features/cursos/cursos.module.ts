import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from '../../shared/material.module';

import { CursosListComponent } from './cursos-list/cursos-list.component';
import { CursoFormComponent } from './curso-form/curso-form.component';

const routes: Routes = [
  { path: '', component: CursosListComponent },
  { path: 'new', component: CursoFormComponent },
  { path: 'edit/:id', component: CursoFormComponent }
];

@NgModule({
  declarations: [
    CursosListComponent,
    CursoFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule.forChild(routes)
  ]
})
export class CursosModule { }