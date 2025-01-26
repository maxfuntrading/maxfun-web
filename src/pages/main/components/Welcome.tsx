import SolidButton from '@/components/button/SolidButton'
import bannerVideo from '@/assets/videos/sunpump.mp4'
import { useState } from 'react'
import { useScrollLock } from '@/hooks/useScrollLock'

export default function Welcome() {
  const [isShowWelcome, setIsShowWelcome] = useState(true)
  useScrollLock(isShowWelcome)

  if (!isShowWelcome) return null

  return (
    <div className="fixed w-screen h-[100dvh] z-[9999] bg-black-20">
      <video
        className='absolute left-0 top-0 w-full h-full object-cover'
        src={bannerVideo}
        autoPlay={true}
        loop={true}
        playsInline={true}
        muted={true}
      />
      <div className='w-full absolute bottom-[4rem] mdup:bottom-[11.8rem] px-4 flex justify-center'>
        <SolidButton onClick={() => setIsShowWelcome(false)} className='w-full mdup:w-[26.8rem]'>
          <span>Welcome to max.fun</span>
        </SolidButton>
      </div>
    </div>
  )
}
