import Toast from "@/components/providers/Toast";
import { ErrorIcon, InfoIcon, SuccessIcon, WarningIcon } from "@/components/SvgIcon";

const toast = Toast.toast

export const toastSuccess = (message: string ) => {
  toast({
    status: 'success',
    position: 'top',
    containerStyle: {
      background: '#E8FFF7',
      border: '1px solid #06D188', 
      color: '#000000',
      fontSize: '1.25rem',
      borderRadius: '0.625rem',
      fontFamily: 'outfit',
    },
    icon: <SuccessIcon className="size-[1.125rem] mt-[0.25rem]" />,
    description: `${message ?? 'Success'}`,
  })
}

export const toastError = (message: string) => {
  toast({
    status: 'error',
    position: 'top',
    containerStyle: {
      background: '#FFF6F8',
      border: '1px solid #FF0021', 
      color: '#000000',
      fontSize: '1.25rem',
      borderRadius: '0.625rem',
      fontFamily: 'outfit'
    },
    icon: <ErrorIcon className="size-[1.125rem] mt-[0.25rem]" />,
    description: `${message ?? 'Error'}`,
  })
}

export const toastWarning = (message: string ) => {
  toast({
    status: 'warning',
    position: 'top',
    containerStyle: {
      background: '#FFF6E3',
      border: '1px solid #F7AD1E', 
      color: '#000000',
      fontSize: '1.25rem',
      borderRadius: '0.625rem',
      fontFamily: 'outfit'
    },
    icon: <WarningIcon className="size-[1.125rem] mt-[0.25rem]" />,
    description: `${message ?? ''}`
  })
}

export const toastInfo = (message: string ) => {
  toast({
    status: 'info',
    position: 'top',
    containerStyle: {
      background: '#E6F7FF',
      border: '1px solid #148FFD', 
      color: '#000000',
      fontSize: '1.25rem',
      borderRadius: '0.625rem',
      fontFamily: 'outfit'
    },
    icon: <InfoIcon className="size-[1.125rem] mt-[0.25rem]" />,
    description: `${message ?? ''}`
  })
}
