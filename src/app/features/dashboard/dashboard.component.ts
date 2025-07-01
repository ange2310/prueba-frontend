import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="dashboard-container">
      <h2>Dashboard</h2>
      
      <div class="stats-grid">
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon class="stat-icon">people</mat-icon>
              <div class="stat-info">
                <h3>Personas</h3>
                <p class="stat-number">{{ totalPersonas }}</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon class="stat-icon">school</mat-icon>
              <div class="stat-info">
                <h3>Estudiantes</h3>
                <p class="stat-number">{{ totalEstudiantes }}</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon class="stat-icon">person</mat-icon>
              <div class="stat-info">
                <h3>Profesores</h3>
                <p class="stat-number">{{ totalProfesores }}</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon class="stat-icon">book</mat-icon>
              <div class="stat-info">
                <h3>Cursos</h3>
                <p class="stat-number">{{ totalCursos }}</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="welcome-section">
        <mat-card>
          <mat-card-header>
            <mat-card-title>Bienvenido al Sistema de Gestión Escolar</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Desde aquí puedes gestionar toda la información de la institución educativa.</p>
            <div class="quick-actions">
              <button mat-raised-button color="primary" routerLink="/personas/new">
                <mat-icon>add</mat-icon>
                Nueva Persona
              </button>
              <button mat-raised-button color="accent" routerLink="/estudiantes/new">
                <mat-icon>add</mat-icon>
                Nuevo Estudiante
              </button>
              <button mat-raised-button routerLink="/cursos/new">
                <mat-icon>add</mat-icon>
                Nuevo Curso
              </button>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 24px;
        margin-bottom: 32px;
        
        .stat-card {
          .stat-content {
            display: flex;
            align-items: center;
            gap: 16px;
            
            .stat-icon {
              font-size: 48px;
              width: 48px;
              height: 48px;
              color: #1976d2;
            }
            
            .stat-info {
              h3 {
                margin: 0 0 8px 0;
                color: #666;
                font-size: 14px;
                font-weight: 500;
              }
              
              .stat-number {
                margin: 0;
                font-size: 32px;
                font-weight: bold;
                color: #333;
              }
            }
          }
        }
      }
      
      .welcome-section {
        .quick-actions {
          display: flex;
          gap: 12px;
          margin-top: 16px;
          flex-wrap: wrap;
          
          button mat-icon {
            margin-right: 8px;
          }
        }
      }
    }
    
    @media (max-width: 768px) {
      .dashboard-container .quick-actions {
        flex-direction: column;
        
        button {
          width: 100%;
        }
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  totalPersonas = 0;
  totalEstudiantes = 0;
  totalProfesores = 0;
  totalCursos = 0;

  ngOnInit(): void {
    this.loadStats();
  }

  private loadStats(): void {
    this.totalPersonas = 125;
    this.totalEstudiantes = 80;
    this.totalProfesores = 25;
    this.totalCursos = 15;
  }
}