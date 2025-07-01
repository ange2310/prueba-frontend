import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ConfirmDeleteDialogComponent } from './confirm-delete-dialog/confirm-delete-dialog.component';

@Component({
  template: ''
})
export abstract class BaseListComponent<T> {
  dataSource = new MatTableDataSource<T>([]);
  isLoading = false;
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;
  displayedColumns: string[] = [];

  title: string = '';
  entityName: string = '';
  routePrefix: string = '';

  constructor(
    protected dialog: MatDialog,
    protected snackBar: MatSnackBar,
    protected router: Router
  ) {}

  abstract loadData(): void;
  abstract deleteItem(id: number): void;

  onPageChange(event: any): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  editItem(item: any): void {
    const id = item.idPersona || item.idCurso || item.idInscripcion;
    this.router.navigate([`/${this.routePrefix}/edit`, id]);
  }

  deleteItemConfirm(item: any): void {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '300px',
      data: { 
        title: `Eliminar ${this.entityName}`,
        message: `¿Está seguro de eliminar este ${this.entityName.toLowerCase()}?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const id = item.idPersona || item.idCurso || item.idInscripcion;
        this.deleteItem(id);
      }
    });
  }

  newItem(): void {
    this.router.navigate([`/${this.routePrefix}/new`]);
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