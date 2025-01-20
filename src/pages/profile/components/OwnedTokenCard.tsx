export interface OwnedTokenInfo {
  name: string
  symbol: string
  address: string
  quantity: number
  value: number
  icon: string
}

export default function OwnedTokenCard({ token }: { token: OwnedTokenInfo }) {
  return (
    <div
      key={token.name}
      className="mdup:h-[4.375rem] flex flex-col mdup:flex-row mdup:border-2 bg-[#FFFFFF22] mdup:bg-transparent rounded-[0.625rem]"
    >
      <div className="px-4 mdup:px-10 py-2 flex-1 flex flex-row justify-between items-center">
        <span className="text-[#FFFFFF66] text-sm font-semibold mdup:hidden">
          Token
        </span>
        <div className="flex flex-row items-center justify-end">
          <img
            src={token.icon}
            alt={''}
            className="w-[2.125rem] h-[2.125rem] rounded-full mr-2"
          />
          <span className="text-sm font-semibold mdup:w-auto">
            {token.address}
          </span>
        </div>
      </div>
      <div className="px-4 py-2 pt-0 mdup:pt-2 flex-1 flex items-center flex-row justify-between">
        <span className="text-[#FFFFFF66] text-sm font-semibold mdup:hidden">
          Quantity
        </span>
        <div className="text-[#fff] text-sm font-semibold">
          {token.quantity}
        </div>
      </div>
      <div className="px-4 py-2 pt-0 mdup:pt-2 flex-1 flex items-center flex-row justify-between">
        <span className="text-[#FFFFFF66] text-sm font-semibold mdup:hidden">
          Value
        </span>
        <div className="text-[#fff] text-sm font-semibold">{token.value}</div>
      </div>
    </div>
  )
}
