import Select, { SelectOptionType } from '@/components/Select'
import GainerRankingPanel from './components/GainerRankingPanel'
import MarketCapRankingPanel from './components/MarketCapRankingPanel'
import ProgressRankingPanel from './components/ProgressRankingPanel'
import TradingVolumeRankingPanel from './components/TradingVolumeRankingPanel'
import { RankingItem } from './type'
import { useEffect, useState } from 'react'
import { fetchRankingVolume } from '@/api/ranking'
import { fetchRankingGainers, fetchRankingMarketCap } from '@/api/ranking'
import { fetchRankingProcess } from '@/api/ranking'
import { ERR_CODE } from '@/constants/ERR_CODE'
import LoadingMore from '@/components/LoadingMore'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

// const items: ProgressRankingInfo[] = [
//   { name: 'Laptop', marketCap: 1000000000, progress: 80, icon: '/avatar.png' },
//   {
//     name: 'Coffee Maker',
//     marketCap: 1000000000,
//     progress: 40,
//     icon: '/avatar.png',
//   },
//   {
//     name: 'Desk Chair',
//     marketCap: 1000000000,
//     progress: 20,
//     icon: '/avatar.png',
//   },
//   {
//     name: 'Smartphone',
//     marketCap: 1000000000,
//     progress: 70,
//     icon: '/avatar.png',
//   },
//   {
//     name: 'Headphones',
//     marketCap: 1000000000,
//     progress: 10,
//     icon: '/avatar.png',
//   },
//   {
//     name: 'AI Agent',
//     marketCap: 1000000000,
//     progress: 10,
//     icon: '/avatar.png',
//   },
//   {
//     name: 'Tiktok videos',
//     marketCap: 1000000000,
//     progress: 10,
//     icon: '/avatar.png',
//   },
//   {
//     name: 'Rednote',
//     marketCap: 1000000000,
//     progress: 10,
//     icon: '/avatar.png',
//   },
//   {
//     name: 'LA',
//     marketCap: 1000000000,
//     progress: 10,
//     icon: '/avatar.png',
//   },
//   {
//     name: 'NFT',
//     marketCap: 1000000000,
//     progress: 10,
//     icon: '/avatar.png',
//   },
// ]

enum RankingType {
  Progress = 'Progress',
  Gainers = '24 Hours Gainers',
  MarketCap = 'Market Cap',
  TradingVolume = '24 Hours Trading Volume',
}

const rankingTypeList: SelectOptionType<RankingType>[] = [
  {
    key: RankingType.Progress,
    value: 'Progress Ranking',
  },
  {
    key: RankingType.Gainers,
    value: '24 Hours Gainers Ranking',
  },
  {
    key: RankingType.MarketCap,
    value: 'Market Cap Ranking',
  },
  {
    key: RankingType.TradingVolume,
    value: '24 Hours Trading Volume',
  },
]

// 初始化 dayjs 插件
dayjs.extend(utc)
dayjs.extend(timezone)

export default function Ranking() {
  const [rankingType, setRankingType] = useState<SelectOptionType<RankingType>>(
    rankingTypeList[0]
  )

  // data
  const [progressData, setProgressData] = useState<RankingItem[]>([])
  const [gainersData, setGainersData] = useState<RankingItem[]>([])
  const [marketCapData, setMarketCapData] = useState<RankingItem[]>([])
  const [volumeData, setVolumeData] = useState<RankingItem[]>([])
  const [updateTime, setUpdateTime] = useState<number>()
  const [isLoadingRankingData, setIsLoadingRankingData] = useState<boolean>(false)

  useEffect(() => {
    const getRankingData = async () => {
      setIsLoadingRankingData(true)
      const [processData, gainersData, marketCapData, volumeData] = await Promise.all([
        fetchRankingProcess(),
        fetchRankingGainers(),
        fetchRankingMarketCap(),
        fetchRankingVolume(),
      ]).finally(() => {
        setIsLoadingRankingData(false)
      })

      if (!processData || !gainersData || !marketCapData || !volumeData) {
        return
      }

      if (processData.code !== ERR_CODE.SUCCESS || gainersData.code !== ERR_CODE.SUCCESS || marketCapData.code !== ERR_CODE.SUCCESS || volumeData.code !== ERR_CODE.SUCCESS) {
        return
      }

      setUpdateTime(processData.data.ranking_update_ts)
      setProgressData(processData.data.list)
      setGainersData(gainersData.data.list)
      setMarketCapData(marketCapData.data.list)
      setVolumeData(volumeData.data.list)
    }

    getRankingData()
  }, [])

  const progressRankingPanel = <ProgressRankingPanel items={progressData} />
  const gainersRankingPanel = <GainerRankingPanel items={gainersData} />
  const marketCapRankingPanel = <MarketCapRankingPanel items={marketCapData} />
  const tradingVolumeRankingPanel = <TradingVolumeRankingPanel items={volumeData} />

  return (
    <div className="w-full min-h-screen bg-[#141516] flex flex-col items-center py-4 px-4">
      <div className="w-full h-full flex flex-col max-w-[87.5rem] items-center">
        <h1 className="text-[1.5rem] w-[12.5rem] mdup:w-auto mdup:text-[2.5rem] font-['Otomanopee One'] bg-gradient-to-r from-white to-red-10 text-transparent bg-clip-text text-center font-semibold">
          XX Ranking
        </h1>
        <span className="mt-6 text-sm mdup:text-base opacity-60">
          The data was last updated at {updateTime ? dayjs.unix(updateTime).tz('Asia/Shanghai').format('YYYY/MM/DD HH:mm:ss') + ' (UTC+8)' : ''} 
        </span>
        <div className="w-full mdup:px-10 h-100 flex flex-col">
          <div className="flex flex-row items-center mdup:hidden mt-4 mb-2">
            <div className="w-[0.1875rem] h-[0.875rem] bg-red-10" />
            <Select
              className="sm:w-[14rem] border-none text-bold"
              defaultOption={rankingType}
              options={rankingTypeList}
              onSelect={(val) => setRankingType(val)}
            />
          </div>

          { isLoadingRankingData && <LoadingMore />}
          { !isLoadingRankingData && <>
            <div className="flex mdup:hidden flex-col w-full">
              {rankingType.key === RankingType.Progress
                ? progressRankingPanel
                : null}
              {rankingType.key === RankingType.Gainers
                ? gainersRankingPanel
                : null}
              {rankingType.key === RankingType.MarketCap
                ? marketCapRankingPanel
                : null}
              {rankingType.key === RankingType.TradingVolume
                ? tradingVolumeRankingPanel
                : null}
            </div>
            <div className="hidden mdup:flex flex-col mdup:flex-row w-full gap-10 mt-12">
              {progressRankingPanel}
              {gainersRankingPanel}
            </div>
            <div className="hidden mdup:flex flex-col mdup:flex-row w-full gap-10 mt-12">
              {marketCapRankingPanel}
              {tradingVolumeRankingPanel}
            </div>
          </> }
        </div>
      </div>
    </div>
  )
}
