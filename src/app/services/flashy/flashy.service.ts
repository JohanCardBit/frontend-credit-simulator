import { Injectable } from '@angular/core';

// @ts-ignore
import flashy from '../../assets/js/flashy.js';

type FlashyType = 'success' | 'error' | 'warning' | 'info' | 'default' | 'confirm';

interface FlashyOptions {
  duration?: number;
  onClick?: () => void;
  onClose?: () => void;
}

interface FlashyConfirmOptions {
  duration?: number;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  animation?: 'slide' | 'fade' | 'bounce' | 'zoom';
  theme?: 'light' | 'dark';
  onConfirm: () => void;
  onCancel?: () => void;
}

const ICONS: Record<FlashyType, string> = {
  success: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width:24px;height:24px;color:#22c55e;"><circle cx="12" cy="12" r="9"/><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4"/></svg>`,
  error: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width:24px;height:24px;color:#ef4444;"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/><circle cx="12" cy="12" r="9"/></svg>`,
  warning: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" style="width:24px;height:24px;color:#f59e0b;"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m0 3.75h.007M10.29 3.86c.77-1.33 2.65-1.33 3.42 0l7.35 12.68c.75 1.3-.19 2.96-1.71 2.96H4.65c-1.52 0-2.46-1.66-1.71-2.96L10.29 3.86z"/></svg>`,
  info: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" style="width:24px;height:24px;color:#3b82f6;">
  <circle cx="12" cy="12" r="10" stroke="#3b82f6" stroke-width="2"/>
  <line x1="12" y1="16" x2="12" y2="12" stroke="#3b82f6" stroke-linecap="round"/>
  <circle cx="12" cy="8" r="1" fill="#3b82f6"/>
</svg>
`,
  default: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" style="width:24px;height:24px;color:#64748b;">
  <path stroke-linecap="round" stroke-linejoin="round" d="M7 8h10M7 12h6M5 20l4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/>
</svg>
`,

  confirm: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:#f97316;">
  <circle cx="12" cy="12" r="10" stroke="#f97316" stroke-width="2"/>
  <line x1="12" y1="8" x2="12" y2="12" stroke="#f97316" stroke-linecap="round"/>
  <line x1="12" y1="16" x2="12" y2="16" stroke="#f97316" stroke-linecap="round"/>
</svg>
`
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
      duration: options.duration ?? 2000,
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

  info(message: string, options: FlashyOptions = {}) {
    this.showFlashy(message, 'info', options);
  }

  /**
   * Mostrar confirmación con botones "Confirmar" y "Cancelar".
   */
  confirm(message: string, options: FlashyConfirmOptions) {
    flashy(message, {
      type: 'confirm',
      position: options.position ?? 'top-center',
      duration: options.duration ?? 0,
      closable: false,
      animation: options.animation ?? 'bounce',
      theme: options.theme ?? 'dark',
      icon: ICONS.confirm,
      onConfirm: options.onConfirm,
      onCancel: options.onCancel,
    });
  }
}
