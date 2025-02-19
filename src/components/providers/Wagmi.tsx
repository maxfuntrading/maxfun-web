import { VITE_WALLET_CONNECT_PROJECT_ID } from "@/utils/runtime-config";
import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { base  } from "viem/chains";
import { WagmiProvider, http } from "wagmi";

// eslint-disable-next-line react-refresh/only-export-components
export const config = getDefaultConfig({
  appName: "MaxFun",
  projectId: VITE_WALLET_CONNECT_PROJECT_ID,
  chains: [ base ],
  transports: {
    [base.id]: http('https://base-rpc.publicnode.com'),
  }
})

const queryClient = new QueryClient();

export default function Wagmi({children}: {children: React.ReactNode}) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}