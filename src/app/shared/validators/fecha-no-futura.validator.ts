import { AbstractControl, ValidationErrors } from '@angular/forms';

export function fechaNoFutura(control: AbstractControl): ValidationErrors | null {
  const valor = control.value;
  if (!valor) { return null; }          

  const seleccionada = new Date(valor);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);           

  return seleccionada > hoy ? { fechaFutura: true } : null;
}