import bannerVideo from '@/assets/videos/sunpump.mp4'
import { useRef, useState } from 'react'
import VideoPlayBtn from '@/assets/images/home/video-play-btn.png'
import SolidButton from '@/components/button/SolidButton'
import { useNavigate } from 'react-router-dom'

export default function Banner() {
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const navigate = useNavigate()

  const handlePlay = () => {
    setIsPlaying(true)
    videoRef.current?.play()
  }

  const handlePause = () => {
    setIsPlaying(false)
    videoRef.current?.pause()
  }

  return (
    <div className="w-full my-container mx-auto mdup:px-0 mt-[1.59rem]">
      <div className=" w-full flex flex-col mdup:flex-row-reverse mdup:justify-end mdup:gap-[3.43rem]">

        <div className='flex flex-col mdup:flex-1 relative'>
          <div className='absolute right-0 bottom-[-2rem] w-[30rem] h-[10rem] bg-red-10/10' style={{filter: 'blur(50px)'}}></div>
          <div className='relative z-10'>
            <div 
              className='text-[1.875rem] mdup:text-[2.5rem] font-semibold mdup:mt-[1.2rem] w-[10rem] bg-gradient-to-r from-[#FFADC4] to-red-10 text-transparent bg-clip-text' 
              >
                Max.Fun
            </div>
            <div className=' mdup:text-[1.625rem]'>
              A meme-launch platform operating on the Base chain.
              <a href='https://max.fun/' target='_blank' className='underline text-red-10'> How it works ?</a>
            </div>
            <SolidButton onClick={() => navigate('/launcher')} className='mt-[0.77rem] mdup:w-[13.125rem] mdup:mt-[1.2rem]'>Create Token</SolidButton>
          </div>
        </div>

        <div className=" w-full relative mt-[1.36rem] mdup:mt-0 md:w-[38.75rem] lg:w-[42.5rem] mdup:h-[20rem]">
          <video 
            className={`w-full mdup:h-full object-cover rounded-[0.625rem] cursor-pointer`}
            onClick={isPlaying ? handlePause : handlePlay} 
            ref={videoRef} 
            loop 
            src={bannerVideo} />
          { !isPlaying && <button onClick={handlePlay} className='absolute-center size-[2.5rem] mdup:size-[3.75rem]'>
            <img className='size-full' src={VideoPlayBtn} alt="" />
          </button>}
        </div>

      </div>
    </div>
  )
}
