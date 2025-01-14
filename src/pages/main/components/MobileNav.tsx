import clsx from "clsx"
import { Link } from "react-router-dom"
import logo from '@/assets/images/logo.png'
import close from '@/assets/icons/close.png'
import { NavData } from "../type"
import { useContext } from "react"
import AppContext from "@/store/app"
import SolidButton from "@/components/button/SolidButton"
import { useAccount } from "wagmi"
import { formatAddress } from "@/utils/utils"
import { DisconnectIcon, ProfileIcon } from "./Icon"

export default function MobileNav({ navData, className, onClose }: { navData: NavData[], className?: string, onClose: () => void }) {
  const { onConnectWallet, onDisconnectWallet } = useContext(AppContext)
  const { isConnected, address } = useAccount()
  
  return (
    <div className={clsx("fixed top-0 bottom-0 left-0 right-0 bg-black-20 flex flex-col", className)}>
      <div className="flex-shrink-0 ">
        <div className="flex justify-between items-center  h-[4.395rem] px-4">
          <Link to="/" className="w-[1.8125rem] h-[1.875rem]">
            <img src={logo} alt="logo" />
          </Link>

          <button onClick={onClose}>
            <img className="size-6" src={close} alt="close" />
          </button>
        </div>

        <div className="mt-[1.9rem] px-[1.25rem]">
          <div className="flex flex-col items-start gap-[1.91rem]">
            {navData.map((item, index) => (
              <Link onClick={onClose} key={index} to={item.path} className={` text-[1.25rem] ${item.isActive ? "text-red-10" : "text-white"}`}>{item.name}</Link>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-end justify-center text-white">
        {!isConnected && <div className="w-full px-4 pb-[2.35rem]">
          <SolidButton className="" onClick={onConnectWallet}>
            <span className="text-[0.937rem] font-medium">Connect Wallet</span>
          </SolidButton>
        </div> }

        {isConnected && <div className="w-full flex items-center h-[10.69rem] bg-black-10 rounded-t-[1.875rem] px-4 flex-col">
          <div className="font-medium mt-[1.85rem]">{formatAddress(address ?? '')}</div>
          <div className="flex justify-center items-center w-full gap-[0.78rem] mt-[2.06rem]">
            <button className="flex-center gap-[0.39rem] w-[9.375rem] h-[3.125rem] bg-black-30 rounded-[0.625rem]">
              <ProfileIcon className="size-4" />
              <span className="text-[0.937rem] font-medium">Portfolio</span>
            </button>
            <button onClick={onDisconnectWallet} className="flex-center gap-[0.39rem] w-[9.375rem] h-[3.125rem] bg-black-30 rounded-[0.625rem]">
              <DisconnectIcon className="size-4" />
              <span className="text-[0.937rem] font-medium">Disconnect</span>
            </button>
          </div>
        </div>}
      </div>
    </div>
  )
}
