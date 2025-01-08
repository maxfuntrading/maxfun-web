import WrapperRainbow from "@/components/button/WrapperRainbow";
import { useCreateReducer } from "@/hooks/useCreateReducer";
import AppContext, { AppIntialState, appInitialState } from "@/store/app";
import { useRef } from "react";
import { Outlet } from "react-router-dom";
import { useDisconnect } from "wagmi";

export default function App() {
  const contextValue = useCreateReducer<AppIntialState>({initialState: appInitialState})
  const connectWalletRef = useRef<HTMLButtonElement>(null)
  const disconnectWalletRef = useRef<HTMLButtonElement>(null)
  const { disconnectAsync } = useDisconnect()

  const handleConnectWallet = () => {
    connectWalletRef.current?.click()
  }

  const handleDisconnectWallet = async () => {
    await disconnectAsync()
  }

  return (
    <AppContext.Provider 
      value={{
        ...contextValue,
        onConnectWallet: handleConnectWallet,
        onDisconnectWallet: handleDisconnectWallet
      }}>
      <div className="w-screen">
        <Outlet />
      </div>

      <WrapperRainbow
        connectComponent={<button ref={connectWalletRef} className="w-0 h-0 hidden"></button>}
        disconnectComponent={<button ref={disconnectWalletRef} className="w-0 h-0 hidden"></button>}
      />
    </AppContext.Provider>
  )
}
