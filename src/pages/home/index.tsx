
import { useContext } from "react";
import AppContext from "@/store/app";
import { useAccount } from "wagmi";

export default function Home() {
  const { onConnectWallet, onDisconnectWallet } = useContext(AppContext)
  const { address } = useAccount()

  return (
    <div className=" w-full bg-red-400 md:bg-blue-400 lg:bg-green-400">
      <button onClick={() => onConnectWallet()}>Connect wallet</button>
      <button onClick={() => onDisconnectWallet()}>Disconnect wallet</button>
      <div>{address ?? 'Not connected'}</div>

      {Array.from({ length: 50 }).map((_, index) => (
        <div key={index} className="w-full h-[100px]">{index}</div>
      ))}
    </div>
  )
}
