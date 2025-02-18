import { RaisedToken } from "@/api/common"
import { MAX_FUN_FACTORY_ABI } from "@/constants/abi/MaxFunFactory"
import { WriteContractState } from "@/types/contract"
import { VITE_CONTRACT_MAX_FUN_FACTORY } from "@/utils/runtime-config"
import { useState } from "react"
import { erc20Abi, parseUnits } from "viem"
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
    assetToken, 
    signature,
    launchFee
  }: {
    id: number, 
    name: string, 
    symbol: string, 
    totalSupply: string,
    raisedTokenAmount: string,
    salesRatio: string,
    reservedRatio: string,
    assetToken: RaisedToken, 
    signature: string,
    launchFee: bigint
  }) => {
    console.log('launch params', [
      id,
      name,
      symbol,
      totalSupply,
      raisedTokenAmount,
      salesRatio,
      reservedRatio,
      assetToken,
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

    const assetAddress = assetToken.address as `0x${string}`
    try {
      // AssetToken.approve(factory, launchFee)
      const allowanceFactory = await publicClient.readContract({
        address: assetAddress,
        abi: erc20Abi,
        functionName: 'allowance',
        args: [address as `0x${string}`, VITE_CONTRACT_MAX_FUN_FACTORY as `0x${string}`],
      })

      console.log('allowanceFactory', allowanceFactory);
      console.log('launchFee', launchFee);
      
      if (allowanceFactory < launchFee) {
        const hashApprove = await writeContractAsync({
          address: assetAddress,
          abi: erc20Abi,
          functionName: 'approve',
          args: [VITE_CONTRACT_MAX_FUN_FACTORY as `0x${string}`, launchFee],
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

      // assetToken.approve(taxVault, launchFee)
      // const allowanceTaxVault = await publicClient.readContract({
      //   address: assetAddress,
      //   abi: erc20Abi,
      //   functionName: 'allowance',
      //   args: [address as `0x${string}`, VITE_CONTRACT_FEE_VAULT as `0x${string}`],
      // })

      // if (allowanceTaxVault < parseUnits('201', 18)) {
      //   const hashApprove = await writeContractAsync({
      //     address: assetAddress,
      //     abi: erc20Abi,
      //     functionName: 'approve',
      //     args: [VITE_CONTRACT_FEE_VAULT as `0x${string}`, amountIn],
      //   })
      //   const receiptApproveTaxVault = await publicClient.waitForTransactionReceipt({
      //     hash: hashApprove,
      //   })
      //   if (!receiptApproveTaxVault || receiptApproveTaxVault.status !== 'success') {
      //     setState({
      //       loading: false,
      //       success: false,
      //       error: 'Approve failed',
      //     })
      //     console.error('Approve failed')
      //     return
      //   }
      // }

      //   uint256 id,
      //   string memory _name,       // token name
      //   string memory _ticker,     // token symbol
      //   uint256 initialSupply,     // total supply
      //   uint256 raisedAssetAmount, // raised asset amount
      //   uint64 salesRatio,
      //   uint64 reservedRatio,
      //   address asset,             // asset address
      //   bytes memory signature     // signature
      console.log('contract launch params', [
        BigInt(id),
        name,
        symbol,
        parseUnits(totalSupply, 18),
        parseUnits(raisedTokenAmount, assetToken.decimal),
        BigInt((Number(salesRatio) * 100).toFixed(0)),
        BigInt((Number(reservedRatio) * 100).toFixed(0)),
        BigInt((Number(1) * 100).toFixed(0)),
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
          parseUnits(totalSupply, 18),
          parseUnits(raisedTokenAmount, assetToken.decimal),
          BigInt((Number(salesRatio) * 100).toFixed(0)),
          BigInt((Number(reservedRatio) * 100).toFixed(0)),
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
