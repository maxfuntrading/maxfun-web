import clsx from 'clsx'
import { useState } from 'react'
import SettingIcon from '@/assets/icons/setting.png'
import SolidButton from '@/components/button/SolidButton'
import { useDisclosure } from '@chakra-ui/react'
import SlippageModal from './SlippageModal'
import { useAccount, useReadContract, useReadContracts } from 'wagmi'
import { MaxFunTokenAbi } from '@/constants/abi/MaxFunToken'
import { VITE_CONTRACT_MAX_FUN_CURVE } from '@/utils/runtime-config'
import { MaxFunCurveAbi } from '@/constants/abi/MaxFunCurve'
import Big from 'big.js'
import useBuy from '@/hooks/contract/useBuy'
import useSell from '@/hooks/contract/useSell'
import { erc20Abi, formatUnits } from 'viem'

interface BuyAndSellProps {
  className?: string
  tokenAddress: string
  raiseTokenIcon: string
  maxfunTokenIcon: string
}

export default function BuyAndSell({className, tokenAddress, raiseTokenIcon, maxfunTokenIcon}: BuyAndSellProps) {
  const { address } = useAccount()
  
  const [isBuy, setIsBuy] = useState(true)
  const isSell = !isBuy

  const [amount, setAmount] = useState<string>()
  const [slippage, setSlippage] = useState(10)

  const { isOpen: isOpenSlippage, onOpen: onOpenSlippage, onClose: onCloseSlippage } = useDisclosure();

  // const maxfunTokenAddress = tokenAddress
  // const maxfunTokenAddress = raiseToken.address
  console.log('tokenAddress', tokenAddress);
  const maxfunTokenAddress = '0xE16205C3224449573Cc706d25B6870957aff255A' // "LUNA
  const raiseTokenAddress = '0xd97642E26F86310693324a3F0cC97e9eAA6436c6'

  // write contract
  const { onBuy, state: buyState } = useBuy()
  const isLoadingBuy = buyState.loading
  const { onSell, state: sellState } = useSell()
  const isLoadingSell = sellState.loading
  const isLoadingTrade = isLoadingBuy || isLoadingSell

  // 获取token基本信息
  const { data: contractInfo} = useReadContracts({
    allowFailure: false,
    contracts: [
      {
        address: maxfunTokenAddress as `0x${string}`,
        abi: MaxFunTokenAbi,
        functionName: 'transferEnabled',
      },
      {
        address: maxfunTokenAddress as `0x${string}`,
        abi: MaxFunTokenAbi,
        functionName: 'decimals',
      },
      {
        address: maxfunTokenAddress as `0x${string}`,
        abi: MaxFunTokenAbi,
        functionName: 'symbol',
      },
      {
        address: raiseTokenAddress as `0x${string}`,
        abi: erc20Abi,
        functionName: 'decimals',
      },
      {
        address: raiseTokenAddress as `0x${string}`,
        abi: erc20Abi,
        functionName: 'symbol',
      },
    ],
    query: {
      enabled: !!maxfunTokenAddress && !!raiseTokenAddress
    }
  })
  const isOnUniswap = contractInfo?.[0]
  const maxfunTokenDecimal = contractInfo?.[1]
  const maxfunTokenSymbol = contractInfo?.[2]
  const raiseTokenDecimal = contractInfo?.[3]
  const raiseTokenSymbol = contractInfo?.[4]

  // raise token balance
  const { data: raiseTokenBalance } = useReadContract({
    address: raiseTokenAddress as `0x${string}`,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
    query: {
      enabled: !!address && !!raiseTokenAddress
    }
  })

  // maxfun token balance
  const { data: maxfunTokenBalance } = useReadContract({
    address: maxfunTokenAddress as `0x${string}`,
    abi: MaxFunTokenAbi,
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
    query: {
      enabled: !!address && !!maxfunTokenAddress
    }
  })

  // buy-预计收到的token数量
  const { data: amountOutBuy } = useReadContract({
    address: VITE_CONTRACT_MAX_FUN_CURVE as `0x${string}`,
    abi: MaxFunCurveAbi,
    functionName: 'getAmountsOut',
    args: amount && raiseTokenDecimal ? [ 
      raiseTokenAddress as `0x${string}`,
      maxfunTokenAddress as `0x${string}`, 
      BigInt(Big(amount).times(1-(slippage / 100)).times(Big(10).pow(raiseTokenDecimal)).toFixed(0))
    ] : undefined,
    query: {
      enabled: !!raiseTokenAddress && !!maxfunTokenAddress && !!amount
    }
  })
  
  // sell-预计收到的token数量
  const { data: amountOutSell } = useReadContract({
    address: VITE_CONTRACT_MAX_FUN_CURVE as `0x${string}`,
    abi: MaxFunCurveAbi,
    functionName: 'getAmountsOut',
    args: amount && maxfunTokenDecimal ? [
      maxfunTokenAddress as `0x${string}`, 
      raiseTokenAddress as `0x${string}`,  
      BigInt(Big(amount).times(1-(slippage / 100)).times(Big(10).pow(maxfunTokenDecimal)).toFixed(0))
    ] : undefined,
    query: {
      enabled: !!maxfunTokenAddress && !!raiseTokenAddress && !!amount && !!raiseTokenDecimal
    }
  })

  const onBuyHandle = async () => {
    if (!amount) return
    if (!amountOutBuy) return

    onBuy({
        amountIn: BigInt(Big(amount).times(Big(10).pow(18)).toFixed(0)),
        tokenAddress: maxfunTokenAddress,
        amountMinOut: amountOutBuy,
        asset: raiseTokenAddress
    })
  }

  const onSellHandle = async () => {
    if (!amount) return
    if (!amountOutSell) return

    onSell({
      amountIn: BigInt(Big(amount).times(Big(10).pow(18)).toFixed(0)),
      tokenAddress: maxfunTokenAddress,
      amountMinOut: amountOutSell,
      asset: raiseTokenAddress
    })
  }
  

  return (
    <div className={clsx(" flex-shrink-0 w-full mdup:w-[30rem] flex flex-col gap-[0.62rem] mdup:gap-[0.8rem] bg-black-10 rounded-[0.625rem] px-4 mdup:px-[1.49rem] py-[0.94rem] mdup:py-[1.3rem]", className)}>
      <div className={`self-end h-[1.875rem] rounded-[5px] text-[0.875rem] mdup:text-[1rem] flex-center px-[0.83rem] mdup:px-[1.34rem] w-fit ${isOnUniswap ? 'border-[2px] border-red-10 text-red-10' : ' bg-white/10'}`}>
        Base on uniswap
      </div>

      <div className='flex justify-between gap-[0.44rem] mdup:gap-[0.62rem]'>
        <button onClick={() => setIsBuy(true)} className={`flex-1 h-[2.5rem] mdup:h-[3.125rem] text-[1rem] mdup:text-[1.25rem] font-medium rounded-[0.625rem] ${isBuy ? 'bg-red-10 hover:bg-red-10' : 'bg-black-10 border-[2px] border-white/10'}`}>
          Buy
        </button>
        <button onClick={() => setIsBuy(false)} className={`flex-1 h-[2.5rem] mdup:h-[3.125rem] text-[1rem] mdup:text-[1.25rem] font-medium rounded-[0.625rem] ${isSell ? 'bg-red-10 hover:bg-red-10' : 'bg-black-10 border-[2px] border-white/10'}`}>
          Sell
        </button>
      </div>

      <div className='flex justify-between items-center'>
        <div className=' h-[1.875rem] bg-white/10 rounded-[0.375rem] flex-center px-[0.69rem] mdup:px-[0.8rem] font-medium text-[0.875rem] mdup:text-[1rem]'>
          Switch to Banana
        </div>
        <button onClick={onOpenSlippage}>
          <img className='size-[0.875rem] mdup:size-[1.25rem]' src={SettingIcon} alt="setting" />
        </button>
      </div>

      <div className=' bg-white/20 rounded-[0.625rem] px-[0.97rem] mdup:px-[1.22rem] py-[0.5rem] flex justify-between gap-[0.478rem] mdup:gap-[0.54rem] flex-col'>
        <div className='flex-1 flex gap-4'>
          <input
           className=' w-full outline-none placeholder:text-white/40 placeholder:font-medium text-[1rem] font-medium bg-transparent mt-[0.4rem]'
           placeholder='Enter the amount'
           type="text"
           inputMode='decimal'
           value={amount !== undefined ? amount : ''}
           min={0}
           disabled={isLoadingTrade}
           onKeyDown={(e) => {
            if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
              e.preventDefault();
            }
          }}
          onChange={(e) => {
            let inputValue = e.target.value;
            inputValue = inputValue.replace(/[^0-9.]/g, "");

            // 防止小数点开头，自动补 0
            if (inputValue.startsWith(".")) {
              inputValue = "0" + inputValue;
            }

            // 确保小数点只出现一次
            if (inputValue.split(".").length > 2) {
              inputValue = inputValue.slice(0, inputValue.lastIndexOf("."));
            }
            setAmount(inputValue);
          }}
          />

          <div className='self-start flex items-center gap-2 mdup:gap-[0.7rem]'>
            <span className='font-medium text-[1rem] mdup:text-[1.125rem]'>{ isBuy ? raiseTokenSymbol : maxfunTokenSymbol }</span>
            <div className='size-[1.875rem] rounded-full'>
              <img src={isBuy ? raiseTokenIcon : maxfunTokenIcon} alt="raise token" />
            </div>
          </div>
        </div>

        <div className='text-[0.875rem] mdup:text-[1rem]'>
          {isBuy && <span>Balance: { raiseTokenBalance !== undefined && raiseTokenDecimal !== undefined ? `${formatUnits(raiseTokenBalance, raiseTokenDecimal)} ${raiseTokenSymbol ?? ''}` : 'N/A' }</span>}
          {isSell && <span>Balance: { maxfunTokenBalance !== undefined && maxfunTokenDecimal !== undefined ? `${formatUnits(maxfunTokenBalance, maxfunTokenDecimal)} ${maxfunTokenSymbol ?? ''}` : 'N/A' }</span>}
        </div>
        
      </div>

      <div className='flex justify-between gap-2'>
        {isBuy && [1000, 5000, 10000, 50000].map((item, index) => (
          <button disabled={isLoadingTrade} key={index} onClick={() => setAmount(item.toString())} className='flex-1 h-[1.875rem] mdup:h-[2.25rem] flex-center rounded-[0.625rem] border-[2px] border-white/20 text-[0.75rem] font-medium opacity-60'>
            {`${item} ${raiseTokenSymbol ?? ''}`}
          </button>
        ))}

        {isSell && [0.25, 0.5, 0.75, 1].map((item, index) => (
          <button disabled={isLoadingTrade} key={index} onClick={() => {
            if (maxfunTokenBalance === undefined || maxfunTokenDecimal === undefined) {
              return;
            }

            if (item === 1) {
              setAmount(formatUnits(maxfunTokenBalance, maxfunTokenDecimal))
              return;
            }

            const amount = formatUnits(BigInt(Big(maxfunTokenBalance.toString()).times(item).toFixed(0)), maxfunTokenDecimal)
            setAmount(amount)
          }} className='flex-1 h-[1.875rem] mdup:h-[2.25rem] flex-center rounded-[0.625rem] border-[2px] border-white/20 text-[0.75rem] font-medium opacity-60'>
            {`${item * 100}%`}
          </button>
        ))}
      </div>

      {isBuy && <div className='text-[0.875rem] mdup:text-[1rem] opacity-60 leading-[100%]'>You will receive: {amountOutBuy !== undefined && maxfunTokenDecimal !== undefined ? `${formatUnits(amountOutBuy, maxfunTokenDecimal)} ${maxfunTokenSymbol ?? ''}` : 'N/A'}</div>}
      {isSell && <div className='text-[0.875rem] mdup:text-[1rem] opacity-60 leading-[100%]'>You will receive: {amountOutSell !== undefined && raiseTokenDecimal !== undefined ? `${formatUnits(amountOutSell, raiseTokenDecimal)} ${raiseTokenSymbol ?? ''}` : 'N/A'}</div>}

      <SolidButton onClick={() => {
        isBuy && onBuyHandle()
        isSell && onSellHandle()
      }}>
        Buy
      </SolidButton>

      <div className='text-[0.875rem] mdup:text-[1rem] opacity-60 text-red-10 text-center leading-[100%]'>
        The Pool was migrated to UniswapV3
      </div>

      <SlippageModal 
        isOpen={isOpenSlippage} 
        onClose={onCloseSlippage} 
        slippage={slippage} 
        onSetSlippage={setSlippage} 
      />

    </div>
  )
}
