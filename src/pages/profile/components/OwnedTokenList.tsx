import { useEffect, useState } from 'react'
import SearchInput from './SearchInput'
import FlatButton from '@/components/button/FlatButton'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import LoadingMore from '@/components/LoadingMore'
import { useNavigate } from 'react-router-dom'
import OwnedTokenCard from './OwnedTokenCard'
import { TokenOwnedItem } from '../type'
import { fetchTokenOwned } from '@/api/profile'
import { ERR_CODE } from '@/constants/ERR_CODE'

export default function OwnedTokenList() {

  // data
  const [tokenList, setTokenList] = useState<TokenOwnedItem[]>([])
  const [total, setTotal] = useState<number>()
  const [isLoadingTokenList, setIsLoadingTokenList] = useState(false)
  const [page, setPage] = useState(1)
  const [isStopLoadMore, setIsStopLoadMore] = useState(false)
  let isFirstLoad = true

  const navigate = useNavigate()

  const getTokenOwnenData = async (keyword: string, page: number) => {
    const params = {
      keyword,
      page,
    }
    setIsLoadingTokenList(true)
    fetchTokenOwned(params).then((res) => {
      if (res.code !== ERR_CODE.SUCCESS) {
        return
      }
      if (page === 1) {
        setTokenList(res.data.list)
        setTotal(res.data.total)
      } else {
        setTokenList((prev) => [...prev, ...res.data.list])
      }
    }).catch(() => {
      setIsStopLoadMore(true)
    }).finally(() => {
      setIsLoadingTokenList(false)
    })
  }

  useEffect(() => {
    if (isFirstLoad) {
      getTokenOwnenData('', 1)
    }
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      isFirstLoad = false
    }
  }, [])

  const onLoadMore = () => {
    if (!total) return;
    if (isLoadingTokenList) return;
    if (isStopLoadMore) return;
    if (tokenList.length === 0) return;
    if (tokenList.length >= total) {
      return
    }
    setPage(page + 1)
    getTokenOwnenData('', page + 1)
  }

  const loadMoreRef = useInfiniteScroll({
    onLoadMore,
    loading: isLoadingTokenList,
  })

  return (
    <div className="flex flex-col items-center gap-4 mdup:items-end mt-4 mdup:mt-[-4rem]">
      <div className="flex flex-row items-center gap-4 mb-2 mdup:mb-4 w-full mdup:w-auto">
        <div className="flex flex-row items-center gap-4 w-3/5 mdup:w-[22.5rem] mr-2">
          <SearchInput
            onSearch={(str) => {
              if (isLoadingTokenList) return;
              setPage(1)
              getTokenOwnenData(str, 1)
            }}
          />
        </div>
        <FlatButton
          className="!w-[7.5rem] mdup:!w-[10rem] h-[2.5rem] mdup:h-[3.125rem]"
          onClick={() => navigate('/launcher')}
        >
          Create Token
        </FlatButton>
      </div>
      <div className="mdup:mt-4 flex w-full flex-col gap-[0.94rem] mdup:gap-x-[1.67rem] mdup:gap-y-[0.625rem] mdup:flex-col mdup:bg-[#1e2022] rounded-[0.625rem] mdup:p-[1.25rem]">
        <div className="text-base font-semibold hidden mdup:flex flex-row mb-2 items-center opacity-60">
          <div className="px-10 py-2 text-left flex-1 text-[1.125rem]">
            Token
          </div>
          <div className="px-4 py-2 text-left flex-1 text-[1.125rem]">
            Quantity
          </div>
          <div className="px-4 py-2 text-left flex-1 text-[1.125rem]">
            Value
          </div>
        </div>
        {tokenList.map((token, index) => (
          <OwnedTokenCard key={index} token={token} />
        ))}
      </div>
      {isLoadingTokenList && <LoadingMore className="mt-[3rem]" />}
      <div ref={loadMoreRef} className="h-4 w-full"></div>
    </div>
  )
}
