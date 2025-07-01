import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { AdministrativoService } from '../../../core/services/administrativo.service';
import { Administrativo } from '../../../shared/models/administrativo.model';
import { ConfirmDeleteDialogComponent } from '../../../shared/components/confirm-delete-dialog/confirm-delete-dialog.component';

@Component({
  selector: 'app-administrativos-list',
  template: `
    <div class="container">
      <div class="header-section">
        <h2>Gestión de Administrativos</h2>
        <button mat-raised-button color="primary" (click)="newItem()">
          <mat-icon>add</mat-icon>
          Nuevo Administrativo
        </button>
      </div>

      <mat-card class="filter-card">
        <mat-card-content>
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>Buscar administrativos</mat-label>
            <input matInput (keyup)="applyFilter($event)" placeholder="Nombre, cargo, departamento...">
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>
        </mat-card-content>
      </mat-card>

      <mat-card class="table-card">
        <mat-card-content>
          <div class="table-container">
            <table mat-table [dataSource]="dataSource" class="administrativos-table">

              <ng-container matColumnDef="idPersona">
                <th mat-header-cell *matHeaderCellDef>ID</th>
                <td mat-cell *matCellDef="let administrativo">{{ administrativo.idPersona }}</td>
              </ng-container>

              <ng-container matColumnDef="nombre">
                <th mat-header-cell *matHeaderCellDef>Nombre</th>
                <td mat-cell *matCellDef="let administrativo">{{ administrativo.nombre }}</td>
              </ng-container>

              <ng-container matColumnDef="apellido">
                <th mat-header-cell *matHeaderCellDef>Apellido</th>
                <td mat-cell *matCellDef="let administrativo">{{ administrativo.apellido }}</td>
              </ng-container>

              <ng-container matColumnDef="cargo">
                <th mat-header-cell *matHeaderCellDef>Cargo</th>
                <td mat-cell *matCellDef="let administrativo">
                  <span class="cargo-chip">{{ administrativo.cargo }}</span>
                </td>
              </ng-container>

              <ng-container matColumnDef="departamento">
                <th mat-header-cell *matHeaderCellDef>Departamento</th>
                <td mat-cell *matCellDef="let administrativo">{{ administrativo.departamento }}</td>
              </ng-container>

              <ng-container matColumnDef="email">
                <th mat-header-cell *matHeaderCellDef>Email</th>
                <td mat-cell *matCellDef="let administrativo">
                  <a [href]="'mailto:' + administrativo.email" class="email-link">{{ administrativo.email }}</a>
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Acciones</th>
                <td mat-cell *matCellDef="let administrativo">
                  <button mat-icon-button color="primary" (click)="editItem(administrativo)" matTooltip="Editar">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="deleteItemConfirm(administrativo)" matTooltip="Eliminar">
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
              <mat-icon>business_center</mat-icon>
              <p>No se encontraron administrativos</p>
            </div>
          </div>

          <!-- ➕ AGREGAR EL PAGINADOR -->
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
export class AdministrativosListComponent implements OnInit {
  displayedColumns = ['idPersona', 'nombre', 'apellido', 'cargo', 'departamento', 'email', 'actions'];
  dataSource = new MatTableDataSource<Administrativo>([]);
  
  // ➕ AGREGAR PROPIEDADES DE PAGINACIÓN
  isLoading = false;
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;
  sortBy = 'idPersona';
  sortDirection = 'asc';

  constructor(
    private administrativoService: AdministrativoService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.administrativoService.getAllPaged(
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
        this.showError('Error al cargar administrativos');
      }
    });
  }

  // ➕ AGREGAR MÉTODO PARA CAMBIO DE PÁGINA
  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  deleteItem(id: number): void {
    this.administrativoService.delete(id).subscribe({
      next: () => {
        this.showSuccess('Administrativo eliminado exitosamente');
        this.loadData();
      },
      error: () => {
        this.showError('Error al eliminar administrativo');
      }
    });
  }

  editItem(administrativo: Administrativo): void {
    this.router.navigate(['/administrativos/edit', administrativo.idPersona]);
  }

  deleteItemConfirm(administrativo: Administrativo): void {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '300px',
      data: { 
        title: 'Eliminar Administrativo',
        message: `¿Está seguro de eliminar al administrativo ${administrativo.nombre} ${administrativo.apellido}?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteItem(administrativo.idPersona!);
      }
    });
  }

  newItem(): void {
    this.router.navigate(['/administrativos/new']);
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