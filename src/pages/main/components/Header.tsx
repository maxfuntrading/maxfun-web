import AppContext from "@/store/app"
import { useContext } from "react"
import { Link, useLocation } from "react-router-dom"
import { useAccount } from "wagmi"

export default function Header() {
  const { isConnected, address } = useAccount()
  const { onConnectWallet, onDisconnectWallet } = useContext(AppContext)

  const pathname = useLocation().pathname
  
  const NavData = [
    {
      name: "Home",
      path: "/",
      isActive: pathname === "/"
    },
    {
      name: "Launcher",
      path: "/launcher",
      isActive: pathname.includes("/launcher")
    },
    {
      name: "Refferal",
      path: "/refferal",
      isActive: pathname.includes("/refferal")
    },
    {
      name: "Ranking",
      path: "/ranking",
      isActive: pathname.includes("/ranking")
    },
  ]

  return (
    <header className=" flex-shrink-0 w-full sticky top-0 h-[4.395rem] md:h-[7.125rem] lg:h-[7.125rem] bg-black-10">
      <div className="flex justify-between items-center h-full">
        <div className="flex items-center gap-4">
          {NavData.map((item, index) => (
            <Link key={index} to={item.path} className={`${item.isActive ? "text-red-500" : "text-white"}`}>{item.name}</Link>
          ))}
        </div>

        <div>
          <div className="text-white">{address ?? 'Not connected'}</div>
          <button onClick={isConnected ? onDisconnectWallet : onConnectWallet} className="text-white">{isConnected ? 'Disconnect wallet' : 'Connect wallet'}</button>
        </div>
      </div>
    </header>
  )
}
