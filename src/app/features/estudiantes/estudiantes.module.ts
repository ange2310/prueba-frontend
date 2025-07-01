import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from '../../shared/material.module';

import { EstudiantesListComponent } from './estudiantes-list/estudiantes-list.component';
import { EstudianteFormComponent } from './estudiante-form/estudiante-form.component';

const routes: Routes = [
  { path: '', component: EstudiantesListComponent },
  { path: 'new', component: EstudianteFormComponent },
  { path: 'edit/:id', component: EstudianteFormComponent }
];

@NgModule({
  declarations: [
    EstudiantesListComponent,
    EstudianteFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule.forChild(routes)
  ]
})
export class EstudiantesModule { }