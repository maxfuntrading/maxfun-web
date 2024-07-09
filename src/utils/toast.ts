import Toast from "@/components/providers/Toast";

const toast = Toast.toast

export const toastError = (message: string ) => {
  toast({
    status: 'error',
    position: 'top',
    description: `${message ?? 'Error'}`
  })
}

export const toastSuccess = (message: string ) => {
  toast({
    status: 'success',
    position: 'top',
    description: `${message ?? 'Success'}`
  })
}