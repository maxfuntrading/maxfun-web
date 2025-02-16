
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect, useState } from 'react';
import { fetchMarquee, Marquee } from '@/api/home';
import {formatAddress, formatAmount } from '@/utils/utils';
import { TagIcon } from '@/components/TagIcon';
import { useNavigate } from 'react-router-dom';
import './hottx.css'

export default function HotTx() {
  const [marquee, setMarquee] = useState<Marquee[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    fetchMarquee().then((res) => {
      if (!res || res.data.list.length === 0) {
        return
      }

      if (res.data.list.length < 10) {
        // 如果列表长度小于10，则重复列表
        const repeatedList = []
        for (let i = 0; i < Math.ceil(10 / res.data.list.length); i++) {
          repeatedList.push(...res.data.list)
        }
        setMarquee(repeatedList.slice(0, 10))
      } else {
        setMarquee(res.data.list)
      }
    }).finally(() => {
      setIsLoading(false)
    })
  }, [])

  if (isLoading || marquee.length === 0) return null

  return (
    <div className=" w-full ">
      <div className='flex flex-col mdup:flex-row h-20 mdup:h-[5.625rem] overflow-hidden hot-tx-box group'>
        <div className={`hot-tx-group`} style={{'--scroll-duration': `${marquee.length}s`} as any}>
          {marquee.map((item, index) => (
            <HotTxItem key={index} data={item} />
          ))}
        </div>
      </div>
    </div>
  )
}

const HotTxItem = ({data}: {data: Marquee}) => {
  const navigate = useNavigate()
  const isBought = data.trade_type === 0
  return (
    <div onClick={() => navigate(`/token/${data.token_address}`)} className="shrink-0 h-20 bg-black-10 hover:bg-black-30 min-w-[18.75rem] mdup:w-[22.5rem] mdup:h-[5.625rem] rounded-[0.625rem] mdup:rounded-none flex justify-between items-center px-[1.32rem] mdup:px-[0.87rem] cursor-pointer border-2 border-transparent hover:border-[#EC3E6F] mdup:hover:rounded-[0.625rem] transition-all duration-300 mr-[0.06rem]">
      <div className='flex items-center gap-[1.71rem] flex-1'>
        <img className='size-[3.375rem]' src={`${data.icon}`} alt="token" />
        
        <div className='flex flex-col flex-1 text-[0.875rem] mdup:text-[1rem] leading-[1.4]'>
          <div className='text-[#DFE2EA] mdup:font-semibold'>{formatAddress(data.user_address, 4, 6)}</div>
          <div className=' w-full truncate max-w-[8rem] mdup:max-w-[10rem]'>
            <span className={`font-semibold ${isBought ? 'text-[#06D188]' : 'text-[#EC3E6F]'}`}>{isBought ? 'Bought' : 'Sold'}</span>
            {' '}
            <span className='mdup:text-[#9DA5B6] mdup:font-semibold'>{formatAmount(data.amount)} {data.symbol}</span>
          </div>
          <div className='text-[#9DA5B6] mdup:font-semibold mdup:text-white'>{data.tag}</div>
        </div>
      </div>

      {data.tag && TagIcon[data.tag] && <img className='flex-shrink-0 size-[2.25rem] mdup:size-[2.5rem]' src={TagIcon[data.tag]} alt={data.tag} />}
    </div>
  )
}