import { RaisedToken } from "@/api/common"
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

  const onLaunch = async ({
    id, 
    name, 
    symbol, 
    totalSupply, 
    raisedTokenAmount, 
    salesRatio, 
    reservedRatio, 
    liquidityPoolRatio, 
    assetToken, 
    signature
  }: {
    id: number, 
    name: string, 
    symbol: string, 
    totalSupply: string,
    raisedTokenAmount: string,
    salesRatio: string,
    reservedRatio: string,
    liquidityPoolRatio: string,
    assetToken: RaisedToken, 
    signature: string
  }) => {
    console.log('launch params', [
      id,
      name,
      symbol,
      totalSupply,
      raisedTokenAmount,
      salesRatio,
      reservedRatio,
      liquidityPoolRatio,
      assetToken,
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

    const assetAddress = assetToken.address as `0x${string}`
    try {
      // 分别对Factory和TaxVault合约Approve 201e18
      // 对Factory合约Approve
      const allowanceFactory = await publicClient.readContract({
        address: assetAddress,
        abi: erc20Abi,
        functionName: 'allowance',
        args: [address as `0x${string}`, VITE_CONTRACT_MAX_FUN_FACTORY as `0x${string}`],
      })

      if (allowanceFactory < parseUnits('201', 18)) {
        const hashApprove = await writeContractAsync({
          address: assetAddress,
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
        address: assetAddress,
        abi: erc20Abi,
        functionName: 'allowance',
        args: [address as `0x${string}`, VITE_CONTRACT_FEE_VAULT as `0x${string}`],
      })

      if (allowanceTaxVault < parseUnits('201', 18)) {
        const hashApprove = await writeContractAsync({
          address: assetAddress,
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

      //   uint256 id,
      //   string memory _name,       // token name
      //   string memory _ticker,     // token symbol
      //   uint256 initialSupply,     // total supply
      //   uint256 raisedAssetAmount, // raised asset amount
      //   uint64 salesRatio,
      //   uint64 reservedRatio,
      //   uint64 migrationTax,
      //   address asset,             // asset address
      //   bytes memory signature     // signature
      console.log('contract launch params', [
        BigInt(id),
        name,
        symbol,
        BigInt(totalSupply),
        parseUnits(raisedTokenAmount, assetToken.decimal),
        BigInt((Number(salesRatio) * 100).toFixed(0)),
        BigInt((Number(reservedRatio) * 100).toFixed(0)),
        BigInt((Number(liquidityPoolRatio) * 100).toFixed(0)),
        assetAddress,
        signature as `0x${string}`,
      ]);
      
      const hash = await writeContractAsync({
        address: VITE_CONTRACT_MAX_FUN_FACTORY,
        abi: MAX_FUN_FACTORY_ABI,
        functionName: 'launch',
        args: [
          BigInt(id),
          name,
          symbol,
          BigInt(totalSupply),
          parseUnits(raisedTokenAmount, assetToken.decimal),
          BigInt((Number(salesRatio) * 100).toFixed(0)),
          BigInt((Number(reservedRatio) * 100).toFixed(0)),
          BigInt((Number(liquidityPoolRatio) * 100).toFixed(0)),
          assetAddress,
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
