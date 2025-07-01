import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseApiService } from './base-api.service';
import { Estudiante } from '../../shared/models/estudiante.model';

@Injectable({
  providedIn: 'root'
})
export class EstudianteService extends BaseApiService<Estudiante> {
  constructor(http: HttpClient) {
    super(http, 'estudiantes');
  }
}