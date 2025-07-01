import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CursoService } from '../../../core/services/curso.service';
import { ProfesorService } from '../../../core/services/profesor.service';
import { Curso } from '../../../shared/models/curso.model';
import { Profesor } from '../../../shared/models/profesor.model';

@Component({
  selector: 'app-curso-form',
  template: `
    <div class="form-container">
      <div class="header-section">
        <h2>{{ isEditing ? 'Editar Curso' : 'Nuevo Curso' }}</h2>
        <button mat-icon-button (click)="onCancel()" matTooltip="Volver">
          <mat-icon>arrow_back</mat-icon>
        </button>
      </div>

      <mat-card class="form-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>book</mat-icon>
            Información del Curso
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="cursoForm" (ngSubmit)="onSubmit()">
            
            <div class="form-section">
              <div class="form-row">
                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Nombre del Curso</mat-label>
                  <input matInput formControlName="nombre" placeholder="Ej: Matemáticas I">
                  <mat-error *ngIf="cursoForm.get('nombre')?.invalid && cursoForm.get('nombre')?.touched">
                    Nombre es obligatorio
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Créditos</mat-label>
                  <input matInput type="number" formControlName="creditos" min="1" max="10">
                  <mat-error *ngIf="cursoForm.get('creditos')?.invalid && cursoForm.get('creditos')?.touched">
                    Créditos deben ser entre 1 y 10
                  </mat-error>
                </mat-form-field>
              </div>

              <div class="form-row">
                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Descripción</mat-label>
                  <textarea matInput formControlName="descripcion" rows="3" placeholder="Descripción del curso"></textarea>
                </mat-form-field>
              </div>

              <div class="form-row">
                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Profesor</mat-label>
                  <mat-select formControlName="idProfesor">
                    <mat-option value="">Sin asignar</mat-option>
                    <mat-option *ngFor="let profesor of profesores" [value]="profesor.idPersona">
                      {{ profesor.nombre }} {{ profesor.apellido }} - {{ profesor.especialidad }}
                    </mat-option>
                  </mat-select>
                </mat-form-field>
              </div>
            </div>

            <div class="form-actions">
              <button mat-button type="button" (click)="onCancel()" [disabled]="isLoading">
                Cancelar
              </button>
              
              <button mat-raised-button color="primary" type="submit" [disabled]="!cursoForm.valid || isLoading">
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
export class CursoFormComponent implements OnInit {
  cursoForm!: FormGroup;
  isEditing = false;
  isLoading = false;
  cursoId?: number;
  profesores: any[] = [];

  constructor(
    private fb: FormBuilder,
    private cursoService: CursoService,
    private profesorService: ProfesorService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadProfesores();
    this.checkEditMode();
  }

  private initForm(): void {
    this.cursoForm = this.fb.group({
      nombre: ['', [Validators.required]],
      descripcion: [''],
      creditos: ['', [Validators.required, Validators.min(1), Validators.max(10)]],
      idProfesor: ['']
    });
  }

  private loadProfesores(): void {
    this.profesorService.getAll().subscribe({
      next: (profesores) => {
        this.profesores = profesores;
      },
      error: () => {
        this.snackBar.open('Error al cargar profesores', 'Cerrar', { duration: 3000 });
      }
    });
  }

  private checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.cursoId = +id;
      this.loadCurso();
    }
  }

  private loadCurso(): void {
    this.isLoading = true;
    this.cursoService.getById(this.cursoId!).subscribe({
      next: (curso) => {
        this.cursoForm.patchValue({
          nombre: curso.nombre,
          descripcion: curso.descripcion,
          creditos: curso.creditos,
          idProfesor: curso.idProfesor
        });
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Error al cargar curso', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/cursos']);
      }
    });
  }

  onSubmit(): void {
    if (this.cursoForm.valid) {
      this.isLoading = true;
      const cursoData = this.cursoForm.value;

      // Si no hay profesor seleccionado, enviar null
      if (!cursoData.idProfesor) {
        cursoData.idProfesor = null;
      }

      const operation = this.isEditing 
        ? this.cursoService.update(this.cursoId!, cursoData)
        : this.cursoService.create(cursoData);

      operation.subscribe({
        next: () => {
          const message = this.isEditing ? 'Curso actualizado' : 'Curso creado';
          this.snackBar.open(`${message} exitosamente`, 'Cerrar', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/cursos']);
        },
        error: (error) => {
          this.isLoading = false;
          this.snackBar.open(error.error?.message || 'Error al guardar curso', 'Cerrar', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/cursos']);
  }
}