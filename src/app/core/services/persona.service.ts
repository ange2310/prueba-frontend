import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseApiService } from './base-api.service';
import { Persona } from '../../shared/models/persona.model';

@Injectable({
  providedIn: 'root'
})
export class PersonaService extends BaseApiService<Persona> {
  constructor(http: HttpClient) {
    super(http, 'personas');
  }
}



