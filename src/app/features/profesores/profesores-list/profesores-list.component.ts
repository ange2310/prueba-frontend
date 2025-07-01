import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator'; 
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ProfesorService } from '../../../core/services/profesor.service';
import { ConfirmDeleteDialogComponent } from '../../../shared/components/confirm-delete-dialog/confirm-delete-dialog.component';

@Component({
  selector: 'app-profesores-list',
  template: `
    <div class="profesores-container">
      <div class="header-section">
        <h2>Gestión de Profesores</h2>
        <button mat-raised-button color="primary" (click)="newProfesor()">
          <mat-icon>add</mat-icon>
          Nuevo Profesor
        </button>
      </div>

      <mat-card class="filter-card">
        <mat-card-content>
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>Buscar profesores</mat-label>
            <input matInput (keyup)="applyFilter($event)" placeholder="Nombre, especialidad, email...">
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>
        </mat-card-content>
      </mat-card>

      <mat-card class="table-card">
        <mat-card-content>
          <div class="table-container">
            <table mat-table [dataSource]="dataSource" class="profesores-table">

              <ng-container matColumnDef="idPersona">
                <th mat-header-cell *matHeaderCellDef>ID</th>
                <td mat-cell *matCellDef="let profesor">{{ profesor.idPersona }}</td>
              </ng-container>

              <ng-container matColumnDef="nombre">
                <th mat-header-cell *matHeaderCellDef>Nombre</th>
                <td mat-cell *matCellDef="let profesor">{{ profesor.nombre }}</td>
              </ng-container>

              <ng-container matColumnDef="apellido">
                <th mat-header-cell *matHeaderCellDef>Apellido</th>
                <td mat-cell *matCellDef="let profesor">{{ profesor.apellido }}</td>
              </ng-container>

              <ng-container matColumnDef="especialidad">
                <th mat-header-cell *matHeaderCellDef>Especialidad</th>
                <td mat-cell *matCellDef="let profesor">
                  <span class="especialidad-chip">{{ profesor.especialidad }}</span>
                </td>
              </ng-container>

              <ng-container matColumnDef="fechaContratacion">
                <th mat-header-cell *matHeaderCellDef>Fecha Contratación</th>
                <td mat-cell *matCellDef="let profesor">{{ profesor.fechaContratacion | date:'dd/MM/yyyy' }}</td>
              </ng-container>

              <ng-container matColumnDef="email">
                <th mat-header-cell *matHeaderCellDef>Email</th>
                <td mat-cell *matCellDef="let profesor">
                  <a [href]="'mailto:' + profesor.email" class="email-link">{{ profesor.email }}</a>
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Acciones</th>
                <td mat-cell *matCellDef="let profesor">
                  <button mat-icon-button color="primary" (click)="editProfesor(profesor)" matTooltip="Editar">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="deleteProfesor(profesor)" matTooltip="Eliminar">
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
              <mat-icon>person</mat-icon>
              <p>No se encontraron profesores</p>
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
export class ProfesoresListComponent implements OnInit {
  displayedColumns: string[] = ['idPersona', 'nombre', 'apellido', 'especialidad', 'fechaContratacion', 'email', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  isLoading = false;
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;
  sortBy = 'idPersona';
  sortDirection = 'asc';

  constructor(
    private profesorService: ProfesorService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProfesores();
  }

  loadProfesores(): void {
    this.isLoading = true;
    
    this.profesorService.getAllPaged(
      this.pageIndex,
      this.pageSize,
      this.sortBy,
      this.sortDirection
    ).subscribe({
      next: (response) => {
        const profesoresConPersona = response.content.map(profesor => ({
          ...profesor,
          nombre: profesor.persona?.nombre || '',
          apellido: profesor.persona?.apellido || '',
          email: profesor.persona?.email || '',
          telefono: profesor.persona?.telefono || ''
        }));
        
        this.dataSource.data = profesoresConPersona;
        this.totalElements = response.totalElements;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.showError('Error al cargar profesores');
        console.error('Error loading profesores:', error);
      }
    });
  }

  onPageChange(event: PageEvent): void { 
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadProfesores(); 
  }

  editProfesor(profesor: any): void {
    this.router.navigate(['/profesores/edit', profesor.idPersona]);
  }

  deleteProfesor(profesor: any): void {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '300px',
      data: { 
        title: 'Eliminar Profesor',
        message: `¿Está seguro de eliminar al profesor ${profesor.nombre} ${profesor.apellido}?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.profesorService.delete(profesor.idPersona).subscribe({
          next: () => {
            this.showSuccess('Profesor eliminado exitosamente');
            this.loadProfesores(); // Recargar la página actual
          },
          error: () => {
            this.showError('Error al eliminar profesor');
          }
        });
      }
    });
  }

  newProfesor(): void {
    this.router.navigate(['/profesores/new']);
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