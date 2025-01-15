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
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer navData={navData} />
    </div>
  )
}
