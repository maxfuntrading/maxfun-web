import clsx from 'clsx'
import { useState } from 'react'
export default function Description({className}: {className?: string}) {
  const [isShowMore, setIsShowMore] = useState(false)

  return (
    <div className={clsx("w-full bg-black-10 rounded-[0.625rem] px-[0.91rem] py-4 mdup:px-[1.55rem] mdup:py-[1.37rem]", className)}>
      <div className='text-[1.25rem]'>Description</div>
      <div className={`text-[1rem] mt-[0.6rem] mdup:mt-[1rem] ${isShowMore ? 'line-clamp-none' : 'line-clamp-4'}`}>
        Shiba Banana Coin ($BANANA) is a fun decentralized token uniting banana lovers and Shiba Inu fans! Share memes to earn rewards or use $BANANA to grow a digital banana garden. A community of “funny yet powerful” spirit awaits!
      </div>
      {!isShowMore && <button onClick={() => setIsShowMore(true)} className='flex items-center gap-[0.31rem] mt-[0.6rem] mdup:mt-[1rem]'>
        <span className='text-[0.875rem] text-red-10'>Shore More</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="12" viewBox="0 0 11 12" fill="none">
          <path d="M8.25 2.95349L5.5 5.70349L2.75 2.95349" stroke="#EC3E6F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>}
    </div>
  )
}
