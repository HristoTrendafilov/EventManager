import { type ToastOptions, type TypeOptions, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

  // Success toast
  success(message: string, options?: ToastOptions) {
    this.showToast('success', message, options);
  }

  // Info toast
  info(message: string, options?: ToastOptions) {
    this.showToast('info', message, options);
  }

  // Warning toast
  warning(message: string, options?: ToastOptions) {
    this.showToast('warning', message, options);
  }

  // Error toast
  error(message: string, options?: ToastOptions) {
    this.showToast('error', message, options);
  }
}

export const toastService = new ToastService();
