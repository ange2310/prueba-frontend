import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProfesorService } from '../../../core/services/profesor.service';
import { fechaNoFutura } from 'src/app/shared/validators/fecha-no-futura.validator';

@Component({
  selector: 'app-profesor-form',
  template: `
    <div class="form-container">
      <div class="header-section">
        <h2>{{ isEditing ? 'Editar Profesor' : 'Nuevo Profesor' }}</h2>
        <button mat-icon-button (click)="onCancel()" matTooltip="Volver">
          <mat-icon>arrow_back</mat-icon>
        </button>
      </div>

      <mat-card class="form-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>person</mat-icon>
            Información del Profesor
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="profesorForm" (ngSubmit)="onSubmit()">
            
            <div class="form-section">
              <h3>Información Personal</h3>
              
              <div class="form-row">
                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Nombre</mat-label>
                  <input matInput formControlName="nombre" placeholder="Ingrese el nombre">
                  <mat-error *ngIf="profesorForm.get('nombre')?.invalid && profesorForm.get('nombre')?.touched">
                    {{ getFieldError('nombre') }}
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Apellido</mat-label>
                  <input matInput formControlName="apellido" placeholder="Ingrese el apellido">
                  <mat-error *ngIf="profesorForm.get('apellido')?.invalid && profesorForm.get('apellido')?.touched">
                    {{ getFieldError('apellido') }}
                  </mat-error>
                </mat-form-field>
              </div>

              <div class="form-row">
                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Email</mat-label>
                  <input matInput type="email" formControlName="email" placeholder="correo@ejemplo.com">
                  <mat-icon matSuffix>email</mat-icon>
                  <mat-error *ngIf="profesorForm.get('email')?.invalid && profesorForm.get('email')?.touched">
                    {{ getFieldError('email') }}
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Teléfono</mat-label>
                  <input matInput type="tel" formControlName="telefono" placeholder="1234567890">
                  <mat-icon matSuffix>phone</mat-icon>
                  <mat-error *ngIf="profesorForm.get('telefono')?.invalid && profesorForm.get('telefono')?.touched">
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
                  <mat-error *ngIf="profesorForm.get('fechaNacimiento')?.invalid && profesorForm.get('fechaNacimiento')?.touched">
                    {{ getFieldError('fechaNacimiento') }}
                  </mat-error>
                </mat-form-field>
              </div>
            </div>

            <mat-divider></mat-divider>

            <div class="form-section">
              <h3>Información Profesional</h3>
              
              <div class="form-row">
                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Especialidad</mat-label>
                  <mat-select formControlName="especialidad">
                    <mat-option *ngFor="let especialidad of especialidades" [value]="especialidad">
                      {{ especialidad }}
                    </mat-option>
                  </mat-select>
                  <mat-error *ngIf="profesorForm.get('especialidad')?.invalid && profesorForm.get('especialidad')?.touched">
                    {{ getFieldError('especialidad') }}
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Fecha de Contratación</mat-label>
                  <input matInput [matDatepicker]="picker2" formControlName="fechaContratacion" readonly>
                  <mat-datepicker-toggle matSuffix [for]="picker2"></mat-datepicker-toggle>
                  <mat-datepicker #picker2></mat-datepicker>
                  <mat-error *ngIf="profesorForm.get('fechaContratacion')?.invalid && profesorForm.get('fechaContratacion')?.touched">
                    {{ getFieldError('fechaContratacion') }}
                  </mat-error>
                </mat-form-field>
              </div>
            </div>

            <div class="form-actions">
              <button mat-button type="button" (click)="onCancel()" [disabled]="isLoading">
                Cancelar
              </button>
              
              <button mat-raised-button color="primary" type="submit" [disabled]="!profesorForm.valid || isLoading">
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
export class ProfesorFormComponent implements OnInit {
  profesorForm!: FormGroup;
  isEditing = false;
  isLoading = false;
  profesorId?: number;

  especialidades = [
    'Matemáticas',
    'Física',
    'Química',
    'Biología',
    'Historia',
    'Geografía',
    'Español',
    'Inglés',
    'Francés',
    'Educación Física',
    'Arte',
    'Música',
    'Informática',
    'Filosofía',
    'Ciencias Sociales'
  ];

  constructor(
    private fb: FormBuilder,
    private profesorService: ProfesorService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.checkEditMode();
  }

  private initForm(): void {
    this.profesorForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      fechaNacimiento: ['', [Validators.required, fechaNoFutura]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      especialidad: ['', [Validators.required]],
      fechaContratacion: ['', [Validators.required]]
    });
  }

  private checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.profesorId = +id;
      this.loadProfesor();
    }
  }

  private loadProfesor(): void {
    this.isLoading = true;
    this.profesorService.getById(this.profesorId!).subscribe({
      next: (profesor) => {
        this.profesorForm.patchValue({
          nombre: profesor.nombre,
          apellido: profesor.apellido,
          fechaNacimiento: profesor.fechaNacimiento,
          email: profesor.email,
          telefono: profesor.telefono,
          especialidad: profesor.especialidad,
          fechaContratacion: profesor.fechaContratacion
        });
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.handleError('Error al cargar profesor', error);
      }
    });
  }

  onSubmit(): void {
    if (this.profesorForm.valid) {
      this.isLoading = true;
      
      const profesorData = {
        ...this.profesorForm.value,
        idPersona: this.isEditing ? this.profesorId : undefined
      };

      if (this.isEditing) {
        this.updateProfesor(profesorData);
      } else {
        this.createProfesor(profesorData);
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private createProfesor(profesorData: any): void {
    this.profesorService.create(profesorData).subscribe({
      next: () => {
        this.snackBar.open('Profesor creado exitosamente', 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.router.navigate(['/profesores']);
      },
      error: (error) => {
        this.isLoading = false;
        this.handleError('Error al crear profesor', error);
      }
    });
  }

  private updateProfesor(profesorData: any): void {
    this.profesorService.update(this.profesorId!, profesorData).subscribe({
      next: () => {
        this.snackBar.open('Profesor actualizado exitosamente', 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.router.navigate(['/profesores']);
      },
      error: (error) => {
        this.isLoading = false;
        this.handleError('Error al actualizar profesor', error);
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
      this.router.navigate(['/profesores']);
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.profesorForm.controls).forEach(key => {
      const control = this.profesorForm.get(key);
      control?.markAsTouched();
    });
  }

  onCancel(): void {
    this.router.navigate(['/profesores']);
  }

  getFieldError(fieldName: string): string {
    const field = this.profesorForm.get(fieldName);
    
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
      'especialidad': 'Especialidad',
      'fechaContratacion': 'Fecha de contratación'
    };
    return labels[fieldName] || fieldName;
  }
}