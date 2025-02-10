import RocketIcon from '@/assets/images/rocket.png'
import clsx from 'clsx'
import { useInView } from 'framer-motion';
import { useMemo, useRef } from 'react';
import { formatAddress, formatNumber } from '@/utils/utils';
import { useNavigate } from 'react-router-dom';
import { MaxFunToken } from '@/api/home';
import { TagIcon } from './TagIcon';
import Big from 'big.js';
interface TokenCardProps {
  className?: string;
  data: MaxFunToken;
}

export default function TokenCard({className, data}: TokenCardProps) {
  const isOnUniswap = data.is_launched; // 是否为外盘

  const navigate = useNavigate()

  const progress = useMemo(() => {
    if (!data.market_cap) return 0
    if (!data.bonding_curve) return 0

    if (data.bonding_curve === '0') return 0

    const marketCap = Big(data.market_cap)
    const bondingCurve = Big(data.bonding_curve)

    return bondingCurve.div(marketCap).toNumber()
  }, [data.market_cap, data.bonding_curve])

  return (
    <div onClick={() => navigate(`/token/${data.token_address}`)} className={clsx('w-full mdup:px-0 rounded-[0.625rem] overflow-hidden cursor-pointer group', className)}>
      <div className=" relative h-[18.75rem] bg-black-30">
        <ImageControl src={`${data.icon}`} />
        {/* {!isZero && <div className={`absolute top-[1.81rem] right-[1.31rem] w-[5.81rem] h-[2rem] rounded-[6.25rem] flex-center gap-[0.25rem] ${isUp ? 'bg-[#2FBD85]' : 'bg-[#FF0021]'}`}>
           <span className='text-[0.875rem]'>+100.1%</span>
           <UpArrowIcon className={`${isDown ? 'rotate-180' : ''}`} />
        </div>} */}

        <div className=' block group-hover:hidden absolute bottom-0 left-0 w-full h-[5.875rem] translate-y-[1.2rem]' style={{borderRadius: '0.625rem 0.625rem 0rem 0rem', background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, #000 100%)'}}></div>
        <div className=" hidden group-hover:block absolute bottom-0 left-0 w-full h-[5.875rem] rounded-t-[0.625rem] bg-gradient-to-b from-transparent to-red-10 translate-y-[1.2rem]"></div>
        
        <div className='absolute bottom-[1.06rem] left-[1.5rem] size-[2.5rem] bg-red-10 rounded-full border-2 border-white flex-center'>
          {TagIcon[data.tag] && <img className='size-[1.25rem]' src={TagIcon[data.tag]} alt={data.symbol} />}
        </div>

      </div>

      <div className="relative bg-black-30 group-hover:bg-red-10 h-[13.84rem] px-[1.56rem] mdup:px-[0.875rem] pt-[1.44rem] pb-[1rem] mdup:py-[0.63rem] text-[0.875rem] flex flex-col">
        <div className=' font-medium'>
          <span className='text-white opacity-60'>Create By:</span> 
          {formatAddress(data.user_address, 4, 6)}
        </div>
        
        <div className='text-[1rem] font-medium'>
          {data.name}($ {data.symbol})
        </div>
        
        <div className='text-white opacity-60 group-hover:opacity-70 mt-[0.56rem] line-clamp-4'>
          {data.description}
        </div>

        <div className='w-full flex-1'></div>
        
        <div className=' '>
          <span className='text-white opacity-60'>Market Cap:</span>  
          {data.market_cap && <span className='font-semibold text-[0.875rem]'> ${ formatNumber(data.market_cap) }</span>}
        </div>
        
        {!isOnUniswap && <div className="flex items-center gap-[1.31rem] mt-[0.5rem]">
          <div className="relative flex-1 h-[0.625rem] rounded-[0.625rem]">
            <div className='absolute top-0 left-0 w-full h-full rounded-[0.625rem] bg-[#D9D9D9] group-hover:bg-white opacity-20'></div>
            <div className={`absolute top-0 left-0 h-full rounded-[0.625rem] bg-gradient-to-r from-red-10 to-[#FFADC4] group-hover:from-white group-hover:to-white`} style={{width: `${progress * 100}%`}}></div>
          </div>
          <div>{progress * 100}%</div>
        </div>}

        {isOnUniswap && <div className='flex items-center'>
          <img className='size-[1.74rem]' src={RocketIcon} alt="" /> 
          <span className='font-semibold text-red-10'>Listed on UniSwap</span>
        </div>}
      </div>
    </div>
  )
}

export const UpArrowIcon = ({className}: {className?: string}) => {
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
    return <img className='size-full object-contain' src={src} loading="lazy" alt="" />
  }

  return <img ref={ref} className='size-full object-contain' src={ inView ? src : ''} loading="lazy" alt="" />
}