import clsx from 'clsx'

export default function TokenButton({
  token,
  selected,
  onClick,
  className,
}: {
  token: string
  selected: boolean
  onClick: () => void
  className?: string
}) {
  return (
    <button
      className={clsx(
        `flex flex-col items-center border-2 w-[6rem] h-[2.75rem] mdup:w-[11.875rem] mdup:h-[4.375rem] rounded-[0.625rem] ${
          selected ? 'border-red-10' : 'border-white/10'
        }`,
        className
      )}
      onClick={onClick}
    >
      <div
        className={`w-full h-full text-base mdup:text-[1.25rem] font-medium flex flex-row items-center gap-2 mdup:py-[0.75rem] mdup:pl-[1.625rem] justify-center`}
      >
        <img
          src={`/${token}.png`}
          alt=""
          className="mdup:size-[2.8125rem] size-[1.5625rem]"
        />
        <span className="text-sm mdup:text-base">{token}</span>
      </div>
    </button>
  )
}
