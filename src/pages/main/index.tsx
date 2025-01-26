import { Outlet, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import { NavData } from './type'
import { fetchLogin, fetchNonce } from '@/api/auth'
import { ERR_CODE } from '@/constants/ERR_CODE'
import { SiweMessage } from 'siwe'
import { useAccount, useSignMessage } from 'wagmi'
import { useContext, useEffect } from 'react'
import AppContext from '@/store/app'
import { toastError } from '@/components/toast'
import Welcome from './components/Welcome'


export default function Main() {
  const { state: {isLogin}, onDisconnectWallet, dispatch } = useContext(AppContext)
  const pathname = useLocation().pathname
  const { address, isConnected, chainId } = useAccount()
  const { signMessageAsync } = useSignMessage();
  

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

  // login
  useEffect(() => {
    const handleLogin = async () => {
      if (!isConnected || !address || isLogin) {
        return
      }

      const authToken = localStorage.getItem('auth_token')
      if (authToken) {
        dispatch({field: 'isLogin', value: true})
        return
      }
  
      const nonceRes = await fetchNonce()
  
      if (nonceRes.code !== ERR_CODE.SUCCESS) {
        return
      }
  
      // 构建签名数据
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
  
      const signResult = await signMessageAsync({message: prepareMessage}).catch((error) => {
        console.error('signMessageAsync error', error);
        onDisconnectWallet();
      })
  
      if (!signResult) {
        return
      }
  
      const verifySignRes = await fetchLogin(prepareMessage, signResult).catch((error) => {
        console.error('fetchLogin error', error);
        onDisconnectWallet();
      })
  
      if (!verifySignRes || verifySignRes.code !== ERR_CODE.SUCCESS) {
        toastError(verifySignRes?.msg || 'Error')
        onDisconnectWallet()
        return
      }
  
      if (verifySignRes.data.auth_token) {
        localStorage.setItem('auth_token', verifySignRes.data.auth_token)
        dispatch({field: 'isLogin', value: true})
      }
      
    }
    handleLogin()
  }, [address, chainId, dispatch, isConnected, isLogin, onDisconnectWallet, signMessageAsync])

  // 监听 auth_token
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
