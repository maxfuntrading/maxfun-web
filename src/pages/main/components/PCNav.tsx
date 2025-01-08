import { Link } from 'react-router-dom'
import { NavData } from '../type'
import clsx from 'clsx'
export default function PCNav({ navData, className }: { navData: NavData[], className?: string }) {
  return (
    <div className={clsx("flex items-center gap-[3.88rem]", className)}>
      {navData.map((item, index) => (
        <Link key={index} to={item.path} className={`relative flex justify-center transition-all duration-300 ${item.isActive ? "text-red-10" : "text-white"}`}>
          <span className='text-[1.25rem]'>
            {item.name}
          </span>

          <div className={`absolute bottom-[-0.78rem] h-[0.25rem] rounded-[0.3125rem] bg-red-10 transition-all duration-300 ${item.isActive ? "opacity-100 w-[1.875rem]" : "opacity-0 w-0"}`}></div>
        </Link>
      ))}
    </div>
  )
}
