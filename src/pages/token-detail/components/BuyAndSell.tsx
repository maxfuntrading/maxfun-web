import clsx from 'clsx'

export default function BuyAndSell({className}: {className?: string}) {
  return (
    <div className={clsx(" flex-shrink-0 w-full mdup:w-[30rem] h-[20.625rem] mdup:h-[25rem] flex flex-col bg-black-10 rounded-[0.625rem]", className)}>
      BuyAndSell
    </div>
  )
}
