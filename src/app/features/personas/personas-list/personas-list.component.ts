import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PersonaService } from '../../../core/services/persona.service';
import { Persona } from '../../../shared/models/persona.model';
import { Router } from '@angular/router';
import { ConfirmDeleteDialogComponent } from '../../../shared/components/confirm-delete-dialog/confirm-delete-dialog.component';

@Component({
  selector: 'app-personas-list',
  templateUrl: './personas-list.component.html',
  styleUrls: ['./personas-list.component.scss']
})
export class PersonasListComponent implements OnInit {
  displayedColumns: string[] = ['idPersona', 'nombre', 'apellido', 'email', 'telefono', 'fechaNacimiento', 'actions'];
  dataSource = new MatTableDataSource<Persona>([]);
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  isLoading = false;
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;
  sortBy = 'idPersona';
  sortDirection = 'asc';

  constructor(
    private personaService: PersonaService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPersonas();
  }

  loadPersonas(): void {
    this.isLoading = true;
    
    this.personaService.getAllPaged(
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
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open('Error al cargar personas', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        console.error('Error loading personas:', error);
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadPersonas();
  }

  onSortChange(sortState: any): void {
    this.sortBy = sortState.active;
    this.sortDirection = sortState.direction;
    this.pageIndex = 0; // Reset to first page
    this.loadPersonas();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editPersona(persona: Persona): void {
    this.router.navigate(['/personas/edit', persona.idPersona]);
  }

  deletePersona(persona: Persona): void {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '300px',
      data: { 
        title: 'Eliminar Persona',
        message: `¿Está seguro de eliminar a ${persona.nombre} ${persona.apellido}?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.personaService.delete(persona.idPersona!).subscribe({
          next: () => {
            this.snackBar.open('Persona eliminada exitosamente', 'Cerrar', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            this.loadPersonas();
          },
          error: (error) => {
            this.snackBar.open('Error al eliminar persona', 'Cerrar', {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
            console.error('Error deleting persona:', error);
          }
        });
      }
    });
  }
}