import SolidButton from '@/components/button/SolidButton'
import bannerVideo from '@/assets/videos/sunpump.mp4'
import { useEffect, useState } from 'react'
import { useScrollLock } from '@/hooks/useScrollLock'
import { useNavigate } from 'react-router-dom'

export default function Welcome() {
  const [isShowWelcome, setIsShowWelcome] = useState(false)
  useScrollLock(isShowWelcome)
  const navigate = useNavigate()

  useEffect(() => {
    const isShowWelcome = sessionStorage.getItem('welcome')
    if (!isShowWelcome) {
      setIsShowWelcome(true)
      sessionStorage.setItem('welcome', 'true')
    }
  }, [])

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
        <SolidButton onClick={() => {
          setIsShowWelcome(false)
          sessionStorage.setItem('welcome', 'true')
          navigate('/')
        }} className='w-full mdup:w-[26.8rem]'>
          <span>Welcome to max.fun</span>
        </SolidButton>
      </div>
    </div>
  )
}
