import SearchIcon from '@/assets/icons/search.png'
import InfraIcon from '@/assets/icons/infra.png'
import Web3GameIcon from '@/assets/icons/web3-game.png'
import AiGameIcon from '@/assets/icons/ai-game.png'
import AiAgentIcon from '@/assets/icons/ai-agent.png'
import IpIcon from '@/assets/icons/ip.png'
import EsportsIcon from '@/assets/icons/esports.png'
import MoviesIcon from '@/assets/icons/movies.png'
import { useState } from 'react'
import Select from './Select';
import { TokenTag, SelectOptionType, SortType } from '../type';

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
  const [selectTag, setSelectTag] = useState<SelectOptionType<TokenTag>>(TokenTagSelectList[0])
  const [selectSort, setSelectSort] = useState<SelectOptionType<SortType>>(SortSelectList[0])

  const onSearch = () => {
    console.log('search', search);
  }

  return (
    <div className="w-full my-container mx-auto h-[126.7rem] pt-[1.1rem] px-4 mdup:px-0">
      
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
        </div>
      </div>


    </div>
  )
}