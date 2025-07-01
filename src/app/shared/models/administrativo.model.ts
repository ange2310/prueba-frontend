import { Persona } from './persona.model';

export interface Administrativo {
  idPersona?: number;
  cargo: string;
  departamento: string;
 
  nombre?: string;
  apellido?: string;
  email?: string;
  telefono?: string;
  fechaNacimiento?: string | Date;
  

  persona?: Persona;
}