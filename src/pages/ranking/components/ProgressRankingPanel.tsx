import { formatAmount, formatNumberLocale } from '@/utils/utils'
import { RankingItem } from '../type'
import RankIcon from './RankIcon'
import { useNavigate } from 'react-router-dom'
export default function ProgressRankingPanel({
  items,
}: {
  items: RankingItem[]
}) {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col flex-1">
      <span className="text-[1.75rem] font-semibold hidden mdup:inline">
        Progress Ranking
      </span>
      <div className="rounded-[0.625rem] overflow-hidden mdup:border border-red-10 mt-2">
        <div className="min-w-full">
          <div className="hidden text-base font-semibold h-[4.375rem] flex-row border-b border-b-white/10 items-center mdup:flex">
            <div className="px-4 py-2 text-left w-20 text-white/60">Rank</div>
            <div className="px-4 py-2 text-left flex-1 text-white/60">Token Name</div>
            <div className="px-4 py-2 text-left flex-1 text-white/60">Market Cap</div>
            <div className="px-4 py-2 text-right flex-1 text-white/60">Bonding Curve</div>
          </div>
          <div className="text-sm flex flex-col gap-2.5 mdup:gap-0">
            {items.map((item, index) => (
              <div
                key={item.name}
                onClick={() => navigate(`/token/${item.token_address}`)}
                className="mdup:h-[4.375rem] flex flex-col mdup:flex-row mdup:border-b border-b-white/10 bg-[#FFFFFF22] mdup:bg-transparent rounded-[0.625rem] mdup:rounded-none mdup:hover:bg-red-10/10 cursor-pointer group"
              >
                <div className="hidden mdup:flex px-4 py-2 w-20 items-center justify-center">
                  {index < 3 ? (
                    <RankIcon
                      index={index}
                      className="w-[2.125rem] h-[2.5rem]"
                    />
                  ) : (
                    <span className="text-center w-full font-semibold mdup:group-hover:text-red-10">{index + 1}</span>
                  )}
                </div>
                <div className="px-4 py-2 flex-1 flex flex-row justify-between items-center">
                  <span className="text-[#FFFFFF66] text-sm font-semibold mdup:hidden">
                    Token Name
                  </span>
                  <div className="flex flex-row items-center">
                    {index < 3 && (
                      <RankIcon
                        index={index}
                        className="w-[1.25rem] h-[1.5rem] mdup:hidden mr-2"
                      />
                    )}
                    <div className="w-[2.125rem] h-[2.125rem] rounded-full mr-2 border-2 border-white">
                      <img
                        src={item.icon}
                        alt={item.name}
                        className="size-full rounded-full"
                      />
                    </div>
                    <span className="text-sm font-semibold mdup:group-hover:text-red-10 mdup:w-[7rem] mdup:truncate">{item.name}</span>
                  </div>
                </div>
                <div className="px-4 py-2 pt-0 mdup:pt-2 flex-1 flex items-center flex-row justify-between">
                  <span className="text-[#FFFFFF66] text-sm font-semibold mdup:hidden">
                    Market Cap
                  </span>
                  <div className="text-[#fff] text-sm font-semibold mdup:group-hover:text-red-10">
                    ${formatNumberLocale(formatAmount(item.market_cap))}
                  </div>
                </div>
                <div className="px-4 py-2 flex-1 flex flex-row justify-between items-center">
                  <span className="text-[#FFFFFF66] text-sm font-semibold mdup:hidden">
                    Bonding Curve
                  </span>
                  <div className="w-1/2 mdup:w-full flex flex-row items-center justify-end gap-2 mdup:group-hover:text-red-10">
                    <ProgressBar progress={Number(item.bonding_curve) * 100} />
                    {formatAmount(Number(item.bonding_curve) * 100)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="relative flex-1 h-[0.625rem] rounded-[0.625rem]">
      <div className="absolute top-0 left-0 w-full h-full rounded-[0.625rem] bg-[#D9D9D9] opacity-20"></div>
      <div
        className="h-full absolute top-0 left-0 rounded-[0.625rem]"
        style={{
          width: `${progress}%`,
          background: 'linear-gradient(90deg, #EC3E6F 0%, #FFADC4 100%)',
        }}
      ></div>
    </div>
  )
}
