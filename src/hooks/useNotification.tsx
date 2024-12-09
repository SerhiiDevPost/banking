import toast from 'react-hot-toast';

export const useNotification = () => {
  const successToast = (message: string) => toast.success(message);
  const errorToast = (message: string) => toast.error(message);
  return {
    successToast,
    errorToast
  }
};
