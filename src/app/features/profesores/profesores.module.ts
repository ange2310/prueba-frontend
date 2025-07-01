import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from '../../shared/material.module';

import { ProfesoresListComponent } from './profesores-list/profesores-list.component';
import { ProfesorFormComponent } from './profesor-form/profesor-form.component';

const routes: Routes = [
  { path: '', component: ProfesoresListComponent },
  { path: 'new', component: ProfesorFormComponent },
  { path: 'edit/:id', component: ProfesorFormComponent }
];

@NgModule({
  declarations: [
    ProfesoresListComponent,
    ProfesorFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule.forChild(routes)
  ]
})
export class ProfesoresModule { }