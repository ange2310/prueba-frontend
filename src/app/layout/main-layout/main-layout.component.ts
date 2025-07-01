import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../shared/models/auth.model';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {
  currentUser$: Observable<User | null>;
  
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  menuItems = [
    {
      title: 'Dashboard',
      icon: 'dashboard',
      route: '/dashboard',
      children: []
    },
    {
      title: 'Personas',
      icon: 'people',
      route: '/personas',
      children: [
        { title: 'Lista de Personas', route: '/personas' }
      ]
    },
    {
      title: 'Estudiantes',
      icon: 'school',
      route: '/estudiantes',
      children: [
        { title: 'Lista de Estudiantes', route: '/estudiantes' },
        { title: 'Nuevo Estudiante', route: '/estudiantes/new' }
      ]
    },
    {
      title: 'Profesores',
      icon: 'person',
      route: '/profesores',
      children: [
        { title: 'Lista de Profesores', route: '/profesores' },
        { title: 'Nuevo Profesor', route: '/profesores/new' }
      ]
    },
    {
      title: 'Administrativos',
      icon: 'business_center',
      route: '/administrativos',
      children: [
        { title: 'Lista de Administrativos', route: '/administrativos' },
        { title: 'Nuevo Administrativo', route: '/administrativos/new' }
      ]
    },
    {
      title: 'Cursos',
      icon: 'book',
      route: '/cursos',
      children: [
        { title: 'Lista de Cursos', route: '/cursos' },
        { title: 'Nuevo Curso', route: '/cursos/new' }
      ]
    },
    {
      title: 'Inscripciones',
      icon: 'assignment',
      route: '/inscripciones',
      children: [
        { title: 'Lista de Inscripciones', route: '/inscripciones' },
        { title: 'Nueva Inscripción', route: '/inscripciones/new' }
      ]
    }
  ];

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService
  ) {
    this.currentUser$ = this.authService.user$;
  }

  ngOnInit(): void {}

  logout(): void {
    this.authService.logout();
  }
}