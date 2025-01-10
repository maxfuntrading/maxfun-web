import clsx from 'clsx'

interface FlatButtonProps {
  children?: React.ReactNode,
  onClick?: () => void,
  className?: string,
  isDisabled?: boolean
}

export default function FlatButton({ children, onClick, className, isDisabled = false }: FlatButtonProps) {
  return (
    <button onClick={onClick} disabled={isDisabled} className={clsx('w-full h-[2.25rem] mdup:h-[2.5rem] rounded-[0.625rem] bg-red-10 hover:bg-red-20 flex-center', className)}>
      {children ?? ''}
    </button>
  )
}
