import { Profesor } from './profesor.model';

export interface Curso {
  idCurso?: number;
  nombre: string;
  descripcion?: string;
  creditos: number;
  idProfesor?: number;

  profesor?: Profesor;
}