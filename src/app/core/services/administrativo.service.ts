import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseApiService } from './base-api.service';
import { Administrativo } from '../../shared/models/administrativo.model';

@Injectable({
  providedIn: 'root'
})
export class AdministrativoService extends BaseApiService<Administrativo> {
  constructor(http: HttpClient) {
    super(http, 'administrativos');
  }
}