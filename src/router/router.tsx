import { createBrowserRouter, Navigate } from 'react-router-dom'
import App from '../pages/app'
import Home from '../pages/home'
import Main from '@/pages/main'
import Ranking from '@/pages/ranking'
import Profile from '@/pages/profile'
import Launcher from '@/pages/launcher'
import TokenDetail from '@/pages/token-detail'

const AppRouter = createBrowserRouter([
  {
    path: '',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Main />,
        children: [
          {
            index: true,
            element: <Home />,
          },
          {
            path: 'token/:tokenId',
            element: <TokenDetail />,
          },
          {
            path: 'launcher',
            element: <Launcher />,
          },
          {
            path: 'profile',
            element: <Profile />,
          },
          {
            path: 'ranking',
            element: <Ranking />,
          },
        ],
      },
      {
        path: '*',
        element: <Navigate to="/" />,
      },
    ],
  },
])

export default AppRouter
