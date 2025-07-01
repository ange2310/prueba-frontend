import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { InscripcionService } from '../../../core/services/inscripcion.service';
import { Inscripcion } from '../../../shared/models/inscripcion.model';
import { ConfirmDeleteDialogComponent } from '../../../shared/components/confirm-delete-dialog/confirm-delete-dialog.component';

@Component({
  selector: 'app-inscripciones-list',
  template: `
    <div class="container">
      <div class="header-section">
        <h2>Gestión de Inscripciones</h2>
        <button mat-raised-button color="primary" (click)="newItem()">
          <mat-icon>add</mat-icon>
          Nueva Inscripción
        </button>
      </div>

      <mat-card class="filter-card">
        <mat-card-content>
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>Buscar inscripciones</mat-label>
            <input matInput (keyup)="applyFilter($event)" placeholder="Estudiante, curso...">
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>
        </mat-card-content>
      </mat-card>

      <mat-card class="table-card">
        <mat-card-content>
          <div class="table-container">
            <table mat-table [dataSource]="dataSource" class="inscripciones-table">

              <ng-container matColumnDef="idInscripcion">
                <th mat-header-cell *matHeaderCellDef>ID</th>
                <td mat-cell *matCellDef="let inscripcion">{{ inscripcion.idInscripcion }}</td>
              </ng-container>

              <ng-container matColumnDef="estudiante">
                <th mat-header-cell *matHeaderCellDef>Estudiante</th>
                <td mat-cell *matCellDef="let inscripcion">
                  <div class="estudiante-info">
                    <strong>{{ inscripcion.estudiante?.persona?.nombre }} {{ inscripcion.estudiante?.persona?.apellido }}</strong>
                    <small>{{ inscripcion.estudiante?.numeroMatricula }}</small>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="curso">
                <th mat-header-cell *matHeaderCellDef>Curso</th>
                <td mat-cell *matCellDef="let inscripcion">
                  <div class="curso-info">
                    <strong>{{ inscripcion.curso?.nombre }}</strong>
                    <span class="creditos-badge">{{ inscripcion.curso?.creditos }} créditos</span>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="fechaInscripcion">
                <th mat-header-cell *matHeaderCellDef>Fecha Inscripción</th>
                <td mat-cell *matCellDef="let inscripcion">{{ inscripcion.fechaInscripcion | date:'dd/MM/yyyy' }}</td>
              </ng-container>

              <ng-container matColumnDef="estado">
                <th mat-header-cell *matHeaderCellDef>Estado</th>
                <td mat-cell *matCellDef="let inscripcion">
                  <span class="estado-activo">Activa</span>
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Acciones</th>
                <td mat-cell *matCellDef="let inscripcion">
                  <button mat-icon-button color="primary" (click)="editItem(inscripcion)" matTooltip="Editar">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="deleteItemConfirm(inscripcion)" matTooltip="Eliminar">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>

            <div *ngIf="isLoading" class="loading-container">
              <mat-spinner diameter="50"></mat-spinner>
            </div>

            <div *ngIf="!isLoading && dataSource.data.length === 0" class="no-data">
              <mat-icon>assignment</mat-icon>
              <p>No se encontraron inscripciones</p>
            </div>
          </div>

          <mat-paginator 
            [length]="totalElements"
            [pageSize]="pageSize"
            [pageIndex]="pageIndex"
            [pageSizeOptions]="[5, 10, 25, 50]"
            (page)="onPageChange($event)"
            showFirstLastButtons>
          </mat-paginator>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container {
      .inscripciones-table {
        .estudiante-info,
        .curso-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
          
          strong {
            font-weight: 500;
            color: #333;
          }
          
          small {
            font-size: 11px;
            color: #666;
            background: #f0f0f0;
            padding: 2px 6px;
            border-radius: 8px;
            align-self: flex-start;
          }
        }
        
        .creditos-badge {
          font-size: 11px;
          background: #e3f2fd;
          color: #1976d2;
          padding: 2px 8px;
          border-radius: 12px;
          font-weight: 500;
        }
        
        .estado-activo {
          background: #e8f5e8;
          color: #2e7d32;
          padding: 4px 12px;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 500;
        }
      }
    }
  `],
  styleUrls: ['../../../shared/styles/list-component.scss']
})
export class InscripcionesListComponent implements OnInit {
  displayedColumns = ['idInscripcion', 'estudiante', 'curso', 'fechaInscripcion', 'estado', 'actions'];
  dataSource = new MatTableDataSource<Inscripcion>([]);
  isLoading = false;
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;
  sortBy = 'idInscripcion';
  sortDirection = 'asc';

  constructor(
    private inscripcionService: InscripcionService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.inscripcionService.getAllPaged(
      this.pageIndex, 
      this.pageSize, 
      this.sortBy, 
      this.sortDirection
    ).subscribe({
      next: (response) => {
        this.dataSource.data = response.content;
        this.totalElements = response.totalElements;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.showError('Error al cargar inscripciones');
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  deleteItemConfirm(inscripcion: Inscripcion): void {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '300px',
      data: { 
        title: 'Eliminar Inscripción',
        message: '¿Está seguro de eliminar esta inscripción?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.inscripcionService.delete(inscripcion.idInscripcion!).subscribe({
          next: () => {
            this.showSuccess('Inscripción eliminada exitosamente');
            this.loadData();
          },
          error: () => {
            this.showError('Error al eliminar inscripción');
          }
        });
      }
    });
  }

  editItem(inscripcion: Inscripcion): void {
    this.router.navigate(['/inscripciones/edit', inscripcion.idInscripcion]);
  }

  newItem(): void {
    this.router.navigate(['/inscripciones/new']);
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  showSuccess(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  showError(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: ['error-snackbar']
    });
  }
}