import { Toaster } from 'react-hot-toast';

export const ToastWrapper = () => (
  <Toaster
    position="top-right"
    gutter={8}
    toastOptions={{
      duration: 9000,
    }}
  />
);
