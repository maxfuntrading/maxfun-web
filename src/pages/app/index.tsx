import WrapperRainbow from "@/components/button/WrapperRainbow";
import { useCreateReducer } from "@/hooks/useCreateReducer";
import AppContext, { AppIntialState, appInitialState } from "@/store/app";
import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useDisconnect } from "wagmi";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./ErrorFallback";

export default function App() {
  const contextValue = useCreateReducer<AppIntialState>({initialState: appInitialState})
  const { dispatch } = contextValue
  const connectWalletRef = useRef<HTMLButtonElement>(null)
  const disconnectWalletRef = useRef<HTMLButtonElement>(null)
  const { disconnectAsync } = useDisconnect()

  const location = useLocation()

  const handleConnectWallet = () => {
    connectWalletRef.current?.click()
  }

  const handleDisconnectWallet = async () => {
    await disconnectAsync()
    localStorage.removeItem('auth_token')
    dispatch({field: 'isLogin', value: false})
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);


  return (
    <AppContext.Provider 
      value={{
        ...contextValue,
        onConnectWallet: handleConnectWallet,
        onDisconnectWallet: handleDisconnectWallet
      }}>
        <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => {
          window.location.reload()
        }}>
          <div className="w-screen text-white bg-black-20 font-outfit">
            <Outlet />
          </div>
        </ErrorBoundary>

      <WrapperRainbow
        connectComponent={<button ref={connectWalletRef} className="w-0 h-0 hidden"></button>}
        disconnectComponent={<button ref={disconnectWalletRef} className="w-0 h-0 hidden"></button>}
      />
    </AppContext.Provider>
  )
}
