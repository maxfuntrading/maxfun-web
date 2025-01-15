import TokenAvatar from '@/assets/images/home/aanana.png'
import { CopyIcon } from './Icon'
import { copyText } from '@/utils/utils'
import { toastSuccess } from '@/utils/toast'

export default function BaseInfo() {
  return (
    <div className=" bg-black-10 rounded-[0.625rem] px-[0.63rem] py-[1.19rem]">
      <div className='flex justify-start gap-[1.41rem]'>
        <img className='w-[6.07rem] h-[8.125rem] rounded-[0.625rem] object-cover' src={TokenAvatar} alt="" />
        <div className=''>
          <div>
            <div className='text-white font-medium line-clamp-2'>
              Shiba Banana Coin($ BANANA) Shiba
              Shiba Banana Coin($ BANANA)
            </div>
            <div className='text-[0.88rem] mt-[0.31rem]'>
              <span className='text-white/60'>Contract:</span><br className='block mdup:hidden' />
              <span className='font-medium'>
                0x93793Bd...30e486A86 
                <button onClick={() => {
                  copyText('0x93793Bd...30e486A86')
                  toastSuccess('Copied')
                }} className='ml-[0.8rem]'><CopyIcon className='inline-block size-[0.75rem]' /></button>
              </span>
            </div>
          </div>

          <div>
            Twitter, Telegram, Website
          </div>
        </div>
      </div>
      <div className=' w-full h-[13.25rem] px-[0.31rem] mt-[0.94rem]'>
        <div className='size-full  bg-white/10 rounded-[0.625rem]'></div>
      </div>
    </div>
  )
}
