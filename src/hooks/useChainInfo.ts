import { IS_DEV } from "@/utils/runtime-config"
import { useState } from "react"

export function useChainInfo() {
  const [blockExploreUrl,] = useState<string>(() => {
    if (IS_DEV) return 'https://sepolia.etherscan.io'
    return 'https://basescan.org'
  })
  

  return {
    blockExploreUrl
  }
}
