import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InscripcionService } from '../../../core/services/inscripcion.service';
import { EstudianteService } from '../../../core/services/estudiante.service';
import { CursoService } from '../../../core/services/curso.service';

@Component({
  selector: 'app-inscripcion-form',
  template: `
    <div class="form-container">
      <div class="header-section">
        <h2>{{ isEditing ? 'Editar Inscripción' : 'Nueva Inscripción' }}</h2>
        <button mat-icon-button (click)="onCancel()" matTooltip="Volver">
          <mat-icon>arrow_back</mat-icon>
        </button>
      </div>

      <mat-card class="form-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>assignment</mat-icon>
            Información de la Inscripción
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="inscripcionForm" (ngSubmit)="onSubmit()">
            
            <div class="form-section">
              <div class="form-row">
                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Estudiante</mat-label>
                  <mat-select formControlName="idEstudiante">
                    <mat-option *ngFor="let estudiante of estudiantes" [value]="estudiante.idPersona">
                      {{ estudiante.nombre }} {{ estudiante.apellido }} - {{ estudiante.numeroMatricula }}
                    </mat-option>
                  </mat-select>
                  <mat-error *ngIf="inscripcionForm.get('idEstudiante')?.invalid && inscripcionForm.get('idEstudiante')?.touched">
                    Estudiante es obligatorio
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Curso</mat-label>
                  <mat-select formControlName="idCurso">
                    <mat-option *ngFor="let curso of cursos" [value]="curso.idCurso">
                      {{ curso.nombre }} - {{ curso.creditos }} créditos
                    </mat-option>
                  </mat-select>
                  <mat-error *ngIf="inscripcionForm.get('idCurso')?.invalid && inscripcionForm.get('idCurso')?.touched">
                    Curso es obligatorio
                  </mat-error>
                </mat-form-field>
              </div>

              <div class="form-row">
                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Fecha de Inscripción</mat-label>
                  <input matInput [matDatepicker]="picker" formControlName="fechaInscripcion" readonly>
                  <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                  <mat-datepicker #picker></mat-datepicker>
                  <mat-error *ngIf="inscripcionForm.get('fechaInscripcion')?.invalid && inscripcionForm.get('fechaInscripcion')?.touched">
                    Fecha de inscripción es obligatoria
                  </mat-error>
                </mat-form-field>
              </div>
            </div>

            <div class="form-actions">
              <button mat-button type="button" (click)="onCancel()" [disabled]="isLoading">
                Cancelar
              </button>
              
              <button mat-raised-button color="primary" type="submit" [disabled]="!inscripcionForm.valid || isLoading">
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
export class InscripcionFormComponent implements OnInit {
  inscripcionForm!: FormGroup;
  isEditing = false;
  isLoading = false;
  inscripcionId?: number;
  estudiantes: any[] = [];
  cursos: any[] = [];

  constructor(
    private fb: FormBuilder,
    private inscripcionService: InscripcionService,
    private estudianteService: EstudianteService,
    private cursoService: CursoService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadData();
    this.checkEditMode();
  }

  private initForm(): void {
    this.inscripcionForm = this.fb.group({
      idEstudiante: ['', [Validators.required]],
      idCurso: ['', [Validators.required]],
      fechaInscripcion: [new Date(), [Validators.required]]
    });
  }

  private loadData(): void {
    // Cargar estudiantes
    this.estudianteService.getAll().subscribe({
      next: (estudiantes) => {
        this.estudiantes = estudiantes;
      },
      error: () => {
        this.snackBar.open('Error al cargar estudiantes', 'Cerrar', { duration: 3000 });
      }
    });

    // Cargar cursos
    this.cursoService.getAll().subscribe({
      next: (cursos) => {
        this.cursos = cursos;
      },
      error: () => {
        this.snackBar.open('Error al cargar cursos', 'Cerrar', { duration: 3000 });
      }
    });
  }

  private checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.inscripcionId = +id;
      this.loadInscripcion();
    }
  }

  private loadInscripcion(): void {
    this.isLoading = true;
    this.inscripcionService.getById(this.inscripcionId!).subscribe({
      next: (inscripcion) => {
        this.inscripcionForm.patchValue({
          idEstudiante: inscripcion.idEstudiante,
          idCurso: inscripcion.idCurso,
          fechaInscripcion: inscripcion.fechaInscripcion
        });
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Error al cargar inscripción', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/inscripciones']);
      }
    });
  }

  onSubmit(): void {
    if (this.inscripcionForm.valid) {
      this.isLoading = true;
      const inscripcionData = this.inscripcionForm.value;

      const operation = this.isEditing 
        ? this.inscripcionService.update(this.inscripcionId!, inscripcionData)
        : this.inscripcionService.create(inscripcionData);

      operation.subscribe({
        next: () => {
          const message = this.isEditing ? 'Inscripción actualizada' : 'Inscripción creada';
          this.snackBar.open(`${message} exitosamente`, 'Cerrar', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/inscripciones']);
        },
        error: (error) => {
          this.isLoading = false;
          this.snackBar.open(error.error?.message || 'Error al guardar inscripción', 'Cerrar', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/inscripciones']);
  }
}