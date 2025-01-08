import clsx from "clsx"
import { Link } from "react-router-dom"
import logo from '@/assets/images/logo.png'
import close from '@/assets/icons/close.png'
import { NavData } from "../type"

export default function MobileNav({ navData, className, onClose }: { navData: NavData[], className?: string, onClose: () => void }) {
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

      <div className="flex-1 flex items-end justify-center pb-[2.35rem] text-white">Connect wallet</div>
    </div>
  )
}
