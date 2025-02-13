import { fetchHolderDistribution } from '@/api/token-detila'
import LoadingMore from '@/components/LoadingMore'
import { ERR_CODE } from '@/constants/ERR_CODE'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { HolderDistributionItemResponse } from '../types/response'
import { formatAddress, formatAmount } from '@/utils/utils'
import { VITE_BLOCK_EXPLORER_URL } from '@/utils/runtime-config'
export default function Holder({className, tokenAddress}: {className?: string, tokenAddress: string}) {
  const [page, setPage] = useState(1)
  const [data, setData] = useState<HolderDistributionItemResponse[]>([])
  const [total, setTotal] = useState<number>()
  const [isLoadingList, setIsLoadingList] = useState(false)

  const onLoadMore = () => {
    if (isLoadingList) return
    if (data.length === 0) return
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
      if (page === 1) {
        setData(res.data.list)
      } else {
        setData(prev => [...prev, ...res.data.list])
      }
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
              <a href={`${VITE_BLOCK_EXPLORER_URL}/address/${item.user_address}`} target='_blank' className='flex items-center gap-[0.59rem] group'>
                <svg className='block group-hover:hidden' xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M11.6665 2.5H17.4998V8.33333" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M17.5 12.2807V16.25C17.5 16.9404 16.9404 17.5 16.25 17.5H3.75C3.05965 17.5 2.5 16.9404 2.5 16.25V3.75C2.5 3.05965 3.05965 2.5 3.75 2.5H7.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10.75 9.25L17.125 2.875" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <svg className='hidden group-hover:block' xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M10.6667 1.5H16.5V7.33333M16.5 11.2807V15.25C16.5 15.9404 15.9404 16.5 15.25 16.5H2.75C2.05965 16.5 1.5 15.9404 1.5 15.25V2.75C1.5 2.05965 2.05965 1.5 2.75 1.5H6.5M9.74992 8.24996L16.1249 1.87496" stroke="#EC3E6F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>

                <span className='text-[0.75rem] mdup:text-[0.875rem] font-medium hover:text-red-10'>{formatAddress(item.user_address, 10, 9)}</span>
              </a>
            </div>
            <span className='text-[0.75rem] mdup:text-[0.875rem] font-semibold text-[#06D188]'>{formatAmount(Number(item.percentage) * 100)}%</span>
          </div>
        })}
        <div ref={loadMoreRef} className="w-full"></div>
        {isLoadingList && <LoadingMore />}
      </div>

    </div>
  )
}