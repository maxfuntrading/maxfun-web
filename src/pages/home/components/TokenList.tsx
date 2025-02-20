import SearchIcon from '@/assets/icons/search.png'
import { useEffect, useState } from 'react'
import Select, { SelectOptionType } from '../../../components/Select';
import { SortOrder, SortType } from '../type';
import { AscendingIcon, DescendingIcon, RefreshIcon } from './Icon'
import TokenCard from '@/components/TokenCard'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import LoadingMore from '@/components/LoadingMore'
import { fetchTag } from '@/api/common'
import { ERR_CODE } from '@/constants/ERR_CODE'
import { TagIcon } from '@/components/TagIcon'
import { fetchTokenList, FetchTokenListParams, MaxFunToken } from '@/api/home';

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

  const [tags, setTags] = useState<SelectOptionType<string>[]>([])
  const [selectTag, setSelectTag] = useState<SelectOptionType<string>>({
    key: 'All',
    value: 'All'
  })
  const [selectSort, setSelectSort] = useState<SelectOptionType<SortType>>(SortSelectList[0])
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.Descending) // 是否升序

  // data
  const [loading, setLoading] = useState(false)
  const [tokenList, setTokenList] = useState<MaxFunToken[]>([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState<number>()
  const [isStopLoadMore, setIsStopLoadMore] = useState(false)
  let isFirstLoad = true

  // 获取token list
  const getTokenList = async (search: string, tag: string, isOnUniswap: boolean, sortBy: SortType, sortOrder: SortOrder, page: number) => {
    if (loading) return
    const params: FetchTokenListParams = {
      keyword: search,
      tag,
      is_launched: isOnUniswap,
      sort_by: sortBy,
      sort_order: sortOrder,
      page: page,
      page_size: 20
    }
    const paramsFilter = Object.fromEntries(Object.entries(params).filter(([, v]) => v || v))
    if (params.tag === 'All') {
      delete paramsFilter.tag
    }

    setLoading(true)
    const res = await fetchTokenList(paramsFilter).finally(() => {
      setLoading(false)
    })

    if (!res || res.code !== ERR_CODE.SUCCESS) {
      setIsStopLoadMore(true)
      return
    }

    if (page === 1) {
      setTotal(res.data.total)
      setTokenList(res.data.list)
    } else {
      setTokenList(prev => [...prev, ...res.data.list])
    }
  }
  
  const onLoadMore = () => {
    if (!total) return;
    if (loading) return;
    if (isStopLoadMore) return;
    if (tokenList.length === 0) return;
    if (tokenList.length >= total) return;

    setPage(prev => prev + 1)
    getTokenList(search, selectTag.value, isOnUniswap, selectSort.key, sortOrder, page + 1);
  }
  const loadMoreRef = useInfiniteScroll({
    onLoadMore,
    loading
  })

  const onSearch = () => {
    if (loading) return;
    setPage(1)
    setTokenList([])
    getTokenList(search, selectTag.value, isOnUniswap, selectSort.key, sortOrder, 1);
  }
  
  const onChangeLaunched = (val: boolean) => {
    setIsOnUniswap(val)
    setPage(1)
    setTokenList([])
    getTokenList(search, selectTag.value, val, selectSort.key, sortOrder, page);
  }

  const onChangeSort = (val: SelectOptionType<SortType>) => {
    setSelectSort(val)
    setPage(1)
    setTokenList([])
    getTokenList(search, selectTag.value, isOnUniswap, val.key, sortOrder, page);
  }

  const onChangeSortOrder = (val: SortOrder) => {
    setSortOrder(val)
    setPage(1)
    setTokenList([])
    getTokenList(search, selectTag.value, isOnUniswap, selectSort.key, val, page);
  }

  const onChangeTag = (val: SelectOptionType<string>) => {
    setSelectTag(val)
    setPage(1)
    setTokenList([])
    getTokenList(search, val.value, isOnUniswap, selectSort.key, sortOrder, page);
  }

  const onRefresh = () => {
    // setTokens(0)
    // onLoadMore()
    setPage(1)
    setTokenList([])
    getTokenList(search, 'All', isOnUniswap, selectSort.key, sortOrder, 1);
  }

    // 获取tag
    useEffect(() => {
      const getTags = async () => {
        const res = await fetchTag()
        if (!res || res.code !== ERR_CODE.SUCCESS || !res.data.list.length) return
        const tagList = res.data.list.map(item => ({
          key: `${item.sort}`,
          value: item.name,
          icon: TagIcon[item.name] ?? ''
        }))
        const all = {
          key: '',
          value: 'All',
        }
        setTags([all, ...tagList])
        setSelectTag(all)
      }
      getTags()
    }, [])

  useEffect(() => {
    if (isFirstLoad) {
      getTokenList(search, selectTag?.key || 'All', isOnUniswap, selectSort.key, sortOrder, page);
    }

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      isFirstLoad = false
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="w-full my-container mx-auto pt-[1.1rem] mdup:px-0">
      
      <div className="w-full flex flex-col mdup:flex-row mdup:gap-[2.55rem]">
        {/* search */}
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

        {/* 筛选-pc端 */}
        <div className='w-full mdup:w-auto gap-[0.62rem] mt-[0.73rem] mdup:mt-0 hidden mdup:flex'>
          <button onClick={() => onChangeLaunched(!isOnUniswap)} className='flex w-[10.3125rem] md:w-[13.75rem] lg:w-[16.25rem] h-[2.5rem] mdup:h-[3.125rem] rounded-[0.625rem] outline-none bg-black-20 border-[2px] border-red-10  px-[0.56rem] md:px-[1.09rem] lg:px-[1.22rem] cursor-pointer items-center justify-start gap-[0.67rem]'>
            <span className={`size-4 border-[2px] border-white rounded-full ${isOnUniswap ? 'bg-red-10' : 'bg-transparent'}`}></span>
            <span>List on Uniswap</span>
          </button>

          <Select 
            className='sm:w-1/2'
            defaultOption={selectSort}
            options={SortSelectList} 
            onSelect={(val) => onChangeSort(val)}
            />

          {selectTag && <Select 
            className='sm:w-1/2'
            defaultOption={selectTag}
            options={tags} 
            onSelect={(val) => onChangeTag(val)} />}

          <button onClick={() => onChangeSortOrder(sortOrder === SortOrder.Descending ? SortOrder.Ascending : SortOrder.Descending)} className='flex size-[3.125rem] border-[2px] border-red-10 rounded-[0.625rem] items-center justify-center'>
            {sortOrder === SortOrder.Descending ? <DescendingIcon className='size-[1.25rem]' /> : <AscendingIcon className='size-[1.25rem]' />}
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
              onRefresh()
            }}
            className='flex size-[3.125rem] border-[2px] border-red-10 rounded-[0.625rem] items-center justify-center'
          >
            <RefreshIcon className="refresh-icon" />
          </button>
        </div>

        {/* filter-mobile */}
        <div className='flex mdup:hidden flex-col gap-[0.81rem] mt-[0.78rem]'>
          <div className='flex justify-between gap-[0.56rem]'>
            <button onClick={() => onChangeLaunched(!isOnUniswap)} className='flex w-1/2 h-[2.5rem] mdup:h-[3.125rem] rounded-[0.625rem] outline-none bg-black-20 border-[2px] border-red-10  px-[0.56rem] md:px-[1.09rem] lg:px-[1.22rem] cursor-pointer items-center justify-start gap-[0.67rem]'>
              <span className={`size-4 border-[2px] border-white rounded-full ${isOnUniswap ? 'bg-red-10' : 'bg-transparent'}`}></span>
              <span>List on Uniswap</span>
            </button>

            {selectTag && <Select 
              className='sm:w-1/2'
              defaultOption={selectTag}
              options={tags} 
              onSelect={(val) => onChangeTag(val)} />}
          </div>

          <div className='flex justify-between gap-[0.56rem]'>
            <Select 
              className='flex-1'
              defaultOption={selectSort}
              options={SortSelectList} 
              onSelect={(val) => onChangeSort(val)}
              />

              <button onClick={() => onChangeSortOrder(sortOrder === SortOrder.Descending ? SortOrder.Ascending : SortOrder.Descending)} className='flex size-[2.5rem] mdup:size-[3.125rem] border-[2px] border-red-10 rounded-[0.625rem] items-center justify-center'>
                {sortOrder === SortOrder.Descending ? <DescendingIcon className='size-[1.25rem]' /> : <AscendingIcon className='size-[1.25rem]' />}
              </button>

              <button 
                onClick={() => {
                  const icon = document.querySelector('.refresh-icon-mobile');
                  if (icon) {
                    icon.animate([
                      { transform: 'rotate(0deg)' },
                      { transform: 'rotate(360deg)' }
                    ], {
                      duration: 500,
                      iterations: 1
                    });
                  }
                  onRefresh()
                }}
                className='flex size-[2.5rem] mdup:size-[3.125rem] border-[2px] border-red-10 rounded-[0.625rem] items-center justify-center'
              >
                <RefreshIcon className="refresh-icon-mobile" />
              </button>
          </div>
        </div>
      </div>

      <div className=' mt-4 flex flex-col gap-[0.94rem] mdup:gap-x-[1.67rem] mdup:gap-y-[1.25rem] mdup:flex-row mdup:flex-wrap'>
        {tokenList.map((item, index) => (
          <TokenCard 
            key={index} 
            className=' mdup:w-[calc(25%-1.26rem)]'
            data={item}
           />
        ))}
      </div>
      {loading && <LoadingMore className='mt-[3rem]' />}
      <div ref={loadMoreRef} className="h-4 w-full"></div>

    </div>
  )
}