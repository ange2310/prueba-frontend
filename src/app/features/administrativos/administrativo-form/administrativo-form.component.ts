import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdministrativoService } from '../../../core/services/administrativo.service';
import { fechaNoFutura } from 'src/app/shared/validators/fecha-no-futura.validator';
@Component({
  selector: 'app-administrativo-form',
  template: `
    <div class="form-container">
      <div class="header-section">
        <h2>{{ isEditing ? 'Editar Administrativo' : 'Nuevo Administrativo' }}</h2>
        <button mat-icon-button (click)="onCancel()" matTooltip="Volver">
          <mat-icon>arrow_back</mat-icon>
        </button>
      </div>

      <mat-card class="form-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>business_center</mat-icon>
            Información del Administrativo
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="administrativoForm" (ngSubmit)="onSubmit()">
            
            <div class="form-section">
              <h3>Información Personal</h3>
              
              <div class="form-row">
                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Nombre</mat-label>
                  <input matInput formControlName="nombre" placeholder="Ingrese el nombre">
                  <mat-error *ngIf="administrativoForm.get('nombre')?.invalid && administrativoForm.get('nombre')?.touched">
                    {{ getFieldError('nombre') }}
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Apellido</mat-label>
                  <input matInput formControlName="apellido" placeholder="Ingrese el apellido">
                  <mat-error *ngIf="administrativoForm.get('apellido')?.invalid && administrativoForm.get('apellido')?.touched">
                    {{ getFieldError('apellido') }}
                  </mat-error>
                </mat-form-field>
              </div>

              <div class="form-row">
                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Email</mat-label>
                  <input matInput type="email" formControlName="email" placeholder="correo@ejemplo.com">
                  <mat-icon matSuffix>email</mat-icon>
                  <mat-error *ngIf="administrativoForm.get('email')?.invalid && administrativoForm.get('email')?.touched">
                    {{ getFieldError('email') }}
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Teléfono</mat-label>
                  <input matInput type="tel" formControlName="telefono" placeholder="1234567890">
                  <mat-icon matSuffix>phone</mat-icon>
                  <mat-error *ngIf="administrativoForm.get('telefono')?.invalid && administrativoForm.get('telefono')?.touched">
                    {{ getFieldError('telefono') }}
                  </mat-error>
                </mat-form-field>
              </div>

              <div class="form-row">
                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Fecha de Nacimiento</mat-label>
                  <input matInput [matDatepicker]="picker" formControlName="fechaNacimiento" readonly>
                  <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                  <mat-datepicker #picker></mat-datepicker>
                  <mat-error *ngIf="administrativoForm.get('fechaNacimiento')?.invalid && administrativoForm.get('fechaNacimiento')?.touched">
                    {{ getFieldError('fechaNacimiento') }}
                  </mat-error>
                </mat-form-field>
              </div>
            </div>

            <mat-divider></mat-divider>

            <div class="form-section">
              <h3>Información Laboral</h3>
              
              <div class="form-row">
                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Cargo</mat-label>
                  <mat-select formControlName="cargo">
                    <mat-option *ngFor="let cargo of cargos" [value]="cargo">
                      {{ cargo }}
                    </mat-option>
                  </mat-select>
                  <mat-error *ngIf="administrativoForm.get('cargo')?.invalid && administrativoForm.get('cargo')?.touched">
                    {{ getFieldError('cargo') }}
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Departamento</mat-label>
                  <mat-select formControlName="departamento">
                    <mat-option *ngFor="let depto of departamentos" [value]="depto">
                      {{ depto }}
                    </mat-option>
                  </mat-select>
                  <mat-error *ngIf="administrativoForm.get('departamento')?.invalid && administrativoForm.get('departamento')?.touched">
                    {{ getFieldError('departamento') }}
                  </mat-error>
                </mat-form-field>
              </div>
            </div>

            <div class="form-actions">
              <button mat-button type="button" (click)="onCancel()" [disabled]="isLoading">
                Cancelar
              </button>
              
              <button mat-raised-button color="primary" type="submit" [disabled]="!administrativoForm.valid || isLoading">
                <mat-icon *ngIf="isLoading">hourglass_empty</mat-icon>
                {{ isLoading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear') }}
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styleUrls: ['../../../shared/styles/form-component.scss']
})
export class AdministrativoFormComponent implements OnInit {
  administrativoForm!: FormGroup;
  isEditing = false;
  isLoading = false;
  administrativoId?: number;

  cargos = [
    'Director',
    'Subdirector',
    'Coordinador Académico',
    'Secretario',
    'Tesorero',
    'Contador',
    'Bibliotecario',
    'Coordinador de Bienestar',
    'Asistente Administrativo',
    'Recepcionista',
    'Coordinador de Sistemas',
    'Psicólogo',
    'Trabajador Social'
  ];

  departamentos = [
    'Dirección',
    'Coordinación Académica',
    'Administración',
    'Recursos Humanos',
    'Contabilidad',
    'Biblioteca',
    'Bienestar Estudiantil',
    'Sistemas',
    'Psicología',
    'Trabajo Social',
    'Secretaría',
    'Servicios Generales'
  ];

  constructor(
    private fb: FormBuilder,
    private administrativoService: AdministrativoService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.checkEditMode();
  }

  private initForm(): void {
    this.administrativoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      fechaNacimiento: ['', [Validators.required, fechaNoFutura]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      cargo: ['', [Validators.required]],
      departamento: ['', [Validators.required]]
    });
  }

  private checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.administrativoId = +id;
      this.loadAdministrativo();
    }
  }

  private loadAdministrativo(): void {
    this.isLoading = true;
    this.administrativoService.getById(this.administrativoId!).subscribe({
      next: (administrativo) => {
        this.administrativoForm.patchValue({
          nombre: administrativo.nombre,
          apellido: administrativo.apellido,
          fechaNacimiento: administrativo.fechaNacimiento,
          email: administrativo.email,
          telefono: administrativo.telefono,
          cargo: administrativo.cargo,
          departamento: administrativo.departamento
        });
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.handleError('Error al cargar administrativo', error);
      }
    });
  }

  onSubmit(): void {
    if (this.administrativoForm.valid) {
      this.isLoading = true;
      
      const administrativoData = {
        ...this.administrativoForm.value,
        idPersona: this.isEditing ? this.administrativoId : undefined
      };

      if (this.isEditing) {
        this.updateAdministrativo(administrativoData);
      } else {
        this.createAdministrativo(administrativoData);
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private createAdministrativo(administrativoData: any): void {
    this.administrativoService.create(administrativoData).subscribe({
      next: () => {
        this.snackBar.open('Administrativo creado exitosamente', 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.router.navigate(['/administrativos']);
      },
      error: (error) => {
        this.isLoading = false;
        this.handleError('Error al crear administrativo', error);
      }
    });
  }

  private updateAdministrativo(administrativoData: any): void {
    this.administrativoService.update(this.administrativoId!, administrativoData).subscribe({
      next: () => {
        this.snackBar.open('Administrativo actualizado exitosamente', 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.router.navigate(['/administrativos']);
      },
      error: (error) => {
        this.isLoading = false;
        this.handleError('Error al actualizar administrativo', error);
      }
    });
  }

  private handleError(message: string, error?: any): void {
    let errorMessage = message;
    
    if (error?.error?.message) {
      errorMessage = error.error.message;
    }
    
    this.snackBar.open(errorMessage, 'Cerrar', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
    
    if (error?.status === 404) {
      this.router.navigate(['/administrativos']);
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.administrativoForm.controls).forEach(key => {
      const control = this.administrativoForm.get(key);
      control?.markAsTouched();
    });
  }

  onCancel(): void {
    this.router.navigate(['/administrativos']);
  }

  getFieldError(fieldName: string): string {
    const field = this.administrativoForm.get(fieldName);
    
    if (field?.hasError('required')) {
      return `${this.getFieldLabel(fieldName)} es obligatorio`;
    }
    
    if (field?.hasError('email')) {
      return 'Email debe ser válido';
    }
    
    if (field?.hasError('minlength')) {
      return `${this.getFieldLabel(fieldName)} debe tener al menos ${field.errors?.['minlength'].requiredLength} caracteres`;
    }
    
    if (field?.hasError('pattern')) {
      return 'Teléfono debe tener 10 dígitos';
    }
    
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      'nombre': 'Nombre',
      'apellido': 'Apellido',
      'fechaNacimiento': 'Fecha de nacimiento',
      'email': 'Email',
      'telefono': 'Teléfono',
      'cargo': 'Cargo',
      'departamento': 'Departamento'
    };
    return labels[fieldName] || fieldName;
  }
}