import { useEffect, useState } from 'react'
import SearchInput from './SearchInput'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
// import TokenCard from '@/components/TokenCard'
import LoadingMore from '@/components/LoadingMore'
import { useNavigate } from 'react-router-dom'
import { fetchTokenCreated } from '@/api/profile'
import { ERR_CODE } from '@/constants/ERR_CODE'
import { MaxFunToken } from '@/api/home'
import TokenCard from '@/components/TokenCard'
import SolidButton from '@/components/button/SolidButton'
export default function CreatedTokenList() {
  const navigate = useNavigate()

  // data
  const [tokenList, setTokenList] = useState<MaxFunToken[]>([])
  const [total, setTotal] = useState<number>()
  const [isLoadingTokenList, setIsLoadingTokenList] = useState(false)
  const [page, setPage] = useState(1)
  const [isStopLoadMore, setIsStopLoadMore] = useState(false)
  let isFirstLoad = true

  const getTokenCreatedData = async (keyword: string, page: number) => {
    const params = {
      keyword,
      page,
    }
    setIsLoadingTokenList(true)
    fetchTokenCreated(params).then((res) => {
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
      getTokenCreatedData('', 1)
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
    getTokenCreatedData('', page + 1)
  }

  const loadMoreRef = useInfiniteScroll({
    onLoadMore,
    loading: isLoadingTokenList,
  })

  return (
    <div className="flex flex-col items-center gap-4 mdup:items-end mt-4 mdup:mt-[-4rem]">
      <div className="flex flex-row items-center gap-4 mb-4 w-full mdup:w-auto">
        <div className="flex flex-row items-center gap-4 w-3/5 mdup:w-[22.5rem] mr-2">
          <SearchInput
            onSearch={(str) => {
              if (isLoadingTokenList) return;
              setPage(1)
              getTokenCreatedData(str, 1)
            }}
          />
        </div>
        <SolidButton
          className="!w-[7.5rem] mdup:!w-[10rem] !h-[2.5rem] mdup:!h-[3.125rem]"
          onClick={() => navigate('/launcher')}
        >
          Create Token
        </SolidButton>
      </div>
      <div className=" w-full mt-4 flex flex-col gap-[0.94rem] mdup:gap-x-[1.67rem] mdup:gap-y-[1.25rem] mdup:flex-row mdup:flex-wrap">
        {tokenList.map((token, index) => (
          <TokenCard key={index} data={token} className=" mdup:w-[calc(25%-1.26rem)]" />
        ))}
      </div>
      {isLoadingTokenList && <LoadingMore className="mt-[3rem]" />}
      <div ref={loadMoreRef} className="h-4 w-full"></div>
    </div>
  )
}
