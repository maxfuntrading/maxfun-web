import { formatAmount, formatNumberLocale } from "@/utils/utils"
import { TokenOwnedItem } from "../type"

export interface OwnedTokenInfo {
  name: string
  symbol: string
  address: string
  quantity: number
  value: number
  icon: string
}

export default function OwnedTokenCard({ token }: { token: TokenOwnedItem }) {
  return (
    <div
      className="mdup:h-[4.375rem] flex flex-col mdup:flex-row mdup:border-2 mdup:border-white/10 bg-[#FFFFFF22] mdup:bg-transparent rounded-[0.625rem] hover:bg-[rgba(236,62,111,0.10)] hover:border-red-10"
    >
      <div className="px-4 mdup:px-10 py-2 flex-1 flex flex-row justify-between items-center">
        <span className="text-[#FFFFFF66] text-sm font-semibold mdup:hidden">
          Token
        </span>
        <div className="flex flex-row items-center justify-end">
          <div className="w-[2.125rem] h-[2.125rem] rounded-full mr-2 border-2 border-white">
            <img
              src={token.token_icon}
              alt={''}
              className="size-full rounded-full"
            />
          </div>
          <span className="text-sm font-semibold mdup:w-auto">
            {token.token_symbol}
          </span>
        </div>
      </div>
      <div className="px-4 py-2 pt-0 mdup:pt-2 flex-1 flex items-center flex-row justify-between">
        <span className="text-[#FFFFFF66] text-sm font-semibold mdup:hidden">
          Quantity
        </span>
        <div className="text-[#fff] text-sm font-semibold">
          {formatNumberLocale(formatAmount(token.quantity))}
        </div>
      </div>
      <div className="px-4 py-2 pt-0 mdup:pt-2 flex-1 flex items-center flex-row justify-between">
        <span className="text-[#FFFFFF66] text-sm font-semibold mdup:hidden">
          Value
        </span>
        <div className="text-[#fff] text-sm font-semibold">{formatNumberLocale(formatAmount(token.value))}</div>
      </div>
    </div>
  )
}
