import GainerRankingPanel from './components/GainerRankingPanel'
import MarketCapRankingPanel from './components/MarketCapRankingPanel'
import ProgressRankingPanel from './components/ProgressRankingPanel'
import TradingVolumeRankingPanel from './components/TradingVolumeRankingPanel'
import { ProgressRankingInfo } from './type'

const items: ProgressRankingInfo[] = [
  { name: 'Laptop', marketCap: 1000000000, progress: 80, icon: '/avatar.png' },
  {
    name: 'Coffee Maker',
    marketCap: 1000000000,
    progress: 40,
    icon: '/avatar.png',
  },
  {
    name: 'Desk Chair',
    marketCap: 1000000000,
    progress: 20,
    icon: '/avatar.png',
  },
  {
    name: 'Smartphone',
    marketCap: 1000000000,
    progress: 70,
    icon: '/avatar.png',
  },
  {
    name: 'Headphones',
    marketCap: 1000000000,
    progress: 10,
    icon: '/avatar.png',
  },
  {
    name: 'AI Agent',
    marketCap: 1000000000,
    progress: 10,
    icon: '/avatar.png',
  },
  {
    name: 'Tiktok videos',
    marketCap: 1000000000,
    progress: 10,
    icon: '/avatar.png',
  },
  {
    name: 'Rednote',
    marketCap: 1000000000,
    progress: 10,
    icon: '/avatar.png',
  },
  {
    name: 'LA',
    marketCap: 1000000000,
    progress: 10,
    icon: '/avatar.png',
  },
  {
    name: 'NFT',
    marketCap: 1000000000,
    progress: 10,
    icon: '/avatar.png',
  },
]

export default function Ranking() {
  return (
    <div className="w-full min-h-screen bg-[#141516] flex flex-col items-center py-4 px-4">
      <div className="w-full h-full flex flex-col max-w-[87.5rem] items-center">
        <h1 className="text-[1.5rem] w-[12.5rem] mdup:w-auto mdup:text-[2.5rem] font-['Otomanopee One'] bg-gradient-to-r from-white to-red-10 text-transparent bg-clip-text text-center font-semibold">
          XX Ranking
        </h1>
        <span className="mt-6 text-sm mdup:text-base opacity-60">
          The data was last updated at 2024/12/28 16:45:47 (UTC+8)
        </span>
        <div className="w-full mdup:px-10 h-100 flex flex-col">
          <div className="flex flex-col mdup:flex-row w-full gap-10 mt-12">
            <ProgressRankingPanel items={items} />
            <GainerRankingPanel items={items} />
          </div>
          <div className="flex flex-col mdup:flex-row w-full gap-10 mt-12">
            <MarketCapRankingPanel items={items} />
            <TradingVolumeRankingPanel items={items} />
          </div>
          <div className="flex flex-row w-full"></div>
        </div>
      </div>
    </div>
  )
}
