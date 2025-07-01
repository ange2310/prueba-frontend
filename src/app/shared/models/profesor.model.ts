import { Persona } from './persona.model';

export interface Profesor {
  idPersona?: number;
  especialidad: string;
  fechaContratacion: string | Date;
  
  nombre?: string;
  apellido?: string;
  email?: string;
  telefono?: string;
  fechaNacimiento?: string | Date;
 
  persona?: Persona;
}