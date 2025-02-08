import { MAX_FUN_FACTORY_ABI } from "@/constants/abi/MaxFunFactory"
import { WriteContractState } from "@/types/contract"
import { VITE_CONTRACT_FEE_VAULT, VITE_CONTRACT_MAX_FUN_FACTORY } from "@/utils/runtime-config"
import { useState } from "react"
import { erc20Abi, parseEther, parseUnits } from "viem"
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
    const amountIn = parseEther('201')
    
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
      // 分别对Factory和TaxVault合约Approve 201e18
      // 对Factory合约Approve
      const allowanceFactory = await publicClient.readContract({
        address: asset as `0x${string}`,
        abi: erc20Abi,
        functionName: 'allowance',
        args: [address as `0x${string}`, VITE_CONTRACT_MAX_FUN_FACTORY as `0x${string}`],
      })

      if (allowanceFactory < parseUnits('201', 18)) {
        const hashApprove = await writeContractAsync({
          address: asset as `0x${string}`,
          abi: erc20Abi,
          functionName: 'approve',
          args: [VITE_CONTRACT_MAX_FUN_FACTORY as `0x${string}`, amountIn],
        })
        const receiptApproveFactory = await publicClient.waitForTransactionReceipt({
          hash: hashApprove,
        })
        if (!receiptApproveFactory || receiptApproveFactory.status !== 'success') {
          setState({
            loading: false,
            success: false,
            error: 'Approve failed',
          })
          console.error('Approve failed')
          return
        }
      }

      // 对TaxVault合约Approve
      const allowanceTaxVault = await publicClient.readContract({
        address: asset as `0x${string}`,
        abi: erc20Abi,
        functionName: 'allowance',
        args: [address as `0x${string}`, VITE_CONTRACT_FEE_VAULT as `0x${string}`],
      })

      if (allowanceTaxVault < parseUnits('201', 18)) {
        const hashApprove = await writeContractAsync({
          address: asset as `0x${string}`,
          abi: erc20Abi,
          functionName: 'approve',
          args: [VITE_CONTRACT_FEE_VAULT as `0x${string}`, amountIn],
        })
        const receiptApproveTaxVault = await publicClient.waitForTransactionReceipt({
          hash: hashApprove,
        })
        if (!receiptApproveTaxVault || receiptApproveTaxVault.status !== 'success') {
          setState({
            loading: false,
            success: false,
            error: 'Approve failed',
          })
          console.error('Approve failed')
          return
        }
      }

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
          BigInt(id),
          name,
          symbol,
          // amount,
          // BigInt(201e18),
          amountIn,
          asset as `0x${string}`,
          signature as `0x${string}`,
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
