import RocketIcon from '@/assets/images/rocket.png'
import clsx from 'clsx'
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { formatAddress, formatAmount, formatNumberLocale } from '@/utils/utils';
import { useNavigate } from 'react-router-dom';
import { MaxFunToken } from '@/api/home';
import { TagIcon } from './TagIcon';
import Big from 'big.js';
import { useChainInfo } from '@/hooks/useChainInfo';
interface TokenCardProps {
  className?: string;
  data: MaxFunToken;
}

export default function TokenCard({className, data}: TokenCardProps) {
  const isOnUniswap = data.is_launched; // is launched on uniswap

  const navigate = useNavigate()
  const { blockExploreUrl } = useChainInfo()

  return (
    <div onClick={() => navigate(`/token/${data.token_address}`)} className={clsx('w-full mdup:px-0 rounded-[0.625rem] overflow-hidden cursor-pointer group', className)}>
      <div className=" relative h-[18.75rem] bg-black-30">
        <ImageControl src={`${data.icon}`} />
        {/* {!isZero && <div className={`absolute top-[1.81rem] right-[1.31rem] w-[5.81rem] h-[2rem] rounded-[6.25rem] flex-center gap-[0.25rem] ${isUp ? 'bg-[#2FBD85]' : 'bg-[#FF0021]'}`}>
           <span className='text-[0.875rem]'>+100.1%</span>
           <UpArrowIcon className={`${isDown ? 'rotate-180' : ''}`} />
        </div>} */}

        <div className=' block group-hover:hidden absolute bottom-0 left-0 w-full h-[5.875rem] translate-y-[1.2rem]' style={{borderRadius: '0.625rem 0.625rem 0rem 0rem', background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, #000 100%)'}}></div>
        <div className=" hidden group-hover:block absolute bottom-0 left-0 w-full h-[5.875rem] rounded-t-[0.625rem]" style={{background: 'linear-gradient(180deg, rgba(236, 62, 111, 0.00) 0%, #EC3E6F 100%)'}}></div>
        
        {TagIcon[data.tag] && <div className='absolute bottom-[1.06rem] left-[1.5rem] size-[2.5rem] bg-red-10 rounded-full border-2 border-white flex-center'>
          <img className='size-[1.25rem]' src={TagIcon[data.tag]} alt={data.symbol} />
        </div>}

      </div>

      <div className="relative bg-black-30 group-hover:bg-red-10 h-[13.84rem] px-[1.56rem] mdup:px-[0.875rem] pt-[1.44rem] pb-[1rem] mdup:py-[0.63rem] text-[0.875rem] flex flex-col">
        <a target='_blank' onClick={e => e.stopPropagation()} href={`${blockExploreUrl}/address/${data.user_address}`} className=' font-medium'>
          <span className='text-white opacity-60'>Create By:</span> 
          {formatAddress(data.user_address, 4, 6)}
        </a>
        
        <div className='text-[1rem] font-medium'>
          {data.name}($ {data.symbol})
        </div>
        
        <div className='text-white opacity-60 group-hover:opacity-70 mt-[0.56rem] line-clamp-3'>
          {data.description}
        </div>

        <div className='w-full flex-1'></div>
        
        <div className=' '>
          <span className='text-white opacity-60'>Market Cap:</span>  
          {data.market_cap && <span className='font-semibold text-[0.875rem]'> ${ formatNumberLocale(formatAmount(data.market_cap)) }</span>}
        </div>
        
        {!isOnUniswap && <div className="flex items-center gap-[1.31rem] mt-[0.5rem]">
          <div className="relative flex-1 h-[0.625rem] rounded-[0.625rem]">
            <div className='absolute top-0 left-0 w-full h-full rounded-[0.625rem] bg-[#D9D9D9] group-hover:bg-white opacity-20'></div>
            <div className={`absolute top-0 left-0 h-full rounded-[0.625rem] bg-gradient-to-r from-red-10 to-[#FFADC4] group-hover:from-white group-hover:to-white`} style={{width: `${data.bonding_curve !== null ? Big(data.bonding_curve).times(100).toFixed(2) : 0}%`}}></div>
          </div>
          {data.bonding_curve !== null && <div>{formatAmount(Number(data.bonding_curve) * 100)}%</div>}
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
    return <img className='size-full object-cover' src={src} loading="lazy" alt="" />
  }

  return <img ref={ref} className='size-full object-cover' src={ inView ? src : ''} loading="lazy" alt="" />
}