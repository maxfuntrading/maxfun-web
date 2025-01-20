import { ProgressRankingInfo } from '../type'
import RankIcon from './RankIcon'

export default function MarketCapRankingPanel({
  items,
}: {
  items: ProgressRankingInfo[]
}) {
  return (
    <div className="flex flex-col flex-1">
      <span className="text-[1.75rem] font-semibold hidden mdup:inline">
        Market Cap Ranking
      </span>
      <div className="rounded-[0.625rem] overflow-hidden mdup:border border-red-10 mt-2">
        <div className="min-w-full">
          <div className="text-base font-semibold hidden h-[4.375rem] mdup:flex flex-row border-b items-center opacity-60">
            <div className="px-4 py-2 text-center">Rank</div>
            <div className="px-4 py-2 text-left flex-1">Token Name</div>
            <div className="px-4 py-2 text-left flex-1">Market Cap</div>
          </div>
          <div className="text-sm flex flex-col gap-2.5 mdup:gap-0">
            {items.map((item, index) => (
              <div
                key={item.name}
                className="mdup:h-[4.375rem] flex flex-col mdup:flex-row mdup:border-b bg-[#FFFFFF22] mdup:bg-transparent rounded-[0.625rem] mdup:rounded-none"
              >
                <div className="hidden mdup:flex px-4 py-2 w-20 items-center justify-center">
                  {index < 3 ? (
                    <RankIcon
                      index={index}
                      className="w-[2.125rem] h-[2.5rem]"
                    />
                  ) : (
                    <span className="text-center w-full">{index + 1}</span>
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
                    <img
                      src={item.icon}
                      alt={item.name}
                      className="w-[2.125rem] h-[2.125rem] rounded-full mr-2"
                    />
                    <span className="text-sm font-semibold">{item.name}</span>
                  </div>
                </div>
                <div className="px-4 py-2 pt-0 mdup:pt-2 flex-1 flex items-center flex-row justify-between">
                  <span className="text-[#FFFFFF66] text-sm font-semibold mdup:hidden">
                    Market Cap
                  </span>
                  <div className="text-[#fff] text-sm font-semibold">
                    ${item.marketCap}
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
