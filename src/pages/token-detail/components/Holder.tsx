import clsx from 'clsx'

export default function Holder({className}: {className?: string}) {
  return (
    <div className={clsx("w-full h-[31.25rem] mdup:h-[46.875rem] bg-black-10 rounded-[0.625rem]", className)}>
      Holder
    </div>
  )
}