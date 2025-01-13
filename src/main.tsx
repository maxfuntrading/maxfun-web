import React from 'react'
import ReactDOM from 'react-dom/client'
import '@rainbow-me/rainbowkit/styles.css';
import './index.css'
import { RouterProvider } from 'react-router-dom'
import AppRouter from './router/router.tsx'
import AllProviders from './components/providers/AllProviders.tsx';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AllProviders>
      <RouterProvider router={AppRouter} />
    </AllProviders>
  </React.StrictMode>,
)
