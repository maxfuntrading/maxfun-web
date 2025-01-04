import { Link, useLocation } from "react-router-dom"

export default function Header() {

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
    <header className=" flex-shrink-0 w-full sticky top-0 h-[70px] md:h-[120px] lg:h-[120px] bg-black">
      <div className="flex justify-between items-center h-full">
        <div className="flex items-center gap-4">
          {NavData.map((item, index) => (
            <Link key={index} to={item.path} className={`${item.isActive ? "text-red-500" : "text-white"}`}>{item.name}</Link>
          ))}
        </div>
      </div>
    </header>
  )
}
