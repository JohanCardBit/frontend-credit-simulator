import { Injectable } from '@angular/core';

// @ts-ignore
import flashy from '../../assets/js/flashy.js';



type FlashyType = 'success' | 'error' | 'warning';

interface FlashyOptions {
  duration?: number;
  onClick?: () => void;
  onClose?: () => void;
}

const ICONS: Record<FlashyType, string> = {
  success: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width:24px;height:24px;color:#22c55e;">
      <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/>
      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4"/>
    </svg>`,
  error: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width:24px;height:24px;color:#ef4444;">
      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
      <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/>
    </svg>`,
  warning: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" style="width:24px;height:24px;color:#f59e0b;">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m0 3.75h.007M10.29 3.86c.77-1.33 2.65-1.33 3.42 0l7.35 12.68c.75 1.3-.19 2.96-1.71 2.96H4.65c-1.52 0-2.46-1.66-1.71-2.96L10.29 3.86z"/>
    </svg>`,
};

@Injectable({
  providedIn: 'root',
})
export class FlashyService {

  private showFlashy(
    message: string,
    type: FlashyType,
    options: FlashyOptions = {}
  ) {
    flashy(message, {
      type,
      position: 'bottom-right',
      duration: options.duration || 2000,
      closable: true,
      animation: 'bounce',
      theme: 'dark',
      icon: ICONS[type],
      onClick: options.onClick,
      onClose: options.onClose,
    });
  }

  success(message: string, options: FlashyOptions = {}) {
    this.showFlashy(message, 'success', options);
  }

  error(message: string, options: FlashyOptions = {}) {
    this.showFlashy(message, 'error', options);
  }

  warning(message: string, options: FlashyOptions = {}) {
    this.showFlashy(message, 'warning', options);
  }
}
