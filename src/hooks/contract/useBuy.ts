import { MAX_FUN_FACTORY_ABI } from "@/constants/abi/MaxFunFactory"
import { WriteContractState } from "@/types/contract"
import { VITE_CONTRACT_MAX_FUN_CURVE, VITE_CONTRACT_MAX_FUN_FACTORY, VITE_CONTRACT_UNISWAP_V2_ROUTER02 } from "@/utils/runtime-config"
import { useState } from "react"
import { erc20Abi } from "viem"
import { useAccount, usePublicClient, useWriteContract } from "wagmi"
import { UNISWAP_V2_ROUTER02_ABI } from '@/constants/abi/UniswapV2Router02'

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
      isPurchaseToGrad,
      isOnUniswap,
    }: {
      amountIn: bigint, 
      tokenAddress: string, 
      amountMinOut: bigint, 
      asset: string,
      isPurchaseToGrad: boolean,
      isOnUniswap: boolean,
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
    const uniswapRouterAddress = VITE_CONTRACT_UNISWAP_V2_ROUTER02 as `0x${string}`

    try {
      // approve
      const spenderAddress = isOnUniswap ? uniswapRouterAddress : maxFunCurveAddress
      const allowance = await publicClient.readContract({
        address: asset as `0x${string}`,
        abi: erc20Abi,
        functionName: 'allowance',
        args: [address as `0x${string}`, spenderAddress],
      })

      if (allowance < amountIn) {
        const hashApprove = await writeContractAsync({
          address: asset as `0x${string}`,
          abi: erc20Abi,
          functionName: 'approve',
          args: [spenderAddress, amountIn],
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

      // on uniswap
      if (isOnUniswap) {
        const deadline = BigInt(Math.floor(Date.now() / 1000) + 1200) // 20 minutes
        const hashSwap = await writeContractAsync({
          address: uniswapRouterAddress,
          abi: UNISWAP_V2_ROUTER02_ABI,
          functionName: 'swapExactTokensForTokens',
          args: [
            amountIn,
            amountMinOut,
            [asset as `0x${string}`, tokenAddress as `0x${string}`],
            address as `0x${string}`,
            deadline,
          ]
        })

        const receiptSwap = await publicClient.waitForTransactionReceipt({
          hash: hashSwap,
        })

        if (!receiptSwap || receiptSwap.status !== 'success') {
          setState({
            loading: false,
            success: false,
            error: 'Swap failed',
          })
          console.error('Uniswap buy failed')
          return
        }

        setState({
          loading: false,
          success: true,
          tx_hash: hashSwap,
        })
        return;
      }

      // PurchaseToGrad，buy all
      if (isPurchaseToGrad) {
        const hashPurchaseToGrad = await writeContractAsync({
          address: maxFunFactoryAddress,
          abi: MAX_FUN_FACTORY_ABI,
          functionName: 'purchaseToGrad',
          args: [tokenAddress as `0x${string}`]
        })

        const receiptPurchaseToGrad = await publicClient.waitForTransactionReceipt({hash: hashPurchaseToGrad})
        if (!receiptPurchaseToGrad || receiptPurchaseToGrad.status !== 'success') {
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
          tx_hash: hashPurchaseToGrad,
        })

        return;
      }

      // uint256 amountIn,      // pay amount
      // address tokenAddress,   // MaxFun token address
      // uint256 amountMinOut,  // min receive amount
      // address asset          // pay asset address
      console.log('buy params',[
        amountIn,
        tokenAddress as `0x${string}`,
        amountMinOut,
        asset as `0x${string}`,
      ]);
      
      const hash = await writeContractAsync({
        address: maxFunFactoryAddress,
        abi: MAX_FUN_FACTORY_ABI,
        functionName: 'buy',
        args: [
          amountIn,
          tokenAddress as `0x${string}`,
          amountMinOut,
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
