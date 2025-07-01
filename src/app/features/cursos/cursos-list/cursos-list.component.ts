import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { CursoService } from '../../../core/services/curso.service';
import { Curso } from '../../../shared/models/curso.model';
import { ConfirmDeleteDialogComponent } from '../../../shared/components/confirm-delete-dialog/confirm-delete-dialog.component';

@Component({
  selector: 'app-cursos-list',
  template: `
    <div class="container">
      <div class="header-section">
        <h2>Gestión de Cursos</h2>
        <button mat-raised-button color="primary" (click)="newItem()">
          <mat-icon>add</mat-icon>
          Nuevo Curso
        </button>
      </div>

      <mat-card class="filter-card">
        <mat-card-content>
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>Buscar cursos</mat-label>
            <input matInput (keyup)="applyFilter($event)" placeholder="Nombre, descripción...">
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>
        </mat-card-content>
      </mat-card>

      <mat-card class="table-card">
        <mat-card-content>
          <div class="table-container">
            <table mat-table [dataSource]="dataSource" class="cursos-table">

              <ng-container matColumnDef="idCurso">
                <th mat-header-cell *matHeaderCellDef>ID</th>
                <td mat-cell *matCellDef="let curso">{{ curso.idCurso }}</td>
              </ng-container>

              <ng-container matColumnDef="nombre">
                <th mat-header-cell *matHeaderCellDef>Nombre</th>
                <td mat-cell *matCellDef="let curso">{{ curso.nombre }}</td>
              </ng-container>

              <ng-container matColumnDef="descripcion">
                <th mat-header-cell *matHeaderCellDef>Descripción</th>
                <td mat-cell *matCellDef="let curso">{{ curso.descripcion || 'N/A' }}</td>
              </ng-container>

              <ng-container matColumnDef="creditos">
                <th mat-header-cell *matHeaderCellDef>Créditos</th>
                <td mat-cell *matCellDef="let curso">
                  <span class="creditos-chip">{{ curso.creditos }}</span>
                </td>
              </ng-container>

              <ng-container matColumnDef="profesor">
                <th mat-header-cell *matHeaderCellDef>Profesor</th>
                <td mat-cell *matCellDef="let curso">{{ curso.profesor?.persona?.nombre || 'No asignado' }}</td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Acciones</th>
                <td mat-cell *matCellDef="let curso">
                  <button mat-icon-button color="primary" (click)="editItem(curso)" matTooltip="Editar">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="deleteItemConfirm(curso)" matTooltip="Eliminar">
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
              <mat-icon>book</mat-icon>
              <p>No se encontraron cursos</p>
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
  styleUrls: ['../../../shared/styles/list-component.scss']
})
export class CursosListComponent implements OnInit {
  displayedColumns = ['idCurso', 'nombre', 'descripcion', 'creditos', 'profesor', 'actions'];
  dataSource = new MatTableDataSource<Curso>([]);
  isLoading = false;
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;
  sortBy = 'idCurso';
  sortDirection = 'asc';

  constructor(
    private cursoService: CursoService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.cursoService.getAllPaged(
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
        this.showError('Error al cargar cursos');
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  deleteItemConfirm(curso: Curso): void {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '300px',
      data: { 
        title: 'Eliminar Curso',
        message: `¿Está seguro de eliminar el curso ${curso.nombre}?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cursoService.delete(curso.idCurso!).subscribe({
          next: () => {
            this.showSuccess('Curso eliminado exitosamente');
            this.loadData();
          },
          error: () => {
            this.showError('Error al eliminar curso');
          }
        });
      }
    });
  }

  editItem(curso: Curso): void {
    this.router.navigate(['/cursos/edit', curso.idCurso]);
  }

  newItem(): void {
    this.router.navigate(['/cursos/new']);
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

