import { useState } from 'react'
import SearchInput from './SearchInput'
import FlatButton from '@/components/button/FlatButton'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import TokenCard from '@/components/TokenCard'
import LoadingMore from '@/components/LoadingMore'
import { useNavigate } from 'react-router-dom'

export default function CreatedTokenList() {
  const [tokens, setTokens] = useState(0)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onLoadMore = () => {
    if (loading) return
    if (tokens >= 30) return
    setLoading(true)
    setTimeout(() => {
      setTokens((prev) => prev + 15)
      setLoading(false)
    }, 1000)
  }

  const loadMoreRef = useInfiniteScroll({
    onLoadMore,
    loading,
  })

  return (
    <div className="flex flex-col items-center gap-4 mdup:items-end mt-4 mdup:mt-[-4rem]">
      <div className="flex flex-row items-center gap-4 mb-4 w-full mdup:w-auto">
        <div className="flex flex-row items-center gap-4 w-3/5 mdup:w-[22.5rem] mr-2">
          <SearchInput
            onSearch={(str) => {
              console.log('>>search', str)
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
      <div className=" mt-4 flex flex-col gap-[0.94rem] mdup:gap-x-[1.67rem] mdup:gap-y-[1.25rem] mdup:flex-row mdup:flex-wrap">
        {Array.from({ length: tokens }).map((_, index) => (
          <TokenCard key={index} className=" mdup:w-[calc(25%-1.26rem)]" />
        ))}
      </div>
      {loading && <LoadingMore className="mt-[3rem]" />}
      <div ref={loadMoreRef} className="h-4 w-full"></div>
    </div>
  )
}
