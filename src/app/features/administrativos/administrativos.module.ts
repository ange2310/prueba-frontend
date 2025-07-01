import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from '../../shared/material.module';

import { AdministrativosListComponent } from './administrativos-list/administrativos-list.component';
import { AdministrativoFormComponent } from './administrativo-form/administrativo-form.component';

const routes: Routes = [
  { path: '', component: AdministrativosListComponent },
  { path: 'new', component: AdministrativoFormComponent },
  { path: 'edit/:id', component: AdministrativoFormComponent }
];

@NgModule({
  declarations: [
    AdministrativosListComponent,
    AdministrativoFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule.forChild(routes)
  ]
})
export class AdministrativosModule { }