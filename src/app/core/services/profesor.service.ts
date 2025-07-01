import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseApiService } from './base-api.service';
import { Profesor } from '../../shared/models/profesor.model';

@Injectable({
  providedIn: 'root'
})
export class ProfesorService extends BaseApiService<Profesor> {
  constructor(http: HttpClient) {
    super(http, 'profesores');
  }
}