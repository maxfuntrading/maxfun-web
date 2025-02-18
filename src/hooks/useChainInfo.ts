import { useMemo } from "react"
import { useChains } from "wagmi"

export function useChainInfo() {
  const chains = useChains()

  const blockExploreUrl = 'https://basescan.org'

  const chainIdSupported = useMemo(() => {
    return chains.map((chain) => chain.id)
  }, [chains])
  

  return {
    blockExploreUrl,
    chainIdSupported,
    chains
  }
}
