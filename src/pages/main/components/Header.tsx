import AppContext from "@/store/app"
import { useContext, useEffect, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAccount } from "wagmi"
import { NavData } from "../type"
import logo from '@/assets/images/logo.png'
import menu from '@/assets/icons/menu.png'
import MobileNav from "./MobileNav"
import PCNav from "./PCNav"
import XIcon from '@/assets/icons/x.png'
import XActiveIcon from '@/assets/icons/x-active.png'
import TelegramIcon from '@/assets/icons/telegram.png'
import TelegramActiveIcon from '@/assets/icons/telegram-active.png'
import { X_LINT, TELEGRAM_LINK } from "@/constants/constants"
import FlatButton from "@/components/button/FlatButton"
import { formatAddress } from "@/utils/utils"
import { DisconnectIcon, ProfileIcon } from "./Icon"
import useClickAway from "@/hooks/useClickAway"

const LinkData = [
  {
    name: 'X',
    link: X_LINT,
    icon: XIcon,
    activeIcon: XActiveIcon
  },
  {
    name: 'Telegram',
    link: TELEGRAM_LINK,
    icon: TelegramIcon,
    activeIcon: TelegramActiveIcon
  }
]

export default function Header({ navData }: { navData: NavData[] }) {
  const { isConnected, address } = useAccount()
  const { onConnectWallet, onDisconnectWallet } = useContext(AppContext)
  const [isOpenMobileNav, setIsOpenMobileNav] = useState(false)
  const pcMenuRef = useRef<HTMLDivElement>(null)
  const [isOpenPcMenu, setIsOpenPcMenu] = useState(false)
  useClickAway(pcMenuRef, () => setIsOpenPcMenu(false))

  const navigate = useNavigate()

  useEffect(() => {
    if (!isConnected) {
      setIsOpenPcMenu(false)
    }
  }, [isConnected])
  

  return (
    <header className=" flex-shrink-0 w-full sticky z-50 top-0 h-[4.395rem] md:h-[7.125rem] lg:h-[7.125rem] bg-black-20">
      <div className="flex justify-between items-center h-full px-4 mdup:px-[3.62rem]">
        <div className="flex items-center gap-[4.71rem] ">
          <Link to="/" className="w-[1.8125rem] h-[1.875rem] mdup:w-[3.03938rem] mdup:h-[3.125rem]">
            <img src={logo} alt="logo" />
          </Link>

          <PCNav navData={navData} className="hidden mdup:flex" />
        </div>

        <div className="hidden mdup:flex">
          <div className="flex items-center gap-[2.55rem] mr-12">
            {LinkData.map((item, index) => (
              <a key={index} href={item.link} target="_blank" rel="noopener noreferrer" className="group">
                <img src={item.icon} alt={item.name} className="size-4 block group-hover:hidden" />
                <img src={item.activeIcon} alt={item.name} className="size-4 hidden group-hover:block" />
              </a>
            ))}
          </div>
          
          {!isConnected && <FlatButton className=" !w-[8.125rem]" onClick={onConnectWallet}>
            <span className="text-[0.937rem] font-medium">Connect Wallet</span>
          </FlatButton>}

          {isConnected && <div onClick={() => {
            setIsOpenPcMenu(!isOpenPcMenu)
          }} ref={pcMenuRef} className="relative w-[8.125rem] h-[2.5rem] rounded-[0.625rem] bg-black-30 flex-center cursor-pointer">
            <span className="text-[0.937rem] font-medium">
              {formatAddress(address ?? '')}
            </span>

            {isOpenPcMenu && <div onClick={(e) => e.stopPropagation()} className=" absolute top-[3.12rem] left-0 w-full rounded-[0.625rem] bg-black-30 py-[1.25rem] px-[0.99rem] flex flex-col gap-[1rem] cursor-default">
              <div onClick={() => {
                navigate('/profile')
                setIsOpenPcMenu(false)
              }} className="flex items-center justify-start gap-[0.45rem] cursor-pointer">
                <ProfileIcon />
                <span className="text-[0.937rem] font-medium">Portfolio</span>
              </div>

              <div onClick={() => {
                onDisconnectWallet()
                setIsOpenPcMenu(false)
              }} className="flex items-center justify-start gap-[0.45rem] cursor-pointer">
                <DisconnectIcon />
                <span className="text-[0.937rem] font-medium">Disconnect</span>
              </div>
            </div>}
          </div>}
        </div>

        <div className="flex mdup:hidden">
          <button onClick={() => setIsOpenMobileNav(true)}><img src={menu} alt="menu" className="size-6" /></button>
          {isOpenMobileNav && <MobileNav onClose={() => setIsOpenMobileNav(false)} navData={navData} />}
        </div>
        
      </div>
    </header>
  )
}

