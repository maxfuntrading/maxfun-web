import clsx from 'clsx'

export default function Description({className}: {className?: string}) {
  return (
    <div className={clsx("w-full h-[11.25rem] mdup:h-[13.75rem] bg-black-10 rounded-[0.625rem]", className)}>
      Description
    </div>
  )
}
