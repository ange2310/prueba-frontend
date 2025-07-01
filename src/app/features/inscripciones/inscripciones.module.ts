import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from '../../shared/material.module';

import { InscripcionesListComponent } from './inscripciones-list/inscripciones-list.component';
import { InscripcionFormComponent } from './inscripcion-form/inscripcion-form.component';

const routes: Routes = [
  { path: '', component: InscripcionesListComponent },
  { path: 'new', component: InscripcionFormComponent },
  { path: 'edit/:id', component: InscripcionFormComponent }
];

@NgModule({
  declarations: [
    InscripcionesListComponent,
    InscripcionFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule.forChild(routes)
  ]
})
export class InscripcionesModule { }