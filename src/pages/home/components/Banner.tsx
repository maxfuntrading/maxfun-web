import bannerVideo from '@/assets/videos/sunpump.mp4'
import { useRef, useState } from 'react'
import VideoPlayBtn from '@/assets/images/home/video-play-btn.png'
import SolidButton from '@/components/button/SolidButton'

export default function Banner() {
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handlePlay = () => {
    setIsPlaying(true)
    videoRef.current?.play()
  }

  const handlePause = () => {
    setIsPlaying(false)
    videoRef.current?.pause()
  }

  return (
    <div className="w-full my-container mx-auto px-4 mdup:px-[3.62rem] mt-[1.59rem]">
      <div className=" w-full h-full">
        <div className='flex flex-col'>
          <div 
            className='text-[1.875rem]' 
            style={{
              background: 'linear-gradient(90deg, #FFADC4 0%, #EC3E6F 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              SumPump
          </div>
          <div className=''>
            The First Meme Fair Launch Platform on Tron.<br />
            PUMP TO THE SUN <span className='underline text-red-10'>How it works ?</span>
          </div>
          <SolidButton>Create Token</SolidButton>
        </div>

        <div className=" w-full relative mt-[5rem]">
          <video onClick={handlePause} ref={videoRef} className='w-full rounded-[0.625rem]' loop src={bannerVideo} />
          { !isPlaying && <button onClick={handlePlay} className='absolute-center size-[2.5rem]'>
            <img className='size-full' src={VideoPlayBtn} alt="" />
          </button>}
        </div>
      </div>
    </div>
  )
}
