import { MAX_FUN_FACTORY_ABI } from "@/constants/abi/MaxFunFactory"
import { WriteContractState } from "@/types/contract"
import { VITE_CONTRACT_MAX_FUN_FACTORY } from "@/utils/runtime-config"
import { useState } from "react"
import { useAccount, usePublicClient, useWriteContract } from "wagmi"

export default function useLaunch() {

  const { address } = useAccount()
  const publicClient = usePublicClient()
  const { writeContractAsync } = useWriteContract()

  const [state, setState] = useState<WriteContractState>({
    loading: false,
    success: false,
  })

  const onLaunch = async ({id, name, symbol, amount, asset, signature}: {id: number, name: string, symbol: string, amount: bigint, asset: string, signature: string}) => {
    console.log('launch params', [
      id,
      name,
      symbol,
      amount,
      asset,
      signature,
    ]);
    
    
    if (!address || !publicClient) {
      setState({
        loading: false,
        success: false,
        error: 'Contracts or user not ready',
      })
      console.error('Contracts or user not ready')
      return;
    }

    setState({
      loading: true,
      success: false,
    })

    try {
      // uint8 id,                    // 用于签名验证的ID
      // string memory _name,         // Max.Fun Asset Token的名称
      // string memory _ticker,       // Max.Fun Asset Token的代币符号
      // uint256 purchaseAmount,      // 创建者购买的资产代币数量
      // address asset,               // 资产代币的地址（如USDT、USDC等）
      // bytes memory signature       // 签名数据，用于白名单验证
      const hash = await writeContractAsync({
        address: VITE_CONTRACT_MAX_FUN_FACTORY,
        abi: MAX_FUN_FACTORY_ABI,
        functionName: 'launch',
        args: [
          id,
          name,
          symbol,
          amount,
          asset as `0x${string}`,
          `0x${signature}`,
        ],
      })

      const receipt = await publicClient.waitForTransactionReceipt({
          hash,
      })

      if (!receipt || receipt.status !== 'success') {
        setState({
          loading: false,
          success: false,
          error: 'Deposit reverted',
        })
        console.error('Deposit reverted')
        return
      }

      setState({
        loading: false,
        success: true,
        tx_hash: hash,
      })
    } catch (error) {
      setState({
        loading: false,
        success: false,
        error: `${error}`,
      })
      console.error("Error: ", error);
    }

  }

  const onReset = () => {
    setState({
      loading: false,
      success: false,
    })
  }

  return {
    state,
    onLaunch,
    onReset,
  }
}
