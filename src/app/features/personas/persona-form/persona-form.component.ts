import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PersonaService } from '../../../core/services/persona.service';
import { Persona } from '../../../shared/models/persona.model';

@Component({
  selector: 'app-persona-form',
  templateUrl: './persona-form.component.html',
  styleUrls: ['./persona-form.component.scss']
})
export class PersonaFormComponent implements OnInit {
  personaForm!: FormGroup;
  isEditing = false;
  isLoading = false;
  personaId?: number;

  constructor(
    private fb: FormBuilder,
    private personaService: PersonaService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.checkEditMode();
  }

  private initForm(): void {
    this.personaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      fechaNacimiento: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]]
    });
  }

  private checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.personaId = +id;
      this.loadPersona();
    }
  }

  private loadPersona(): void {
    this.isLoading = true;
    this.personaService.getById(this.personaId!).subscribe({
      next: (persona) => {
        this.personaForm.patchValue(persona);
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open('Error al cargar persona', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        this.router.navigate(['/personas']);
      }
    });
  }

  onSubmit(): void {
    if (this.personaForm.valid) {
      this.isLoading = true;
      const personaData: Persona = this.personaForm.value;

      const operation = this.isEditing 
        ? this.personaService.update(this.personaId!, personaData)
        : this.personaService.create(personaData);

      operation.subscribe({
        next: (response) => {
          const message = this.isEditing ? 'Persona actualizada' : 'Persona creada';
          this.snackBar.open(`${message} exitosamente`, 'Cerrar', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/personas']);
        },
        error: (error) => {
          this.isLoading = false;
          let errorMessage = 'Error al guardar persona';
          
          if (error.error?.message) {
            errorMessage = error.error.message;
          }
          
          this.snackBar.open(errorMessage, 'Cerrar', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.personaForm.controls).forEach(key => {
      const control = this.personaForm.get(key);
      control?.markAsTouched();
    });
  }

  onCancel(): void {
    this.router.navigate(['/personas']);
  }

  getFieldError(fieldName: string): string {
    const field = this.personaForm.get(fieldName);
    
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
      'telefono': 'Teléfono'
    };
    return labels[fieldName] || fieldName;
  }
}