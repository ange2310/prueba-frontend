import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseApiService } from './base-api.service';
import { Inscripcion } from '../../shared/models/inscripcion.model';

@Injectable({
  providedIn: 'root'
})
export class InscripcionService extends BaseApiService<Inscripcion> {
  constructor(http: HttpClient) {
    super(http, 'inscripciones');
  }
}