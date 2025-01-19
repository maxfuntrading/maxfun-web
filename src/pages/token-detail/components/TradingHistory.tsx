import { useBreakpoint } from "@/hooks/useBreakpoint"
import { formatAddress } from "@/utils/utils"
import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react"

export default function TradingHistory() {
  const { isSM } = useBreakpoint()

  const TradingData = [
    {
      account: '0xF41BBb59B4291Ae8711ef276DdC0a26E6AD0137C',
      type: 'buy',
      token1: 2333.123,
      token2: 10000000,
      date: 1737106505,
      transation: '0x7ee39fa472d58253b167300fc5c3544b41c324cfe9e58b6b769c6885ecd3418b',
    },
    {
      account: '0xF41BBb59B4291Ae8711ef276DdC0a26E6AD0137C',
      type: 'sell',
      token1: 2333.123,
      token2: 10000000,
      date: 1737106505,
      transation: '0x7ee39fa472d58253b167300fc5c3544b41c324cfe9e58b6b769c6885ecd3418b',
    },
    {
      account: '0xF41BBb59B4291Ae8711ef276DdC0a26E6AD0137C',
      type: 'buy',
      token1: 2333.123,
      token2: 10000000,
      date: 1737106505,
      transation: '0x7ee39fa472d58253b167300fc5c3544b41c324cfe9e58b6b769c6885ecd3418b',
    },
  ]

  return (
    <div className=" px-[0.91rem] mdup:px-[1.68rem]">
      {isSM && <div className="w-full mt-[1.6rem] flex flex-col gap-[0.59rem]">
        {TradingData.map((item, index) => {
          const isBuy = item.type === 'buy'
          const isSell = item.type === 'sell'

          return <div key={index} className=" bg-white/10 rounded-[0.625rem] relative pt-[0.78rem] pb-[1.05rem]">
            <div className="flex justify-between items-center">
              <div className={`w-[2.5rem] h-[1.25rem] text-[0.75rem] font-semibold flex-center ${isBuy && 'bg-[#06D188]'} ${isSell && 'bg-[#FF0021]'}`} style={{borderRadius: '0rem 1.25rem 1.25rem 0rem'}}>{item.type}</div>
              <div className="text-[0.75rem] font-semibold pr-[0.75rem]">{item.date}</div>
            </div>
            <div className="flex flex-col px-[0.75rem] mt-[0.55rem]">
              <div className="flex justify-between items-center">
                <span className="text-[0.81rem] font-semibold text-white/60">{formatAddress(item.account, 4, 6)}</span>
                <a href={``} target="_blank" className="flex items-center gap-[0.44rem]">
                  <TxIcon className="text-[0.875rem]" />
                  <span className="text-[0.75rem] font-semibold">{formatAddress(item.transation, 6, 4)}</span>
                </a>
              </div>

              <div className="w-full h-[1px] bg-white/10 mt-[0.67rem]"></div>

              <div className="flex justify-between items-center mt-[0.53rem]">
                <span className="text-[0.81rem] font-semibold text-white/60">Token1</span>
                <span className="text-[0.75rem] font-semibold">{item.token1}</span>
              </div>

              <div className="flex justify-between items-center mt-[0.53rem]">
                <span className="text-[0.81rem] font-semibold text-white/60">Token2</span>
                <span className="text-[0.75rem] font-semibold">{item.token2}</span>
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
            <Th className="!text-white !border-white/10 !capitalize !text-[1rem] !font-semibold">Token1</Th>
            <Th className="!text-white !border-white/10 !capitalize !text-[1rem] !font-semibold">Token2</Th>
            <Th className="!text-white !border-white/10 !capitalize !text-[1rem] !font-semibold">Date</Th>
            <Th className="!p-0 !text-white !border-white/10 !capitalize !text-[1rem] !font-semibold">Transation</Th>
          </Tr>
        </Thead>
        <Tbody>
          {[...TradingData, ...TradingData, ...TradingData].map((item, index) => {
            const isBuy = item.type === 'buy'
            const isSell = item.type === 'sell'

            return <Tr key={index} className="!font-semibold !h-[3.75rem]">
              <Td className="!p-0 !border-white/10 !text-[0.875rem] !text-white/60">{formatAddress(item.account, 4, 6)}</Td>
              <Td className={`!border-white/10 !text-[0.875rem] !capitalize ${isBuy && 'text-[#06D188]'} ${isSell && 'text-[#FF0021]'}`}>{item.type}</Td>
              <Td className="!border-white/10 !text-[0.875rem] !text-white">{item.token1}</Td>
              <Td className="!border-white/10 !text-[0.875rem] !text-white">{item.token2}</Td>
              <Td className="!border-white/10 !text-[0.875rem] !text-white">{item.date}</Td>
              <Td className="!p-0 !border-white/10 !text-[0.875rem] !text-white">
                <a href={``} target="_blank" className="flex items-center gap-2">
                  <TxIcon />
                  <span>{formatAddress(item.transation, 6, 4)}</span>
                </a>
              </Td>
            </Tr>
          })}
        </Tbody>
      </Table>}

    </div>
  )
}

function TxIcon({ className }: { className?: string }) {
  return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
    <g opacity="0.6">
      <path d="M13.3906 9.17971L15.0573 7.92971L18.8073 10.4297V14.5964L14.6406 17.0964L10.474 14.5964V5.84637L5.89062 3.34637L2.14062 5.84637V10.4297L5.89062 12.9297L7.55729 11.6797" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
  </svg>
}