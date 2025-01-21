import clsx from 'clsx'
import { useState } from 'react'
import SettingIcon from '@/assets/icons/setting.png'
import SolidButton from '@/components/button/SolidButton'
import { useDisclosure } from '@chakra-ui/react'
import SlippageModal from './SlippageModal'
import { toastError, toastInfo, toastSuccess, toastWarning } from '@/components/toast'

export default function BuyAndSell({className}: {className?: string}) {
  const [isBuy, setIsBuy] = useState(true)
  const isSell = !isBuy
  const isOnUniswap = true

  const [slippage, setSlippage] = useState(10)

  const { isOpen: isOpenSlippage, onOpen: onOpenSlippage, onClose: onCloseSlippage } = useDisclosure();

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

      <div className=' bg-white/20 rounded-[0.625rem] px-[0.97rem] mdup:px-[1.22rem] py-[0.5rem] flex justify-between gap-4'>
        <div className='flex-1'>
          <input
           className=' w-full outline-none placeholder:text-white/40 placeholder:font-medium text-[1rem] font-medium bg-transparent mt-[0.4rem]'
           placeholder='Enter the amount'
          />
          <div className='text-[0.875rem] mdup:text-[1rem]'>Balance: 0 SOL</div>
        </div>
        <div className='self-start flex items-center gap-2 mdup:gap-[0.7rem]'>
          <span className='font-medium text-[1rem] mdup:text-[1.125rem]'>Sol</span>
          <div className='size-[1.875rem] rounded-full bg-blue-400'></div>
        </div>
      </div>

      <div className='flex justify-between gap-2'>
        {[1000, 5000, 10000, 50000].map((item, index) => (
          <button key={index} className='flex-1 h-[1.875rem] mdup:h-[2.25rem] flex-center rounded-[0.625rem] border-[2px] border-white/20 text-[0.75rem] font-medium'>
            {`${item} SOL`}
          </button>
        ))}
      </div>

      {isBuy && <div className='text-[0.875rem] mdup:text-[1rem] opacity-60 leading-[100%]'>Cost:0.000233 SOL</div>}
      {isSell && <div className='text-[0.875rem] mdup:text-[1rem] opacity-60 leading-[100%]'>You will receive: 1000 BANANA</div>}

      <SolidButton onClick={() => {
        toastSuccess('Transaction Success')
        toastError('Transaction Failed')
        toastWarning('Transaction Failed')
        toastInfo('Transaction Success')
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
