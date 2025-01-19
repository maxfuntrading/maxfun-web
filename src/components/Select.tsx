import useClickAway from '@/hooks/useClickAway'
import { useRef, useState } from 'react'
import clsx from 'clsx'

export interface SelectOptionType<T> {
  key: T
  value: string
  icon?: string
}

interface SelectProps<T> {
  defaultOption: SelectOptionType<T>
  options: SelectOptionType<T>[]
  onSelect: (tag: SelectOptionType<T>) => void
  className?: string
  optionClassName?: string
  optionPanelClassName?: string
}

export default function Select<T>({
  defaultOption,
  options,
  onSelect,
  className,
  optionClassName,
  optionPanelClassName,
}: SelectProps<T>) {
  const [isOpenOption, setIsOpenOption] = useState(false)
  const selectRef = useRef<HTMLDivElement>(null)
  const isShowIcon = options.some((option) => option.icon)

  useClickAway(selectRef, () => {
    setIsOpenOption(false)
  })

  return (
    <div
      ref={selectRef}
      className={clsx(
        'relative w-[10.3125rem] md:w-[13.75rem] lg:w-[16.25rem] h-[2.5rem] mdup:h-[3.125rem] rounded-[0.625rem] outline-none bg-black-20 border-[2px] border-red-10 px-[0.56rem] md:px-[1.09rem] lg:px-[1.22rem] cursor-pointer',
        className
      )}
    >
      <div
        className={clsx('w-full h-full flex items-center justify-between')}
        onClick={() => setIsOpenOption((prev) => !prev)}
      >
        <div>{defaultOption.value}</div>

        {isOpenOption ? (
          <UpArrowIcon className="size-[1.25rem]" />
        ) : (
          <DownArrowIcon className="size-[1.25rem]" />
        )}
      </div>
      {isOpenOption && (
        <div
          className={clsx(
            ' w-full absolute z-10 top-[2.5rem] mdup:top-[3.125rem] left-0 border-[2px] border-red-10 rounded-[0.625rem] py-[1rem] px-[1rem] mdup:px-[1.54rem] cursor-default flex flex-col gap-[1.19rem]',
            optionPanelClassName
          )}
          style={{
            background: 'rgba(46, 48, 51, 0.80)',
            backdropFilter: 'blur(7.5px)',
          }}
        >
          {options.map((option, index) => (
            <div
              key={index}
              className={clsx(
                ' cursor-pointer flex items-center gap-[0.94rem]',
                optionClassName
              )}
              onClick={() => {
                onSelect(option)
                setIsOpenOption(false)
              }}
            >
              {isShowIcon && (
                <div className="size-[1.25rem]">
                  {option.icon && (
                    <img src={option.icon} className="size-full" alt="" />
                  )}
                </div>
              )}
              <div className="font-medium">{option.value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export const DownArrowIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      className={clsx(className)}
      xmlns="http://www.w3.org/2000/svg"
      width="21"
      height="21"
      viewBox="0 0 21 21"
      fill="none"
    >
      <path
        d="M5.33398 7.89288L10.334 12.8929L15.334 7.89288"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export const UpArrowIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      className={clsx(className)}
      xmlns="http://www.w3.org/2000/svg"
      width="21"
      height="21"
      viewBox="0 0 21 21"
      fill="none"
    >
      <path
        d="M5.80859 13.7263L10.8086 8.72626L15.8086 13.7263"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
