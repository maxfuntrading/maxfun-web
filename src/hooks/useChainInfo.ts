import { IS_DEV } from "@/utils/runtime-config"
import { useMemo, useState } from "react"
import { useChains } from "wagmi"

export function useChainInfo() {
  const chains = useChains()

  const [blockExploreUrl,] = useState<string>(() => {
    if (IS_DEV) return 'https://sepolia.etherscan.io'
    return 'https://basescan.org'
  })

  const chainIdSupported = useMemo(() => {
    return chains.map((chain) => chain.id)
  }, [chains])
  

  return {
    blockExploreUrl,
    chainIdSupported,
    chains
  }
}
