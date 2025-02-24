import { useEffect, useState } from "react";
import BaseInfo from "./components/BaseInfo";
import { SubTabType, TabType } from "./types/type";
import clsx from "clsx";
import PriceChart, { PriceChartIframe } from "./components/PriceChart";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import BuyAndSell from "./components/BuyAndSell";
import Description from "./components/Description";
import Holder from "./components/Holder";
import Comments from "./components/Comments";
import TradingHistory from "./components/TradingHistory";
import { TokenBaseInfoResponse, TokenKlineItemResponse } from "./types/response";
import { useParams } from "react-router-dom";
import { fetchBaseInfo, fetchKline } from "@/api/token-detila";
import { ERR_CODE } from "@/constants/ERR_CODE";
import LoadingMore from "@/components/LoadingMore";
import { useReadContract } from "wagmi";
import { MaxFunTokenAbi } from "@/constants/abi/MaxFunToken";

export default function TokenDetail() {
  const { isSM } = useBreakpoint()
  const [tab, setTab] = useState<TabType>(TabType.BuyOreSell)
  const [subTab, setSubTab] = useState<SubTabType>(SubTabType.Comments)

  // API data
  const [tokenBaseInfo, setTokenBaseInfo] = useState<TokenBaseInfoResponse>()
  const [isLoadingBaseInfo, setIsLoadingBaseInfo] = useState(false)
  const [currentPrice, setCurrentPrice] = useState<string>()
  const [klineData, setKlineData] = useState<TokenKlineItemResponse[]>([])

  let timer: NodeJS.Timeout | null = null
  const maxfunTokenAddress = useParams().tokenId;

  const { data: isOnUniswap } = useReadContract({
    address: maxfunTokenAddress as `0x${string}`,
    abi: MaxFunTokenAbi,
    functionName: 'transferEnabled',
  })

  // get base info
  useEffect(() => {
    if (!maxfunTokenAddress) return;

    const getBaseInfo = async () => {
      setIsLoadingBaseInfo(true)

      fetchBaseInfo(maxfunTokenAddress).then((res) => {
        if (!res || res.code !== ERR_CODE.SUCCESS) {
          return
        }
        setTokenBaseInfo(res.data)
        setCurrentPrice(res.data.token_basic.price)
      }).finally(() => {
        setIsLoadingBaseInfo(false)
      })
    }

    getBaseInfo()
  }, [maxfunTokenAddress])

  const getNewData = async () => {
    if (!maxfunTokenAddress) return;

    const res = await fetchBaseInfo(maxfunTokenAddress)
    if (!res || res.code !== ERR_CODE.SUCCESS) {
      return
    }

    if (res.data.token_basic.price === currentPrice) {
      if (timer) {
        clearTimeout(timer)
      }
      timer = setTimeout(() => {
        getNewData()
      }, 1000)
      return
    }

    setTokenBaseInfo(res.data)
    setCurrentPrice(res.data.token_basic.price)

    const currentTs = Date.now()
    fetchKline(maxfunTokenAddress, currentTs, 100).then((res) => {
      if (!res || res.code !== ERR_CODE.SUCCESS) {
        return
      }
      setKlineData(res.data.list)
    })
  }


  return (
    <div className="px-4 mdup:px-[3.62rem] mt-2 pt-2">
      <div className=" my-container mx-auto">

        {isLoadingBaseInfo && <div className="flex justify-center items-center">
          <LoadingMore />
        </div>}
        
        { !isLoadingBaseInfo && tokenBaseInfo && maxfunTokenAddress && <>
          <BaseInfo data={tokenBaseInfo} tokenAddress={maxfunTokenAddress} />

          <Tab tab={tab} setTab={setTab} className="flex mdup:hidden" />

          <div className="flex justify-between gap-[1.32rem] h-fit mdup:mt-[1.26rem]">
            {!isOnUniswap &&<PriceChart tab={tab} tokenAddress={maxfunTokenAddress} data={klineData} className={`${isSM && tab === TabType.Chart ? 'flex' : 'hidden mdup:flex'}`} />}
            {isOnUniswap && <PriceChartIframe agentToken={maxfunTokenAddress} raiseTokenAddress={tokenBaseInfo.raised_token.address} className={`${isSM && tab === TabType.Chart ? 'flex' : 'hidden mdup:flex'}`} />}
            <BuyAndSell 
              tokenAddress={maxfunTokenAddress} 
              raiseTokenAddress={tokenBaseInfo.raised_token.address}
              maxfunTokenIcon={tokenBaseInfo.token_basic.icon}
              raiseTokenIcon={tokenBaseInfo.raised_token.icon} 
              className={`${isSM && tab === TabType.BuyOreSell ? 'flex' : 'hidden mdup:flex'}`} 
              onGetNewData={getNewData}
            />
          </div>

          <div className="flex flex-col mdup:flex-row gap-[0.94rem] mdup:gap-[1.32rem] mt-[0.94rem] mdup:mt-[1.26rem]">
            {/* Comments / Trading History */}
            {(!isSM || tab === TabType.Chart) && <div className="w-full mdup:flex-1 mdup:max-w-[calc(100%-30rem-1.32rem)] bg-black-10 py-[0.79rem] rounded-[0.625rem]">
              <SubTab subTab={subTab} setSubTab={setSubTab} className=" px-[1.08rem] mdup:px-[1.88rem]" />
              {subTab === SubTabType.Comments && <Comments tokenAddress={maxfunTokenAddress} />}
              {subTab === SubTabType.TradingHistory && <TradingHistory tokenAddress={maxfunTokenAddress} />}
            </div>}

            {/* Description / Holder */}
            {(!isSM || tab === TabType.BuyOreSell) && <div className="w-full mdup:w-[30rem] flex flex-col gap-[0.94rem] mdup:gap-[1.25rem]">
              <Description description={tokenBaseInfo.token_basic.description} />
              <Holder tokenAddress={maxfunTokenAddress} />
            </div>}
            
          </div>

          <div className="h-[3rem] mdup:h-[5rem]"></div>
        </>}

      </div>

    </div>
  )
}

function Tab({ tab, setTab, className }: { tab: TabType, setTab: (tab: TabType) => void, className?: string }) {
  const tabList = [
    {
      name: TabType.BuyOreSell,
      isActive: tab === TabType.BuyOreSell,
    },
    {
      name: TabType.Chart,
      isActive: tab === TabType.Chart,
    },
  ]

  return (
    <div className={clsx('flex flex-row justify-start items-center gap-[1.55rem] font-medium mt-[1rem] h-[4rem]', className)}>
      {tabList.map((item, index) => (
        <div key={index} onClick={() => setTab(item.name)} className="relative cursor-pointer flex-center">
          <span className={`${item.isActive ? 'text-red-10' : 'text-white'} transition-all duration-300`}>{item.name}</span>
          <div className={`${item.isActive ? 'bg-red-10 w-full opacity-100' : 'w-0 opacity-0'} absolute bottom-[-0.75rem] h-[0.1875rem] transition-all duration-300`}></div>
        </div>
      ))}
    </div>
  )
}

function SubTab({ subTab, setSubTab, className }: { subTab: SubTabType, setSubTab: (subTab: SubTabType) => void, className?: string }) {
  const subTabList = [
    {
      name: SubTabType.Comments,
      isActive: subTab === SubTabType.Comments,
    },
    {
      name: SubTabType.TradingHistory,
      isActive: subTab === SubTabType.TradingHistory,
    },
  ]

  return (
    <div className={clsx('w-full relative flex flex-row justify-start items-center gap-[1.55rem] font-medium mb-[0.75rem]', className)}>
      {subTabList.map((item, index) => (
        <div key={index} onClick={() => setSubTab(item.name)} className="relative cursor-pointer flex-center">
          <span className={`${item.isActive ? 'text-red-10' : 'text-white'} transition-all duration-300 text-[1rem] font-medium mdup:text-[1.25rem] mdup:font-semibold`}>{item.name}</span>
          <div className={`${item.isActive ? 'bg-red-10 w-full opacity-100' : 'w-0 opacity-0'} absolute bottom-[-0.75rem] h-[0.1875rem] transition-all duration-300`}></div>
        </div>
      ))}
      <div className="absolute bottom-[-0.7rem] left-0 w-full h-[0.0625rem] bg-white/10"></div>
    </div>
  )
}