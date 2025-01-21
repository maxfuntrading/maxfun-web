
import logo from '@/assets/images/logo.png'
import TokenAvatar from '@/assets/images/home/token-avatar.png'
import Slider, { Settings } from 'react-slick'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useContext, useEffect } from 'react';
import { fetchMarquee } from '@/api/home';
import AppContext from '@/store/app';

export default function HotTx() {
  const {state: {isLogin}} = useContext(AppContext)

  const settings: Settings = {
    dots: false,
    cssEase: "linear",
    autoplay: true,
    speed: 2000, // 降低动画时间，让滚动更流畅
    autoplaySpeed: 10, 
    pauseOnHover: true,
    arrows: false,
    prevArrow: <></>,
    nextArrow: <></>,
    variableWidth: true,
    infinite: true,
  }

  useEffect(() => {
    if (!isLogin) {
      return
    }

    fetchMarquee().then((res) => {
      console.log(res);
    })
  }, [isLogin])

  return (
    <div className=" w-full ">
      <Slider {...settings} className='w-full flex flex-col mdup:flex-row h-20 mdup:h-[5.625rem] overflow-hidden'>
        {Array.from({ length: 10 }).map((_, index) => (
          <HotTxItem key={index} index={index} />
        ))}
      </Slider>
    </div>
  )
}

const HotTxItem = ({index}: {index: number}) => {
  const isBought = index % 2 === 0
  return (
    <div className="shrink-0 h-20 bg-black-10 min-w-[18.75rem] mdup:w-[22.5rem] mdup:h-[5.625rem] rounded-[0.625rem] mdup:rounded-none flex justify-between items-center px-[1.32rem] mdup:px-[0.87rem] cursor-pointer border-2 border-transparent hover:border-[#EC3E6F] mdup:hover:rounded-[0.625rem] transition-all duration-300 mr-[0.06rem]">
      <div className='flex items-center gap-[1.71rem]'>
        <img className='size-[3.375rem]' src={TokenAvatar} alt="" />
        
        <div className='flex flex-col text-[0.875rem] mdup:text-[1rem] leading-[1.4]'>
          <div className='text-[#DFE2EA] mdup:font-semibold'>0xee…daf999</div>
          <div>
            <span className={`font-semibold ${isBought ? 'text-[#06D188]' : 'text-[#EC3E6F]'}`}>{isBought ? 'Bought' : 'Sold'}</span>
            {' '}  
            <span className='mdup:text-[#9DA5B6] mdup:font-semibold'>0.44 MAX of</span>
          </div>
          <div className='text-[#9DA5B6] mdup:font-semibold mdup:text-white'>CHILL PUDGY</div>
        </div>
      </div>

      <img className='size-[2.25rem] mdup:size-[2.5rem]' src={logo} alt="" />
    </div>
  )
}