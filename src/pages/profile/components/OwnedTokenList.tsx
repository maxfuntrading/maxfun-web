import { useState } from 'react'
import SearchInput from './SearchInput'
import FlatButton from '@/components/button/FlatButton'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import LoadingMore from '@/components/LoadingMore'
import { useNavigate } from 'react-router-dom'
import OwnedTokenCard, { OwnedTokenInfo } from './OwnedTokenCard'

export default function OwnedTokenList() {
  const [tokens, setTokens] = useState<OwnedTokenInfo[]>([
    {
      name: 'Token 1',
      symbol: 'TKN1',
      icon: '/avatar.png',
      address: '0x43684D03...9d426F042',
      quantity: 1000000000,
      value: 1000000000,
    },
    {
      name: 'Token 2',
      symbol: 'TKN2',
      icon: '/avatar.png',
      address: '0x43684D03...9d426F042',
      quantity: 1000000000,
      value: 1000000000,
    },
    {
      name: 'Token 3',
      symbol: 'TKN3',
      icon: '/avatar.png',
      address: '0x43684D03...9d426F042',
      quantity: 1000000000,
      value: 1000000000,
    },
    {
      name: 'Token 4',
      symbol: 'TKN4',
      icon: '/avatar.png',
      address: '0x43684D03...9d426F042',
      quantity: 1000000000,
      value: 1000000000,
    },
    {
      name: 'Token 5',
      symbol: 'TKN5',
      icon: '/avatar.png',
      address: '0x43684D03...9d426F042',
      quantity: 1000000000,
      value: 1000000000,
    },
    {
      name: 'Token 6',
      symbol: 'TKN6',
      icon: '/avatar.png',
      address: '0x43684D03...9d426F042',
      quantity: 1000000000,
      value: 1000000000,
    },
    {
      name: 'Token 7',
      symbol: 'TKN7',
      icon: '/avatar.png',
      address: '0x43684D03...9d426F042',
      quantity: 1000000000,
      value: 1000000000,
    },
    {
      name: 'Token 8',
      symbol: 'TKN8',
      icon: '/avatar.png',
      address: '0x43684D03...9d426F042',
      quantity: 1000000000,
      value: 1000000000,
    },
    {
      name: 'Token 9',
      symbol: 'TKN9',
      icon: '/avatar.png',
      address: '0x43684D03...9d426F042',
      quantity: 1000000000,
      value: 1000000000,
    },
    {
      name: 'Token 10',
      symbol: 'TKN10',
      icon: '/avatar.png',
      address: '0x43684D03...9d426F042',
      quantity: 1000000000,
      value: 1000000000,
    },
  ])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onLoadMore = () => {
    if (loading) return
    if (tokens.length >= 30) return
    setLoading(true)
    setTimeout(() => {
      setTokens((prev) => [
        ...prev,
        ...Array.from({ length: 10 }).map((_, index) => ({
          name: `Token ${prev.length + index + 1}`,
          symbol: `TKN${prev.length + index + 1}`,
          icon: '/avatar.png',
          address: `0x${Math.random().toString(16).slice(2, 10)}`,
          quantity: 1000000000,
          value: 1000000000,
        })),
      ])
      setLoading(false)
    }, 1000)
  }

  const loadMoreRef = useInfiniteScroll({
    onLoadMore,
    loading,
  })

  return (
    <div className="flex flex-col items-center gap-4 mdup:items-end mt-4 mdup:mt-[-4rem]">
      <div className="flex flex-row items-center gap-4 mb-2 mdup:mb-4 w-full mdup:w-auto">
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
        {tokens.map((token, index) => (
          <OwnedTokenCard key={index} token={token} />
        ))}
      </div>
      {loading && <LoadingMore className="mt-[3rem]" />}
      <div ref={loadMoreRef} className="h-4 w-full"></div>
    </div>
  )
}
