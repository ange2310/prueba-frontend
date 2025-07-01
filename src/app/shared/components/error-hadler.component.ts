import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-error-handler',
  template: `
    <div class="error-snackbar">
      <mat-icon>error</mat-icon>
      <span>{{ data.message }}</span>
      <button mat-icon-button (click)="dismiss()">
        <mat-icon>close</mat-icon>
      </button>
    </div>
  `,
  styles: [`
    .error-snackbar {
      display: flex;
      align-items: center;
      gap: 12px;
      color: white;
      
      mat-icon:first-child {
        color: #ffcdd2;
      }
      
      span {
        flex: 1;
      }
      
      button {
        color: white;
      }
    }
  `]
})
export class ErrorHandlerComponent {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: { message: string },
    private snackBarRef: MatSnackBarRef<ErrorHandlerComponent>
  ) {}

  dismiss(): void {
    this.snackBarRef.dismiss();
  }
}