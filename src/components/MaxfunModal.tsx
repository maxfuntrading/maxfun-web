import { Modal, ModalContent, ModalOverlay } from "@chakra-ui/react";
import clsx from "clsx";

interface Props {
  isOpen: boolean,
  onClose: () => void,
  title: string,
  children?: React.ReactNode,
  className?: string,
}

export default function MaxfunModal({isOpen, onClose, title, children, className}: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered closeOnOverlayClick={true}>
        <ModalOverlay />
        <ModalContent style={{backgroundColor: 'transparent'}}>
          <div className={clsx('w-[48.625rem] sm:w-full flex flex-col rounded-[0.624rem] px-[1.29rem] mdup:px-[1.6rem] py-[0.95rem] mdup:translate-x-[-23%]', className)} style={{background: '#1E2022'}}>
            <div className=' h-full flex justify-between items-center'>
              <div className=' text-[18px] text-white font-medium'>{title}</div>
              <div onClick={onClose} className=' cursor-pointer w-[24px] h-[24px]'>
                <CloseIcon className="size-[1rem] mdup:size-[1.25rem]" />
              </div>
            </div>

            <div>
              { children }
            </div>
          </div>
        </ModalContent>
      </Modal>
  )
}

function CloseIcon({className}: {className?: string}) {
  return <svg className={clsx(className)} xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
    <g opacity="0.6">
      <path d="M3.55347 2.80981L14.2201 13.4765" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3.55347 13.4765L14.2201 2.80981" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
  </svg>
}
