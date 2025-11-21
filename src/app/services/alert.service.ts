import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

export interface AlertConfig {
  confirmButtonText?: string;
  cancelButtonText?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  async confirmDelete(title: string, text: string, config?: AlertConfig): Promise<boolean> {
    // Default configuration
    const defaultConfig: AlertConfig = {
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    };

    // Merge user config with defaults
    const finalConfig = { ...defaultConfig, ...config };

    const result = await Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: finalConfig.confirmButtonText,
      cancelButtonText: finalConfig.cancelButtonText,
      reverseButtons: true, // This puts cancel button on the left
      focusCancel: true, // Focus on cancel by default for safety
      customClass: {
        actions: 'gap-4', // Add more space between buttons
        confirmButton: 'bg-red-500 text-white rounded-md px-4 py-2 font-medium border-0 ',
        cancelButton: 'bg-gray-300 text-gray-700 rounded-md px-4 py-2 font-medium border-0 ',
      },
      buttonsStyling: false,
    });

    return result.isConfirmed;
  }

  showSuccess(title: string, text: string, timer: number = 1500): void {
    Swal.fire({
      title,
      text,
      icon: 'success',
      timer,
      showConfirmButton: false,
      toast: false,
    });
  }
}
