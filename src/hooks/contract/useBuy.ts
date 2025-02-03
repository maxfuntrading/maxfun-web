import { MAX_FUN_FACTORY_ABI } from "@/constants/abi/MaxFunFactory"
import { WriteContractState } from "@/types/contract"
import { VITE_CONTRACT_MAX_FUN_CURVE, VITE_CONTRACT_MAX_FUN_FACTORY } from "@/utils/runtime-config"
import { useState } from "react"
import { erc20Abi } from "viem"
import { useAccount, usePublicClient, useWriteContract } from "wagmi"

export default function useBuy() {

  const { address } = useAccount()
  const publicClient = usePublicClient()
  const { writeContractAsync } = useWriteContract()

  const [state, setState] = useState<WriteContractState>({
    loading: false,
    success: false,
  })

  const onBuy = async (
    { 
      amountIn, 
      tokenAddress, 
      amountMinOut, 
      asset,
    }: {
      amountIn: bigint, 
      tokenAddress: string, 
      amountMinOut: bigint, 
      asset: string,
    }
  ) => {

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

    const maxFunFactoryAddress = VITE_CONTRACT_MAX_FUN_FACTORY as `0x${string}`
    const maxFunCurveAddress = VITE_CONTRACT_MAX_FUN_CURVE as `0x${string}`

    try {
      // approve
      const allowance = await publicClient.readContract({
        address: asset as `0x${string}`,
        abi: erc20Abi,
        functionName: 'allowance',
        args: [address as `0x${string}`, maxFunCurveAddress as `0x${string}`],
      })

      if (allowance < amountIn) {
        const hashApprove = await writeContractAsync({
          address: asset as `0x${string}`,
          abi: erc20Abi,
          functionName: 'approve',
          args: [maxFunCurveAddress as `0x${string}`, amountIn],
        })

        const receiptApprove = await publicClient.waitForTransactionReceipt({
          hash: hashApprove,
        })
        
        if (!receiptApprove || receiptApprove.status !== 'success') {
          setState({
            loading: false,
            success: false,
            error: 'Approve failed',
          })
          console.error('Approve failed')
          return
        }
      }

      // uint256 amountIn,      // 用户想要支付的资产代币数量
      // address tokenAddress,   // MaxFun代币的地址
      // uint256 amountMinOut,  // 期望获得的最小MaxFun代币数量（滑点保护）
      // address asset          // 支付用的资产代币地址（如USDT）
      const hash = await writeContractAsync({
        address: maxFunFactoryAddress,
        abi: MAX_FUN_FACTORY_ABI,
        functionName: 'buy',
        args: [
          amountIn,
          tokenAddress as `0x${string}`,
          amountMinOut,
          asset as `0x${string}`,
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
    onBuy,
    onReset,
  }
}
