import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EstudianteService } from '../../../core/services/estudiante.service';
import { Estudiante } from '../../../shared/models/estudiante.model';
import { Router } from '@angular/router';
import { ConfirmDeleteDialogComponent } from '../../../shared/components/confirm-delete-dialog/confirm-delete-dialog.component';

@Component({
  selector: 'app-estudiantes-list',
  templateUrl: './estudiantes-list.component.html',
  styleUrls: ['./estudiantes-list.component.scss']
})
export class EstudiantesListComponent implements OnInit {
  displayedColumns: string[] = ['idPersona', 'numeroMatricula', 'nombre', 'apellido', 'grado', 'email', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  sortBy = 'idPersona';
  sortDirection = 'asc';
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  isLoading = false;
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;

  constructor(
    private estudianteService: EstudianteService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEstudiantes();
  }

  loadEstudiantes(): void {
    this.isLoading = true;
    
    this.estudianteService.getAllPaged(this.pageIndex, this.pageSize, 'idPersona', 'asc').subscribe({
      next: (response) => {
        const estudiantesConPersona = response.content.map(estudiante => ({
          ...estudiante,
          nombre: estudiante.persona?.nombre || '',
          apellido: estudiante.persona?.apellido || '',
          email: estudiante.persona?.email || ''
        }));
        
        this.dataSource.data = estudiantesConPersona;
        this.totalElements = response.totalElements;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open('Error al cargar estudiantes', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadEstudiantes();
  }

  editEstudiante(estudiante: Estudiante): void {
    this.router.navigate(['/estudiantes/edit', estudiante.idPersona]);
  }

  deleteEstudiante(estudiante: any): void {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '300px',
      data: { 
        title: 'Eliminar Estudiante',
        message: `¿Está seguro de eliminar al estudiante ${estudiante.nombre} ${estudiante.apellido}?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.estudianteService.delete(estudiante.idPersona).subscribe({
          next: () => {
            this.snackBar.open('Estudiante eliminado exitosamente', 'Cerrar', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            this.loadEstudiantes();
          },
          error: () => {
            this.snackBar.open('Error al eliminar estudiante', 'Cerrar', {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    });
  }

  newEstudiante(): void {
    this.router.navigate(['/estudiantes/new']);
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}