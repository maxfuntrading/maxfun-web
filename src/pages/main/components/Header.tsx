import AppContext from "@/store/app"
import { useContext, useState } from "react"
import { Link } from "react-router-dom"
import { useAccount } from "wagmi"
import { NavData } from "../type"
import logo from '@/assets/images/logo.png'
import menu from '@/assets/icons/menu.png'
import MobileNav from "./MobileNav"
import PCNav from "./PCNav"

export default function Header({ navData }: { navData: NavData[] }) {
  const { isConnected } = useAccount()
  const { onConnectWallet, onDisconnectWallet } = useContext(AppContext)
  const [isOpenMobileNav, setIsOpenMobileNav] = useState(false)
  

  return (
    <header className=" flex-shrink-0 w-full sticky top-0 h-[4.395rem] md:h-[7.125rem] lg:h-[7.125rem] bg-black-20">
      <div className="flex justify-between items-center h-full px-4 mdup:px-[3.62rem]">
        <div className="flex items-center gap-[4.71rem] ">
          <Link to="/" className="w-[1.8125rem] h-[1.875rem] mdup:w-[3.03938rem] mdup:h-[3.125rem]">
            <img src={logo} alt="logo" />
          </Link>

          <PCNav navData={navData} className="hidden mdup:flex" />
        </div>

        <div className="hidden mdup:flex">
          <button onClick={isConnected ? onDisconnectWallet : onConnectWallet}>
            {isConnected ? 'Disconnect wallet' : 'Connect wallet'}
          </button>
        </div>

        <div className="flex mdup:hidden">
          <button onClick={() => setIsOpenMobileNav(true)}><img src={menu} alt="menu" className="size-6" /></button>
          {isOpenMobileNav && <MobileNav onClose={() => setIsOpenMobileNav(false)} navData={navData} />}
        </div>
        
      </div>
    </header>
  )
}
