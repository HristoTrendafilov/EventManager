import { type ToastOptions, type TypeOptions, toast } from 'react-toastify';

class ToastService {
  // Default options for all toasts
  private defaultOptions: ToastOptions = {
    position: 'top-right',
    autoClose: 5000, // 5 seconds
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  // Helper method to show toast of a specific type
  private showToast(
    type: TypeOptions,
    message: string,
    options?: ToastOptions
  ) {
    toast(message, { type, ...this.defaultOptions, ...options });
  }

  success(message: string, options?: ToastOptions) {
    this.showToast('success', message, options);
  }

  info(message: string, options?: ToastOptions) {
    this.showToast('info', message, options);
  }

  warning(message: string, options?: ToastOptions) {
    this.showToast('warning', message, options);
  }

  error(message: string, options?: ToastOptions) {
    this.showToast('error', message, options);
  }
}

export const toastService = new ToastService();
