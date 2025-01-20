import SolidButton from "@/components/button/SolidButton";
import MaxfunModal from "@/components/MaxfunModal";
import { useState } from "react";

interface Props {
  isOpen: boolean,
  onClose: () => void,
  slippage: number,
  onSetSlippage: (slippage: number) => void,
}

export default function SlippageModal({isOpen, onClose, slippage, onSetSlippage}: Props) {
  const [selectedSlippage, setSelectedSlippage] = useState<number | undefined>(slippage)
  const slipageData = [2, 10, 20]

  return (
    <MaxfunModal isOpen={isOpen} onClose={onClose} title="">
      <div className="w-full flex flex-col items-center">
        <div className="text-[1.25rem] font-semibold text-center">Set max. slippage (%)</div>
        
        <div className="w-full flex justify-between mt-[1.74rem] gap-[0.49rem] flex-wrap">
          {slipageData.map((item, index) => (
            <button 
              onClick={() => setSelectedSlippage(item)} 
              key={index} 
              className={`flex-1 h-[2.75rem] mdup:h-[3.125rem] flex-center rounded-[0.625rem] border-[2px] text-[0.875rem] mdup:text-[1rem] font-semibold ${selectedSlippage === item ? 'border-red-10 text-red-10' : ' border-white/10'}`}>
              {`${item} %`}
            </button>
          ))}

          <div className="w-full mdup:flex-1 h-[2.75rem] mdup:h-[3.125rem] sm:mt-[0.66rem] flex-center rounded-[0.625rem] border-[2px] text-[0.875rem] mdup:text-[1rem] font-semibold border-white/10 ">
            <input 
              type="number" 
              className="w-full h-full outline-none bg-transparent text-white pl-[1.73rem] onblur:border-red-10"
              value={selectedSlippage !== undefined ? selectedSlippage : ''} 
              max={100}
              min={0}
              onKeyDown={(e) => {
                if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                  e.preventDefault();
                }
              }}
              onChange={(e) => {
                const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
                if (e.target.value === '') {
                  setSelectedSlippage(undefined)
                } else {
                  setSelectedSlippage(value);
                }
              }}
            />
            <div className="text-[0.875rem] mdup:text-[1rem] font-semibold px-[1.73rem]">%</div>
          </div>

        </div>

        {(selectedSlippage !== undefined && selectedSlippage > 10) && <div className="text-red-10 mt-4 text-[0.75rem] mdup:text-[1rem]">
          Caution: Slippage above 10% may result in significant deviations in the transaction price. Please proceed with caution.
        </div>}

        <SolidButton onClick={() => {
          console.log('selectedSlippage', selectedSlippage)
          if (!selectedSlippage) {
            return
          }
          onSetSlippage(selectedSlippage)
          onClose()
        }} className=" sm:w-full mdup:w-[18.75rem] mt-4 mdup:mt-[2.55rem]">
          <span>Save</span>
        </SolidButton>

        <div className="h-4"></div>
      </div>
    </MaxfunModal>
  )
}
