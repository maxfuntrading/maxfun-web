import { Outlet, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import { NavData } from './type'
import { fetchLogin, fetchNonce } from '@/api/auth'
import { ERR_CODE } from '@/constants/ERR_CODE'
import { SiweMessage } from 'siwe'
import { useAccount, useDisconnect, useSignMessage } from 'wagmi'
import { useContext, useEffect, useRef } from 'react'
import AppContext from '@/store/app'
import Welcome from './components/Welcome'

export default function Main() {
  const { state: {isLogin}, onDisconnectWallet, dispatch } = useContext(AppContext)
  const pathname = useLocation().pathname
  const { address, isConnected, chainId } = useAccount()
  const { signMessageAsync } = useSignMessage();
  const { disconnect } = useDisconnect()
  const hasAttemptedLogin = useRef(false)

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
      name: 'Portfolio',
      path: '/profile',
      isActive: pathname.includes('/profile'),
    },
  ]

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleLogin = async () => {
    if (hasAttemptedLogin.current) {
      return
    }

    if (!isConnected || !address || isLogin) {
      return
    }

    const authToken = localStorage.getItem('auth_token')
    if (authToken) {
      dispatch({field: 'isLogin', value: true})
      return
    }

    hasAttemptedLogin.current = true
    
    try {
      const nonceRes = await fetchNonce()

      if (nonceRes.code !== ERR_CODE.SUCCESS) {
        return
      }

      // create sign message
      const domain = window.location.host;
      const origin = window.location.origin;
      const nonce = nonceRes.data.nonce;

      const message = new SiweMessage({
        domain,
        uri: origin,
        address,
        statement: 'Login to the app',
        nonce: nonce,
        version: "1",
        chainId: chainId,
      })

      const prepareMessage = message.prepareMessage()

      const signResult = await signMessageAsync({message: prepareMessage}).catch(() => {
        onDisconnectWallet();
      })

      if (!signResult) {
        return
      }

      const verifySignRes = await fetchLogin(prepareMessage, signResult, nonce).catch((error) => {
        console.error('fetchLogin error', error);
        onDisconnectWallet();
      })

      if (!verifySignRes || verifySignRes.code !== ERR_CODE.SUCCESS) {
        onDisconnectWallet()
        return
      }

      if (verifySignRes.data.auth_token) {
        localStorage.setItem('auth_token', verifySignRes.data.auth_token)
        dispatch({field: 'isLogin', value: true})
      }
      
    } catch (error) {
      console.error('Login process error:', error)
      onDisconnectWallet()
    }
  }

  // login
  useEffect(() => {
    handleLogin()
  }, [address, chainId, disconnect, dispatch, handleLogin, isConnected, isLogin, onDisconnectWallet, signMessageAsync])

  // profile not login, re-sign
  useEffect(() => {
    if (!isConnected) return;
    if (isLogin) return;
    if (pathname.includes('/profile')) {
      handleLogin()
    }
  }, [handleLogin, isConnected, isLogin, pathname])

  // reset login attempt
  useEffect(() => {
    if (!isConnected) {
      hasAttemptedLogin.current = false
    }
  }, [isConnected])

  // listen auth_token
  useEffect(() => {
    const authToken = localStorage.getItem('auth_token');
    handleStorage(authToken)

    function handleStorage(value: any) {
      if (value) {
        dispatch({field: 'isLogin', value: true})
      } else {
        dispatch({field: 'isLogin', value: false})
        onDisconnectWallet()
      }
    }

    window.addEventListener('storage', (event) => {
      if (event.key === 'auth_token') {
        handleStorage(event.newValue)
      }
    })

    return () => {
      window.removeEventListener('storage', () => {})
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="w-full h-full flex flex-col min-h-dvh">
      <Welcome />

      <Header navData={navData} />
      <div className="flex-1 relative">
        <div className="w-full h-full relative z-[1]">
          <Outlet />
        </div>

        <div className=" w-full flex justify-center absolute bottom-0">
          <div className=" w-full mdup:w-[60rem] h-[8rem] mdup:h-[15rem] overflow-y-hidden relative">
            <div className="w-full mdup:w-[60rem] h-[80rem] mdup:h-[163rem] absolute top-0 left-0 translate-y-[6rem] mdup:translate-y-[10rem] opacity-20 bg-red-10 rounded-full blur-[50px] mdup:blur-[100px]" />
          </div>
        </div>
      </div>
      <Footer navData={navData} />
    </div>
  )
}
