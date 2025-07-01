import { Persona } from './persona.model';

export interface Estudiante {
  idPersona?: number;
  numeroMatricula: string;
  grado: string;

  nombre?: string;
  apellido?: string;
  email?: string;
  telefono?: string;
  fechaNacimiento?: string | Date;
  
  persona?: Persona;
}