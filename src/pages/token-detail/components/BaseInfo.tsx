import { CopyIcon, TelegramIcon, WebsiteIcon, XIcon } from './Icon'
import { copyText, formatAddress, formatAmount, formatNumber } from '@/utils/utils'
import { toastSuccess } from '@/components/toast'
import clsx from 'clsx'
import { TokenBaseInfoResponse } from '../types/response'
export default function BaseInfo({data, tokenAddress}: {data: TokenBaseInfoResponse, tokenAddress: string}) {
  const {token_basic} = data

  const LinkData = [
    {
      name: 'x',
      link: token_basic.twitter,
      icon: <XIcon />
    },
    {
      name: 'Telegram',
      link: token_basic.telegram,
      icon: <TelegramIcon />
    },
    {
      name: 'Website',
      link: token_basic.website,
      icon: <WebsiteIcon />
    }
  ]

  const MetricData = [
    {
      name: 'Price',
      value: formatNumber(token_basic.price),
      change: formatAmount(Number(token_basic.price_rate24h) * 100)
    },
    {
      name: 'Market Cap',
      value: `$${formatNumber(token_basic.market_cap)}`,
    },
    {
      name: 'Virtual Liquidity',
      value: `$${formatNumber(token_basic.liquidity)}`,
    },
    {
      name: '24H Volume',
      value: `$${formatNumber(token_basic.volume24h)}`,
    },
    {
      name: 'Total Supply',
      value: formatNumber(token_basic.total_supply),
    }
  ]

  return (
    <div className=" bg-black-10 rounded-[0.625rem] px-[0.63rem] mdup:px-8 py-[1.19rem] mdup:py-[1.25rem]">
      <div className='flex justify-start gap-[1.41rem] mdup:gap-[1.76rem]'>
        <img className='w-[6.07rem] h-[8.125rem] mdup:w-[7.5rem] mdup:h-[10.03rem] rounded-[0.625rem] object-contain' src={token_basic.icon} alt="" />
        <div className='w-full flex flex-col justify-between'>
          <div className='w-full flex flex-col mdup:flex-row justify-between'>
            <div>
              <div className='text-white font-medium mdup:font-normal line-clamp-2 mdup:line-clamp-1 mdup:text-[1.75rem]'>
                {token_basic.name}({token_basic.symbol})
              </div>
              <div className='text-[0.88rem] mt-[0.31rem]'>
                <span className='text-white/60 text-[0.875rem]'>Contract:</span><br className='block mdup:hidden' />
                {` `}
                <span className='font-medium text-[0.875rem]'>
                  <span className=' mdup:inline-block hidden'>{tokenAddress}</span> 
                  <span className='inline-block mdup:hidden'>{formatAddress(tokenAddress, 9, 9)}</span>
                  <button onClick={() => {
                    copyText(tokenAddress)
                    toastSuccess('Copied')
                  }} className='ml-[0.8rem]'><CopyIcon className='inline-block size-[0.75rem]' /></button>
                </span>
              </div>
            </div>

            <div className='flex gap-[0.44rem] mdup:mt-2'>
              {LinkData.filter(item => item.link).map((item, index) => (
                <a key={index} href={item.link} target="_blank" rel="noopener noreferrer" className="size-[1.975rem] bg-white/10 rounded-full flex items-center justify-center">
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          <div className='hidden mdup:flex flex-row justify-between gap-[0.62rem]'>
            {MetricData.map((item, index) => {
              const isPrice = item.name === 'Price'

              return <div key={index} className='flex flex-col items-start justify-center bg-white/10 w-1/5 rounded-[0.625rem] px-[1.75rem] md:px-[1.33rem] py-[0.8rem]'>
              <div className={`flex gap-[0.67rem]}`}>
                <span className='text-white/60 font-semibold'>{item.name}</span>
                {item.change && <span className={`${item.change.startsWith('-') ? 'text-[#FF0021]' : 'text-[#06D188]'} font-semibold ${isPrice && 'w-[66%] ml-[0.67rem] leading-[100%]'}`}>
                  {item.change.replace('-', '')}% 
                  <ArrowIcon isUp={!item.change.startsWith('-')} className='inline-block size-[0.875rem] mt-[-3px]' />
                </span>}
              </div>
              <div className='text-white text-[1.25rem] font-semibold'>{item.value}</div>
            </div>
            })}
          </div>
        </div>
      </div>
      <div className=' w-full px-[0.31rem] mt-[0.94rem] mdup:hidden'>
        <div className='size-full  bg-white/10 rounded-[0.625rem] px-[0.96rem] py-[1.41rem] flex flex-col gap-[1.12rem]'>
          {MetricData.map((item, index) => (
            <div key={index} className='flex justify-between items-center text-[0.875rem] font-semibold'>
              <div className='text-white/60'>{item.name}</div>
              <div className='flex items-center gap-[0.31rem]'>
                {item.change && <span className='text-[#06D188]'>{item.change} <ArrowIcon isUp={true} className='inline-block size-[0.875rem] mt-[-3px]' /></span>}
                <span>{item.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


function ArrowIcon({className, isUp}: {className?: string, isUp: boolean}) {

  const color = isUp ? '#06D188' : '#FF0021'

  return <svg className={clsx(`${!isUp ? 'rotate-180' : ''}`,className)} xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M7.39258 2.21399V12.714" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3.89258 5.71399L7.39258 2.21399L10.8926 5.71399" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
}