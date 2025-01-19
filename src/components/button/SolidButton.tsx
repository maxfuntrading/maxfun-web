import clsx from 'clsx'

interface SolidButtonProps {
  children?: React.ReactNode
  onClick?: () => void
  className?: string
  isDisabled?: boolean
}

export default function SolidButton({
  children,
  onClick,
  className,
  isDisabled = false,
}: SolidButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={clsx(
        'w-full h-[2.75rem] mdup:h-[3.5rem] rounded-[0.625rem] relative overflow-hidden',
        isDisabled
          ? 'bg-[#D9D9D9] text-[#636363]'
          : 'bg-red-10 hover:bg-red-20 text-white',
        className
      )}
    >
      <div
        className=" absolute bottom-[4px] left-0 w-full h-[1.875rem] mdup:h-[2.622rem] rounded-[0.625rem]"
        style={{
          background:
            'linear-gradient(180deg, rgba(236, 62, 111, 0.00) 0%, rgba(255, 255, 255, 0.20) 100%)',
        }}
      />
      {!isDisabled && (
        <div
          className=" absolute top-0 left-0 w-full h-[2.75rem] mdup:h-[3.5rem] bg-red-10 hover:bg-red-20 rounded-[1.25rem] opacity-40"
          style={{
            filter: 'blur(10px)',
          }}
        />
      )}
      <div className=" absolute-center size-full flex-center mdup:text-[1.25rem]">
        {children ?? ''}
      </div>
    </button>
  )
}
