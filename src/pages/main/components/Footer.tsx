import { Link } from "react-router-dom"
import { NavData } from "../type"
import XIcon from '@/assets/icons/x.png'
import XActiveIcon from '@/assets/icons/x-active.png'
import TelegramIcon from '@/assets/icons/telegram.png'
import TelegramActiveIcon from '@/assets/icons/telegram-active.png'
import { X_LINT, TELEGRAM_LINK } from "@/constants/constants"

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

export default function Footer({ navData }: { navData: NavData[] }) {
  return (
    <footer className="flex-shrink-0 w-full h-[6.25rem] mdup:h-[11.25rem] bg-black-10 flex flex-col justify-center items-center gap-4 mdup:gap-[1.61rem]">
      
      <div className="flex items-center gap-[2.55rem]">
        {LinkData.map((item, index) => (
          <a key={index} href={item.link} target="_blank" rel="noopener noreferrer" className="group">
            <img src={item.icon} alt={item.name} className="size-4 block group-hover:hidden" />
            <img src={item.activeIcon} alt={item.name} className="size-4 hidden group-hover:block" />
          </a>
        ))}
      </div>

      <div className=" sm:hidden flex gap-[2.59rem]">
        {navData.map((item, index) => (
          <Link key={index} to={item.path} className={`text-[1rem] ${item.isActive ? "text-red-10" : "text-white"}`}>{item.name}</Link>
        ))}
      </div>

      <div className="text-[0.875rem]">
        © 2024 XXXXXX. All rights reserved
      </div>
    </footer>
  )
}
