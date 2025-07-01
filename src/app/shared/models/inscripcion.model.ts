import { Estudiante } from './estudiante.model';
import { Curso } from './curso.model';

export interface Inscripcion {
  idInscripcion?: number;
  idEstudiante: number;
  idCurso: number;
  fechaInscripcion: string | Date;
  estudiante?: Estudiante;
  curso?: Curso;

  nombreEstudiante?: string;
  apellidoEstudiante?: string;
  numeroMatricula?: string;
  gradoEstudiante?: string;

  nombreCurso?: string;
  creditosCurso?: number;
  nombreProfesor?: string;
  apellidoProfesor?: string;
}