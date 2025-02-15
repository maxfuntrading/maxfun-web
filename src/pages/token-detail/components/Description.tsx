import clsx from 'clsx'
import { useState } from 'react'
export default function Description({className, description}: {className?: string, description: string}) {
  console.log('description', description.length);
  
  const [isShowMoreButton, setIsShowMoreButton] = useState(() => {
    if (description.length > 100) {
      return true
    }
    return false
  })

  return (
    <div className={clsx("w-full bg-black-10 rounded-[0.625rem] px-[0.91rem] py-4 mdup:px-[1.55rem] mdup:py-[1.37rem]", className)}>
      <div className='text-[1.25rem]'>Description</div>
      <div className={`text-[1rem] mt-[0.6rem] mdup:mt-[1rem] ${isShowMoreButton ? 'line-clamp-4' : 'line-clamp-none'}`}>
        {description}
      </div>
      {isShowMoreButton && <button onClick={() => setIsShowMoreButton(false)} className='flex items-center gap-[0.31rem] mt-[0.6rem] mdup:mt-[1rem]'>
        <span className='text-[0.875rem] text-red-10'>Shore More</span>
        <svg className=' mt-[0.4rem] mdup:mt-2' xmlns="http://www.w3.org/2000/svg" width="11" height="12" viewBox="0 0 11 12" fill="none">
          <path d="M8.25 2.95349L5.5 5.70349L2.75 2.95349" stroke="#EC3E6F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>}
    </div>
  )
}
