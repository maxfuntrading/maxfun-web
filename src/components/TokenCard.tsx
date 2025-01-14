import Gif from '@/assets/images/home/gift2.gif'
import InfraIcon from '@/assets/icons/infra.png'
import RocketIcon from '@/assets/images/rocket.png'
import clsx from 'clsx'
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { formatNumber } from '@/utils/utils';
import { useNavigate } from 'react-router-dom';
interface TokenCardProps {
  className?: string;
}

export default function TokenCard({className}: TokenCardProps) {
  const isUp = true; // 是否上涨
  const isDown = !isUp; // 是否下跌
  const isZero = false; // 涨幅是否为0
  const isOnUniswap = false; // 是否为外盘

  const navigate = useNavigate()

  return (
    <div onClick={() => navigate('/token/123')} className={clsx('w-full mdup:px-0 rounded-[0.625rem] overflow-hidden cursor-pointer', className)}>
      <div className=" relative h-[18.75rem] bg-black-30">
        <ImageControl src={Gif} />
        {!isZero && <div className={`absolute top-[1.81rem] right-[1.31rem] w-[5.81rem] h-[2rem] rounded-[6.25rem] flex-center gap-[0.25rem] ${isUp ? 'bg-[#2FBD85]' : 'bg-[#FF0021]'}`}>
           <span className='text-[0.875rem]'>+100.1%</span>
           <UpArrowIcon className={`${isDown ? 'rotate-180' : ''}`} />
        </div>}
        <div className='absolute bottom-[1.06rem] left-[1.5rem] size-[2.5rem] bg-red-10 rounded-full border-2 border-white flex-center'>
          <img className='size-[1.25rem]' src={InfraIcon} alt="" />
        </div>
      </div>

      <div className="relative bg-black-30 h-[13.84rem] px-[1.56rem] mdup:px-[0.875rem] pt-[1.44rem] pb-[1rem] mdup:py-[0.63rem] text-[0.875rem] flex flex-col">
        <div className=' font-medium'>
          <span className='text-white opacity-60'>Create By:</span> 
          0x97...a48b01
        </div>
        
        <div className='text-[1rem] font-medium'>
          ModernCat($ MCAT)
        </div>
        
        <div className='text-white opacity-60 mt-[0.56rem] line-clamp-3'>
          !ALPHA ALERT! ModernCat ($MCAT) brings anime and cats together creating a world of art.!ALPHA ALERT! ModernCat ($MCAT)
          !ALPHA ALERT! ModernCat ($MCAT) brings anime and cats together creating a world of art.!ALPHA ALERT! ModernCat ($MCAT)
        </div>

        <div className='w-full flex-1'></div>
        
        <div className=' '>
          <span className='text-white opacity-60'>Market Cap:</span>  
          <span className='font-semibold text-[0.875rem]'> ${formatNumber(5485023423)}</span>
        </div>
        
        {!isOnUniswap && <div className="flex items-center gap-[1.31rem] mt-[0.5rem]">
          <div className="relative flex-1 h-[0.625rem] rounded-[0.625rem]">
            <div className=' absolute top-0 left-0 w-full h-full rounded-[0.625rem] bg-[#D9D9D9] opacity-20'></div>
            <div className='w-1/2 h-full absolute top-0 left-0 rounded-[0.625rem]' style={{background: 'linear-gradient(90deg, #EC3E6F 0%, #FFADC4 100%)'}}></div>
          </div>
          <div>43.22%</div>
        </div>}

        {isOnUniswap && <div className='flex items-center'>
          <img className='size-[1.74rem]' src={RocketIcon} alt="" /> 
          <span className='font-semibold text-red-10'>Listed on UniSwap</span>
        </div>}
      </div>
    </div>
  )
}

const UpArrowIcon = ({className}: {className?: string}) => {
  return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M7.5 2.25V12.75" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3.75 5.75L7.5 2.25L11.25 5.75" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
}

const ImageControl = ({src}: {src: string}) => {
  const ref = useRef<HTMLImageElement>(null)
  const inView = useInView(ref)
  const isGif = src.endsWith('.gif')

  if (!isGif) {
    return <img className='size-full object-cover' src={src} loading="lazy" alt="" />
  }

  return <img ref={ref} className='size-full object-cover' src={ inView ? src : ''} loading="lazy" alt="" />
}