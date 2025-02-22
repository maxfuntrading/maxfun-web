import { fetchTradeLog } from "@/api/token-detila"
import LoadingMore from "@/components/LoadingMore"
import { useBreakpoint } from "@/hooks/useBreakpoint"
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll"
import { formatAddress, formatAmount, formatCommentDate, formatNumberLocale } from "@/utils/utils"
import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { TradeLogItemResponse } from "../types/response"
import { ERR_CODE } from "@/constants/ERR_CODE"
import clsx from "clsx"
import { useChainInfo } from "@/hooks/useChainInfo"
import { useReadContracts } from "wagmi"
import { MaxFunTokenAbi } from "@/constants/abi/MaxFunToken"
import { erc20Abi } from "viem"

export default function TradingHistory({ tokenAddress, raiseTokenAddress  }: { tokenAddress: string, raiseTokenAddress: string }) {
  const { isSM } = useBreakpoint()
  const { blockExploreUrl } = useChainInfo()
  
  // interface parameters
  const [lastBlockNumber, setLastBlockNumber] = useState<number>()
  const [lastTxnIndex, setLastTxnIndex] = useState<number>()
  const [lastLogIndex, setLastLogIndex] = useState<number>()
  const PAGE_SIZE = 20

  // trading data
  const [data, setData] = useState<TradeLogItemResponse[]>([])
  const [isLoadingList, setIsLoadingList] = useState(false)
  const [isFinishedLoadMore, setIsFinishedLoadMore] = useState(false)

  const {data: tokenNames} = useReadContracts({
    allowFailure: false,
    contracts: [
      {
        address: tokenAddress as `0x${string}`,
        abi: MaxFunTokenAbi,
        functionName: 'symbol'
      },
      {
        address: raiseTokenAddress as `0x${string}`,
        abi: erc20Abi,
        functionName: 'symbol'
      },
    ],
    query: {
      enabled: !!tokenAddress && !!raiseTokenAddress
    }
  })
  const token1Name = tokenNames ? tokenNames[0] : undefined
  const token2Name = tokenNames ? tokenNames[1] : undefined
  

  const onLoadMore = () => {
    if (isLoadingList) return
    if (isFinishedLoadMore) return
    if (data.length === 0) return
    
    getTradingHistory(lastBlockNumber, lastTxnIndex, lastLogIndex)
  }

  const loadMoreRef = useInfiniteScroll({
    onLoadMore,
    loading: isLoadingList
  })

  const getTradingHistory = async (lastBlockNumber?: number, lastTxnIndex?: number, lastLogIndex?: number) => {
    setIsLoadingList(true)
    fetchTradeLog(tokenAddress, lastBlockNumber, lastTxnIndex, lastLogIndex, PAGE_SIZE).then(res => {
      if (res.code !== ERR_CODE.SUCCESS) return
      if (res.data.list.length === 0) {
        setIsFinishedLoadMore(true)
        return
      }

      setData([...data, ...res.data.list])

      const lastRes = res.data.list[res.data.list.length - 1]
      setLastBlockNumber(lastRes.block_number)
      setLastTxnIndex(lastRes.txn_index)
      setLastLogIndex(lastRes.log_index)

      if (res.data.list.length < PAGE_SIZE) {
        setIsFinishedLoadMore(true)
      }
    }).finally(() => {
      setIsLoadingList(false)
    })
  }

  useEffect(() => {
    getTradingHistory(lastBlockNumber, lastTxnIndex, lastLogIndex)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className=" px-[0.91rem] mdup:px-[1.68rem] overflow-hidden">
      {isSM && <div className="w-full mt-[1.6rem] flex flex-col gap-[0.59rem]">
        {data.map((item, index) => {
          const isBuy = item.trade_type === 0
          const traceType = isBuy ? 'Buy' : 'Sell'

          return <div key={index} className=" bg-white/10 rounded-[0.625rem] relative pt-[0.78rem] pb-[1.05rem]">
            <div className="flex justify-between items-center">
              <div className={`w-[2.5rem] h-[1.25rem] text-[0.75rem] font-semibold flex-center ${isBuy ? 'bg-[#06D188]' : 'bg-[#FF0021]'}`} style={{borderRadius: '0rem 1.25rem 1.25rem 0rem'}}>{traceType}</div>
              <div className="text-[0.75rem] font-semibold pr-[0.75rem]">{formatCommentDate(item.block_time)}</div>
            </div>
            <div className="flex flex-col px-[0.75rem] mt-[0.55rem]">
              <div className="flex justify-between items-center">
                <a href={`${blockExploreUrl}/address/${item.user_address}`} target="_blank" className="flex items-center gap-[0.44rem]">
                  <span className="text-[0.81rem] font-semibold text-white/60">{formatAddress(item.user_address, 4, 6)}</span>
                </a>
                <a href={`${blockExploreUrl}/tx/${item.txn_hash}`} target="_blank" className="flex items-center gap-[0.44rem]">
                  <TxIcon className="text-[0.875rem]" />
                  <span className="text-[0.75rem] font-semibold">{formatAddress(item.txn_hash, 6, 4)}</span>
                </a>
              </div>

              <div className="w-full h-[1px] bg-white/10 mt-[0.67rem]"></div>

              <div className="flex justify-between items-center mt-[0.53rem]">
                <span className="text-[0.81rem] font-semibold text-white/60">{token1Name ?? ''}</span>
                <span className="text-[0.75rem] font-semibold">{formatNumberLocale(formatAmount(item.token1_amount))}</span>
              </div>

              <div className="flex justify-between items-center mt-[0.53rem]">
                <span className="text-[0.81rem] font-semibold text-white/60">{token2Name ?? ''}</span>
                <span className="text-[0.75rem] font-semibold">{formatNumberLocale(formatAmount(item.token2_amount))}</span>
              </div>

            </div>
          </div>
        })}
      </div>}

      {!isSM && <Table className="!mt-4">
        <Thead className="">
          <Tr className="!h-[3.75rem]">
            <Th className="!p-0 !text-white  !border-white/10 !capitalize !text-[1rem] !font-semibold">Account</Th>
            <Th className="!text-white !border-white/10 !capitalize !text-[1rem] !font-semibold">Type</Th>
            <Th className="!text-white !border-white/10 !capitalize !text-[1rem] !font-semibold">{token1Name ?? ''}</Th>
            <Th className="!text-white !border-white/10 !capitalize !text-[1rem] !font-semibold">{token2Name ?? ''}</Th>
            <Th className="!text-white !border-white/10 !capitalize !text-[1rem] !font-semibold">Date</Th>
            <Th className="!p-0 !text-white !border-white/10 !capitalize !text-[1rem] !font-semibold">Transation</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((item, index) => {
            const isBuy = item.trade_type === 0
            const traceType = isBuy ? 'Buy' : 'Sell'

            return <Tr key={index} className="!font-semibold !h-[3.75rem]">
              <Td className="!p-0 !border-white/10 !text-[0.875rem] !text-white/60">
                <a href={`${blockExploreUrl}/address/${item.user_address}`} target="_blank" className="flex items-center gap-2 hover:text-red-10">
                  <span>{formatAddress(item.user_address, 4, 6)}</span>
                </a>
              </Td>
              <Td className={`!border-white/10 !text-[0.875rem] !capitalize ${isBuy ? 'text-[#06D188]' : 'text-[#FF0021]'}`}>{traceType}</Td>
              <Td className="!border-white/10 !text-[0.875rem] !text-white">{formatNumberLocale(formatAmount(item.token1_amount))}</Td>
              <Td className="!border-white/10 !text-[0.875rem] !text-white">{formatNumberLocale(formatAmount(item.token2_amount))}</Td>
              <Td className="!border-white/10 !text-[0.875rem] !text-white">{formatCommentDate(item.block_time)}</Td>
              <Td className="!p-0 !border-white/10 !text-[0.875rem] !text-white">
                <a href={`${blockExploreUrl}/tx/${item.txn_hash}`} target="_blank" className="flex items-center gap-2 group hover:text-red-10">
                  <TxIcon />
                  <span>{formatAddress(item.txn_hash, 6, 4)}</span>
                </a>
              </Td>
            </Tr>
          })}
        </Tbody>
      </Table>}

      <div ref={loadMoreRef} className="w-full"></div>
      {isLoadingList && <LoadingMore />}

    </div>
  )
}

function TxIcon({ className }: { className?: string }) {
  return <div>
    <svg className={clsx(className, 'block group-hover:hidden')} xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
      <g opacity="0.6">
        <path d="M13.3906 9.17971L15.0573 7.92971L18.8073 10.4297V14.5964L14.6406 17.0964L10.474 14.5964V5.84637L5.89062 3.34637L2.14062 5.84637V10.4297L5.89062 12.9297L7.55729 11.6797" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
    </svg>

    <svg className={clsx(className, 'hidden group-hover:block')} xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
      <path d="M13.0396 9.57265L14.7062 8.32265L18.4562 10.8227V14.9893L14.2896 17.4893L10.1229 14.9893V6.23932L5.53955 3.73932L1.78955 6.23932V10.8227L5.53955 13.3227L7.20622 12.0727" stroke="#EC3E6F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>

  </div>
}