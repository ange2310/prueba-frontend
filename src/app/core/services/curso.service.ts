import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseApiService } from './base-api.service';
import { Curso } from '../../shared/models/curso.model';

@Injectable({
  providedIn: 'root'
})
export class CursoService extends BaseApiService<Curso> {
  constructor(http: HttpClient) {
    super(http, 'cursos');
  }
}