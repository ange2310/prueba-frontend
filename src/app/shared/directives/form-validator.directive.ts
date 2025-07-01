import { Directive, Input, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appFormValidator]'
})
export class FormValidatorDirective {
  @Input() errorMessages: { [key: string]: string } = {};

  constructor(private control: NgControl) {}

  @HostListener('blur')
  onBlur(): void {
    this.control.control?.markAsTouched();
  }

  getErrorMessage(): string {
    const control = this.control.control;
    if (control?.errors && control.touched) {
      const firstError = Object.keys(control.errors)[0];
      return this.errorMessages[firstError] || `Error en ${firstError}`;
    }
    return '';
  }
}