import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from '../../shared/material.module';

import { PersonasListComponent } from './personas-list/personas-list.component';
import { PersonaFormComponent } from './persona-form/persona-form.component';

const routes: Routes = [
  { path: '', component: PersonasListComponent },
  { path: 'edit/:id', component: PersonaFormComponent },
  { path: 'new', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    PersonasListComponent,
    PersonaFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule.forChild(routes)
  ]
})
export class PersonasModule { }