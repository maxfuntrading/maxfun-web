import { Link } from "react-router-dom"
import { NavData } from "../type"

export default function Footer({ navData }: { navData: NavData[] }) {
  return (
    <footer className="flex-shrink-0 w-full h-[70px] md:h-[120px] lg:h-[120px] bg-black-10 text-white">
      {navData.map((item, index) => (
        <Link key={index} to={item.path} className={`${item.isActive ? "text-red-500" : "text-white"}`}>{item.name}</Link>
      ))}
    </footer>
  )
}
