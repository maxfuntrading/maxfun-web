import { useContext, useEffect, useState } from 'react'
import SwitchButton from './components/SwitchButton'
import CreatedTokenList from './components/CreatedTokenList'
import Banner from '@/assets/images/profile/banner.png'
import Circle from '@/assets/images/profile/circle.svg'
import OwnedTokenList from './components/OwnedTokenList'
import { formatAddress } from '@/utils/utils'
import { UserInfoResponse } from './type'
import { fetchUserInfo } from '@/api/profile'
import { ERR_CODE } from '@/constants/ERR_CODE'
import AppContext from '@/store/app'

export default function Profile() {
  const [index, setIndex] = useState(0)
  const { state: {isLogin}} = useContext(AppContext)

  // user info
  const [userInfo, setUserInfo] = useState<UserInfoResponse>()
  
  useEffect(() => {
    if (!isLogin) return;
    fetchUserInfo().then((res) => {
      if (res.code !== ERR_CODE.SUCCESS) {
        return
      }
      setUserInfo(res.data)
    })
  }, [isLogin])

  return (
    <div className="w-full h-full flex flex-col px-[1.0625rem] mdup:px-[3.625rem] items-center">
      <div className="w-full h-full flex flex-col max-w-[87.5rem]">
        <div className="w-full mdup:h-[12rem] flex flex-col items-center mdup:mt-9 relative">
          <img
            src={Banner}
            alt=""
            className="hidden mdup:block w-full h-[6.25rem] object-cover  rounded-[0.625rem] overflow-clip"
          />
          <img
            src={Circle}
            alt=""
            className="hidden mdup:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[3.8rem] w-[10.8125rem] h-[8.125rem]"
          />
          {isLogin && <>
            {userInfo?.avatar && <img
              src={userInfo?.avatar}
              alt=""
              className="mdup:absolute mdup:top-1/2 mdup:left-1/2 mdup:-translate-x-1/2 mdup:-translate-y-[2.8rem] size-[4.375rem] mdup:size-[6.25rem] rounded-full"
            />}
            <span className="mt-2 mdup:mt-0 mdup:absolute mdup:bottom-2 text-sm mdup:text-base font-semibold">
              {formatAddress(userInfo?.address ?? '', 4, 6)}
            </span>
          </>}
        </div>
        {isLogin && <div className="w-full mdup:w-2/5 flex flex-row items-center justify-between mt-[2.125rem] mdup:mt-12 z-10">
          <div className="w-full mdup:w-auto flex flex-row justify-center items-center gap-[2.875rem]">
            <SwitchButton
              title="Token Ownen"
              selected={index === 0}
              onClick={() => setIndex(0)}
            />
            <SwitchButton
              title="Token Created"
              selected={index === 1}
              onClick={() => setIndex(1)}
            />
          </div>
        </div>}
        {isLogin && index === 0 && <OwnedTokenList />}
        {isLogin && index === 1 && <CreatedTokenList />}
      </div>
    </div>
  )
}
