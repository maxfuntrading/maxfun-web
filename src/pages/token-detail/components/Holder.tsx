import { fetchHolderDistribution } from '@/api/token-detila'
import LoadingMore from '@/components/LoadingMore'
import { ERR_CODE } from '@/constants/ERR_CODE'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { HolderDistributionItemResponse } from '../types/response'
import { formatAddress } from '@/utils/utils'
import { useAccount } from 'wagmi'
export default function Holder({className, tokenAddress}: {className?: string, tokenAddress: string}) {
  const { chain } = useAccount()

  const [page, setPage] = useState(1)
  const [data, setData] = useState<HolderDistributionItemResponse[]>([])
  const [total, setTotal] = useState<number>()
  const [isLoadingList, setIsLoadingList] = useState(false)

  const onLoadMore = () => {
    if (isLoadingList) return
    if (total === undefined) return
    if (data.length >= total) return

    setPage(page + 1)
    getData(page + 1)
  }

  const loadMoreRef = useInfiniteScroll({
    onLoadMore,
    loading: isLoadingList
  })

  const getData = (page: number) => {
    setIsLoadingList(true)
    fetchHolderDistribution(tokenAddress, page, 20).then(res => {
      if (res.code !== ERR_CODE.SUCCESS) return
      setData([...data, ...res.data.list])
      total === undefined && setTotal(res.data.total_holders)
      setIsLoadingList(false)
    }).finally(() => {
      setIsLoadingList(false)
    })
  }

  useEffect(() => {
    getData(page)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={clsx("w-full bg-black-10 rounded-[0.625rem] px-[0.91rem] mdup:px-0 py-4 mdup:py-[1.37rem]", className)}>
      <div className='flex justify-between items-center mdup:px-[1.55rem]'>
        <span className='text-[1.25rem]'>Holder Distribution</span>
        <span className='text-[0.875rem]'>{`${total !== undefined ? total : ''}`}</span>
      </div>

      <div className='text-[0.875rem] text-white/60 flex justify-between items-center mt-2 mdup:px-[1.55rem]'>
        <span>Account</span>
        <span>Percentage</span>
      </div>

      <div className='mt-3 scrollbar mdup:scrollbar-none mdup:overflow-y-auto mdup:overflow-x-hidden mdup:h-[38rem] mdup:pl-[1.55rem] mdup:pr-[0.55rem] mdup:mr-[1rem]'>
        {data.map((item, index) => {
          return <div key={index} className='mdup:w-[27rem] flex justify-between items-center h-[2.5rem] mdup:h-[3.75rem] border-b border-white/10 first:border-t'>
            <div className='flex items-center gap-[0.59rem]'>
              <a href={`${chain?.blockExplorers?.default.url}/address/${item.user_address}`} target='_blank' className='flex items-center gap-[0.59rem]'>
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <path d="M8.30737 2.177H12.3907V6.26034" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12.3906 9.0235V11.802C12.3906 12.2853 11.9989 12.677 11.5156 12.677H2.76562C2.28238 12.677 1.89062 12.2853 1.89062 11.802V3.052C1.89062 2.56875 2.28238 2.177 2.76562 2.177H5.39062" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7.66553 6.90195L12.128 2.43945" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className='text-[0.75rem] mdup:text-[0.875rem] font-medium'>{formatAddress(item.user_address, 10, 9)}</span>
              </a>
            </div>
            <span className='text-[0.75rem] mdup:text-[0.875rem] font-semibold text-[#06D188]'>{item.percentage}%</span>
          </div>
        })}
        <div ref={loadMoreRef} className="w-full"></div>
        {isLoadingList && <LoadingMore />}
      </div>

    </div>
  )
}