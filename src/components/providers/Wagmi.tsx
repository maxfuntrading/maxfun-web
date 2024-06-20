import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { sepolia  } from "viem/chains";
import { WagmiProvider, http } from "wagmi";

// eslint-disable-next-line react-refresh/only-export-components
export const config = getDefaultConfig({
  appName: "PumpBTC",
  projectId: "xxx", // wallet connect project id
  chains: [ sepolia ],
  transports: {
    [sepolia.id]: http(),
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