import clsx from 'clsx'
import { useContext, useEffect, useMemo, useState } from 'react'
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
import AppContext from '@/store/app'
import LoadingMore from '@/components/LoadingMore'
import { toastError } from '@/components/toast'

interface BuyAndSellProps {
  className?: string
  tokenAddress: string
  raiseTokenIcon: string
  maxfunTokenIcon: string
}

enum ButtonText {
  InsufficientAsset = 'Insufficient Asset',
  Buy = 'Buy',
  Sell = 'Sell',
}

export default function BuyAndSell({className, raiseTokenIcon, maxfunTokenIcon}: BuyAndSellProps) {
  const { address, isConnected } = useAccount()
  const { onConnectWallet} = useContext(AppContext)
  
  const [isBuy, setIsBuy] = useState(true)
  const isSell = !isBuy
  const [amount, setAmount] = useState<string>('')
  const [slippage, setSlippage] = useState(10)
  const [buttonText, setButtonText] = useState(ButtonText.Buy)

  const { isOpen: isOpenSlippage, onOpen: onOpenSlippage, onClose: onCloseSlippage } = useDisclosure();

  // const maxfunTokenAddress = tokenAddress
  // const maxfunTokenAddress = raiseToken.address
  const maxfunTokenAddress = '0x3532bd1c11fd1a5763a5c445db8b7f7fc10d5ef8'
  const raiseTokenAddress = '0xF58F5BFee6B2580a983aC25bEc2781E05475341C'

  // write contract
  const { onBuy, state: buyState, onReset: onResetBuy } = useBuy()
  const isLoadingBuy = buyState.loading
  const { onSell, state: sellState, onReset: onResetSell } = useSell()
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
      {
        address: VITE_CONTRACT_MAX_FUN_CURVE as `0x${string}`,
        abi: MaxFunCurveAbi,
        functionName: 'getPair',
        args: [maxfunTokenAddress as `0x${string}`, raiseTokenAddress as `0x${string}`]
      }
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
  const pairAddress = contractInfo?.[5]

  // raise token balance
  const { data: raiseTokenBalance, refetch: refetchRaiseTokenBalance } = useReadContract({
    address: raiseTokenAddress as `0x${string}`,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
    query: {
      enabled: !!address && !!raiseTokenAddress
    }
  })

  // maxfun token balance
  const { data: maxfunTokenBalance, refetch: refetchMaxfunTokenBalance } = useReadContract({
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

  const isCanBuy = useMemo(() => {
    setButtonText(ButtonText.Buy)
    if (isSell) return false
    if (isLoadingTrade) return false
    if (!amount || Number(amount) <= 0) return false
    if (raiseTokenBalance === undefined || raiseTokenDecimal === undefined) return false


    if (Big(amount).times(Big(10).pow(raiseTokenDecimal)).gt(Big(raiseTokenBalance.toString()))) {
      setButtonText(ButtonText.InsufficientAsset)
      return false
    }

    return true
  }, [amount, isLoadingTrade, isSell, raiseTokenBalance, raiseTokenDecimal])
  

  const isCanSell = useMemo(() => {
    if (isBuy) return false
    if (isLoadingTrade) return false
    if (!amount) return false
    if (maxfunTokenBalance === undefined || maxfunTokenDecimal === undefined) return false

    setButtonText(ButtonText.Sell)

    if (Big(amount).times(Big(10).pow(maxfunTokenDecimal)).gt(Big(maxfunTokenBalance.toString()))) {
      setButtonText(ButtonText.InsufficientAsset)
      return false
    }

    return true
  }, [amount, isBuy, isLoadingTrade, maxfunTokenBalance, maxfunTokenDecimal])

  const onBuyHandle = async () => {
    if (!amount) return
    if (!amountOutBuy) return
    if (!raiseTokenDecimal) return
    onBuy({
        amountIn: BigInt(Big(amount).times(Big(10).pow(raiseTokenDecimal)).toFixed(0)),
        tokenAddress: maxfunTokenAddress,
        amountMinOut: amountOutBuy,
        asset: raiseTokenAddress
    })
  }

  const onSellHandle = async () => {
    if (!amount) return
    if (!amountOutSell) return
    if (!maxfunTokenDecimal) return
    onSell({
      amountIn: BigInt(Big(amount).times(Big(10).pow(maxfunTokenDecimal)).toFixed(0)),
      tokenAddress: maxfunTokenAddress,
      amountMinOut: amountOutSell,
      asset: raiseTokenAddress
    })
  }

  // check buy
  useEffect(() => {
    if (buyState.success) {
      onResetBuy()
      setAmount('')
      refetchRaiseTokenBalance()
      refetchMaxfunTokenBalance()
      setButtonText(ButtonText.Buy)
    }

    if (buyState.error) {
      console.log('buyState.error', buyState.error);
      onResetBuy()
      if (buyState.error.includes('User rejected the request')) {
        toastError('Cancel Approve')
      } else {
        toastError('Transaction Failure')
      }
    }
  }, [buyState.success, buyState.error, onResetBuy, refetchRaiseTokenBalance, refetchMaxfunTokenBalance])

  // check sell
  useEffect(() => {
    if (sellState.success) {
      onResetSell()
      setAmount('') 
      refetchRaiseTokenBalance()
      refetchMaxfunTokenBalance()
      setButtonText(ButtonText.Sell)
    }

    if (sellState.error) {
      onResetSell()
      if (sellState.error.includes('User rejected the request')) {
        toastError('Cancel Approve')
      } else {
        toastError('Transaction Failure')
      }
    }
  }, [sellState.success, sellState.error, onResetSell, refetchRaiseTokenBalance, refetchMaxfunTokenBalance])
  
  return (
    <div className={clsx(" flex-shrink-0 w-full mdup:w-[30rem] flex flex-col gap-[0.62rem] mdup:gap-[0.8rem] bg-black-10 rounded-[0.625rem] px-4 mdup:px-[1.49rem] py-[0.94rem] mdup:py-[1.3rem]", className)}>
      <div className={`self-end h-[1.875rem] rounded-[5px] text-[0.875rem] mdup:text-[1rem] flex-center px-[0.83rem] mdup:px-[1.34rem] w-fit ${isOnUniswap ? 'border-[2px] border-red-10 text-red-10' : ' bg-white/10'}`}>
        Base on uniswap
      </div>

      <div className='flex justify-between gap-[0.44rem] mdup:gap-[0.62rem]'>
        <button disabled={isLoadingTrade} onClick={() => {
          setIsBuy(true)
          setButtonText(ButtonText.Buy)
        }} className={`flex-1 h-[2.5rem] mdup:h-[3.125rem] text-[1rem] mdup:text-[1.25rem] font-medium rounded-[0.625rem] ${isBuy ? 'bg-red-10 hover:bg-red-10' : 'bg-black-10 border-[2px] border-white/10'}`}>
          Buy
        </button>
        <button disabled={isLoadingTrade} onClick={() => {
          setIsBuy(false)
          setButtonText(ButtonText.Sell)
        }} className={`flex-1 h-[2.5rem] mdup:h-[3.125rem] text-[1rem] mdup:text-[1.25rem] font-medium rounded-[0.625rem] ${isSell ? 'bg-red-10 hover:bg-red-10' : 'bg-black-10 border-[2px] border-white/10'}`}>
          Sell
        </button>
      </div>

      <div className='flex justify-between items-center'>
        <div></div>
        {/* <div className=' h-[1.875rem] bg-white/10 rounded-[0.375rem] flex-center px-[0.69rem] mdup:px-[0.8rem] font-medium text-[0.875rem] mdup:text-[1rem]'>
          Switch to Banana
        </div> */}
        <button disabled={isLoadingTrade} onClick={onOpenSlippage}>
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

      {isBuy && <div className='text-[0.875rem] mdup:text-[1rem] opacity-60 leading-[100%]'>
        You will receive: {amountOutBuy !== undefined && maxfunTokenDecimal !== undefined ? `${formatUnits(amountOutBuy, maxfunTokenDecimal)} ${maxfunTokenSymbol ?? ''}` : 'N/A'}
      </div>}
      {isSell && <div className='text-[0.875rem] mdup:text-[1rem] opacity-60 leading-[100%]'>
        You will receive: {amountOutSell !== undefined && raiseTokenDecimal !== undefined ? `${formatUnits(amountOutSell, raiseTokenDecimal)} ${raiseTokenSymbol ?? ''}` : 'N/A'}
      </div>}

      {!isConnected && <SolidButton onClick={onConnectWallet}>Connect Wallet</SolidButton>}

      {isConnected && <SolidButton isDisabled={isBuy ? !isCanBuy : !isCanSell} onClick={() => {
        isBuy && onBuyHandle()
        isSell && onSellHandle()
      }}>
        {isLoadingTrade 
         ? <LoadingMore isDark={true} />
         : <>{buttonText}</>}
      </SolidButton>}

      {isOnUniswap && <a target='_blank' href={`https://app.uniswap.org/explore/pools/base/${pairAddress}`} className='text-[0.875rem] mdup:text-[1rem] opacity-60 text-red-10 text-center leading-[100%]'>
        The Pool was migrated to UniswapV3
      </a>}

      <SlippageModal 
        isOpen={isOpenSlippage} 
        onClose={onCloseSlippage} 
        slippage={slippage} 
        onSetSlippage={setSlippage} 
      />

    </div>
  )
}
