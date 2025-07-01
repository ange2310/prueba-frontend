import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EstudianteService } from '../../../core/services/estudiante.service';
import { Estudiante } from '../../../shared/models/estudiante.model';

@Component({
  selector: 'app-estudiante-form',
  templateUrl: './estudiante-form.component.html',
  styleUrls: ['./estudiante-form.component.scss']
})
export class EstudianteFormComponent implements OnInit {
  estudianteForm!: FormGroup;
  isEditing = false;
  isLoading = false;
  estudianteId?: number;

  grados = [
    'Preescolar',
    '1° Primaria',
    '2° Primaria', 
    '3° Primaria',
    '4° Primaria',
    '5° Primaria',
    '6° Secundaria',
    '7° Secundaria',
    '8° Secundaria',
    '9° Secundaria',
    '10° Secundaria',
    '11° Secundaria'
  ];

  constructor(
    private fb: FormBuilder,
    private estudianteService: EstudianteService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.checkEditMode();
  }

  private initForm(): void {
    this.estudianteForm = this.fb.group({
      // Datos de Persona
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      fechaNacimiento: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      
      // Datos específicos de Estudiante
      numeroMatricula: ['', [Validators.required, Validators.pattern(/^EST[0-9]{7}$/)]],
      grado: ['', [Validators.required]]
    });
  }

  private checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.estudianteId = +id;
      this.loadEstudiante();
    }
  }

  private loadEstudiante(): void {
    this.isLoading = true;
    this.estudianteService.getById(this.estudianteId!).subscribe({
      next: (estudiante) => {
        // Los datos ya vienen mapeados en el DTO con persona incluida
        this.estudianteForm.patchValue({
          nombre: estudiante.nombre,
          apellido: estudiante.apellido,
          fechaNacimiento: estudiante.fechaNacimiento,
          email: estudiante.email,
          telefono: estudiante.telefono,
          numeroMatricula: estudiante.numeroMatricula,
          grado: estudiante.grado
        });
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.handleError('Error al cargar estudiante', error);
      }
    });
  }

  onSubmit(): void {
    if (this.estudianteForm.valid) {
      this.isLoading = true;
      
      // Preparar los datos como un solo objeto
      const estudianteData = {
        ...this.estudianteForm.value,
        idPersona: this.isEditing ? this.estudianteId : undefined
      };

      if (this.isEditing) {
        this.updateEstudiante(estudianteData);
      } else {
        this.createEstudiante(estudianteData);
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private createEstudiante(estudianteData: any): void {
    this.estudianteService.create(estudianteData).subscribe({
      next: () => {
        this.snackBar.open('Estudiante creado exitosamente', 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.router.navigate(['/estudiantes']);
      },
      error: (error) => {
        this.isLoading = false;
        this.handleError('Error al crear estudiante', error);
      }
    });
  }

  private updateEstudiante(estudianteData: any): void {
    this.estudianteService.update(this.estudianteId!, estudianteData).subscribe({
      next: () => {
        this.snackBar.open('Estudiante actualizado exitosamente', 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.router.navigate(['/estudiantes']);
      },
      error: (error) => {
        this.isLoading = false;
        this.handleError('Error al actualizar estudiante', error);
      }
    });
  }

  private handleError(message: string, error?: any): void {
    let errorMessage = message;
    
    if (error?.error?.message) {
      errorMessage = error.error.message;
    } else if (error?.error?.details && error.error.details.length > 0) {
      errorMessage = error.error.details.join(', ');
    }
    
    this.snackBar.open(errorMessage, 'Cerrar', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
    
    if (error?.status === 404) {
      this.router.navigate(['/estudiantes']);
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.estudianteForm.controls).forEach(key => {
      const control = this.estudianteForm.get(key);
      control?.markAsTouched();
    });
  }

  onCancel(): void {
    this.router.navigate(['/estudiantes']);
  }

  generateMatricula(): void {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const matricula = `EST${year}${random}`;
    this.estudianteForm.patchValue({ numeroMatricula: matricula });
  }

  getFieldError(fieldName: string): string {
    const field = this.estudianteForm.get(fieldName);
    
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
      if (fieldName === 'telefono') {
        return 'Teléfono debe tener 10 dígitos';
      }
      if (fieldName === 'numeroMatricula') {
        return 'Formato debe ser EST2024001';
      }
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
      'numeroMatricula': 'Número de matrícula',
      'grado': 'Grado'
    };
    return labels[fieldName] || fieldName;
  }
}