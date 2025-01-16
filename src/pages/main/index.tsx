import { Outlet, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import { NavData } from './type'
export default function Main() {
  const pathname = useLocation().pathname

  const navData: NavData[] = [
    {
      name: 'Home',
      path: '/',
      isActive: pathname === '/' || pathname.includes('/token'),
    },
    {
      name: 'Launcher',
      path: '/launcher',
      isActive: pathname.includes('/launcher'),
    },
    {
      name: 'Ranking',
      path: '/ranking',
      isActive: pathname.includes('/ranking'),
    },
    {
      name: 'Profile',
      path: '/profile',
      isActive: pathname.includes('/profile'),
    },
  ]

  return (
    <div className="w-full h-full flex flex-col min-h-dvh">
      <Header navData={navData} />
      <div className="flex-1 relative">
        <Outlet />
        <div className=' w-full flex justify-center absolute bottom-0'>
          <div className=' w-full mdup:w-[60rem] h-[8rem] mdup:h-[15rem] overflow-y-hidden relative'>
            <div className="w-full mdup:w-[60rem] h-[80rem] mdup:h-[163rem] absolute top-0 left-0 translate-y-[6rem] mdup:translate-y-[10rem] opacity-20 bg-red-10 rounded-full blur-[50px] mdup:blur-[100px]" />
          </div>
        </div>
      </div>
      <Footer navData={navData} />
    </div>
  )
}
