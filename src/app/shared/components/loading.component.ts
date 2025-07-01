import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading',
  template: `
    <div class="loading-container" [class.overlay]="overlay">
      <mat-spinner [diameter]="size"></mat-spinner>
      <p *ngIf="message">{{ message }}</p>
    </div>
  `,
  styles: [`
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 32px;
      
      &.overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.8);
        z-index: 9999;
      }
      
      p {
        margin-top: 16px;
        color: #666;
        font-size: 14px;
      }
    }
  `]
})
export class LoadingComponent {
  @Input() message: string = 'Cargando...';
  @Input() size: number = 50;
  @Input() overlay: boolean = false;
}
