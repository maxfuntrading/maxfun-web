import SearchIcon from '@/assets/icons/search.png'
import InfraIcon from '@/assets/icons/infra.png'
import Web3GameIcon from '@/assets/icons/web3-game.png'
import AiGameIcon from '@/assets/icons/ai-game.png'
import AiAgentIcon from '@/assets/icons/ai-agent.png'
import IpIcon from '@/assets/icons/ip.png'
import EsportsIcon from '@/assets/icons/esports.png'
import MoviesIcon from '@/assets/icons/movies.png'
import { useState } from 'react'
import Select, { SelectOptionType } from '../../../components/Select';
import { TokenTag, SortType } from '../type';
import { AscendingIcon, DescendingIcon, RefreshIcon } from './Icon'
import TokenCard from '@/components/TokenCard'

const TokenTagSelectList: SelectOptionType<TokenTag>[] = [
  {
    key: TokenTag.All,
    value: 'All'
  },
  {
    key: TokenTag.Infra,
    value: 'Infra',
    icon: InfraIcon
  },
  {
    key: TokenTag.Web3Game,
    value: 'Web3 Game',
    icon: Web3GameIcon
  },
  {
    key: TokenTag.AiGame,
    value: 'Ai Game',
    icon: AiGameIcon
  },
  {
    key: TokenTag.AiAgent,
    value: 'Ai Agent',
    icon: AiAgentIcon
  },
  {
    key: TokenTag.IP,
    value: 'IP',
    icon: IpIcon
  },
  {
    key: TokenTag.Esports,
    value: 'Esports',
    icon: EsportsIcon
  },
  {
    key: TokenTag.Movies,
    value: 'Movies',
    icon: MoviesIcon
  },
]

const SortSelectList: SelectOptionType<SortType>[] = [
  {
    key: SortType.LaunchedTime,
    value: 'Launched Time'
  },
  {
    key: SortType.TradingVolume,
    value: 'Trading Volume'
  },
  {
    key: SortType.MarketCap,
    value: 'Market Cap'
  },
  {
    key: SortType.LastTrade,
    value: 'Last Trade'
  },
]

export default function TokenList() {
  const [search, setSearch] = useState('')
  const [isOnUniswap, setIsOnUniswap] = useState(false)
  const [selectTag, setSelectTag] = useState<SelectOptionType<TokenTag>>(TokenTagSelectList[0])
  const [selectSort, setSelectSort] = useState<SelectOptionType<SortType>>(SortSelectList[0])
  const [isAscending, setIsAscending] = useState(true) // 是否升序

  const onSearch = () => {
    console.log('search', search);
  }

  return (
    <div className="w-full my-container mx-auto pt-[1.1rem] px-4 mdup:px-0">
      
      <div className="w-full flex flex-col mdup:flex-row mdup:gap-[2.55rem]">
        {/* 搜索 */}
        <div className="relative w-full mdup:flex-1 h-[3rem] flex gap-4">
          <input 
            className=" flex-1 h-full bg-transparent outline-none"
            type="text"
            placeholder='Search Token'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onSearch()
              }
            }}
          />
          <button onClick={onSearch}>
            <img className='size-[0.875rem]' src={SearchIcon} alt="" />
          </button>
          <div className=" absolute w-full left-0 bottom-0 border-b-[2px] border-b-[#fff] rounded-[0.625rem] opacity-20"></div>
        </div>

        {/* 筛选 */}
        <div className='w-full mdup:w-auto flex gap-[0.62rem] mt-[0.73rem] mdup:mt-0'>
          <button onClick={() => setIsOnUniswap(prev => !prev)} className=' hidden mdup:flex w-[10.3125rem] md:w-[13.75rem] lg:w-[16.25rem] h-[2.5rem] mdup:h-[3.125rem] rounded-[0.625rem] outline-none bg-black-20 border-[2px] border-red-10  px-[0.56rem] md:px-[1.09rem] lg:px-[1.22rem] cursor-pointer items-center justify-start gap-[0.67rem]'>
            <span className={`size-4 border-[2px] border-white rounded-full ${isOnUniswap ? 'bg-red-10' : 'bg-transparent'}`}></span>
            <span>List on Uniswap</span>
          </button>

          <Select 
            className='sm:w-1/2'
            defaultOption={selectSort}
            options={SortSelectList} 
            onSelect={(val) => setSelectSort(val)}
            />

          <Select 
            className='sm:w-1/2'
            defaultOption={selectTag}
            options={TokenTagSelectList} 
            onSelect={(val) => setSelectTag(val)} />

          <button onClick={() => setIsAscending(prev => !prev)} className=' hidden mdup:flex size-[3.125rem] border-[2px] border-red-10 rounded-[0.625rem] items-center justify-center'>
            {isAscending ? <DescendingIcon className='size-[1.25rem]' /> : <AscendingIcon className='size-[1.25rem]' />}
          </button>

          <button 
            onClick={() => {
              const icon = document.querySelector('.refresh-icon');
              if (icon) {
                icon.animate([
                  { transform: 'rotate(0deg)' },
                  { transform: 'rotate(360deg)' }
                ], {
                  duration: 500,
                  iterations: 1
                });
              }
            }}
            className=' hidden mdup:flex size-[3.125rem] border-[2px] border-red-10 rounded-[0.625rem] items-center justify-center'
          >
            <RefreshIcon className="refresh-icon" />
          </button>

        </div>
      </div>

      <div className=' mt-4 flex flex-col gap-[0.94rem] mdup:gap-x-[1.67rem] mdup:gap-y-[1.25rem] mdup:flex-row mdup:flex-wrap'>
        {Array.from({length: 10}).map((_, index) => (
          <TokenCard 
            key={index} 
            className=' mdup:w-[calc(25%-1.26rem)]'
           />
        ))}
      </div>


    </div>
  )
}