import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import InputField from './components/InputField'
import TokenButton from './components/TokenButton'
import UploadButton, { UploadButtonRef } from './components/UploadButton'
import Switch from './components/Switch'
import Select, { SelectOptionType } from '@/components/Select'
import { useAccount } from 'wagmi'
import AppContext from '@/store/app'
import SolidButton from '@/components/button/SolidButton'
// import TimePicker from './components/TimePicker'
import useLaunch from '@/hooks/contract/useLaunch'
import { toastError, toastSuccess } from '@/components/toast'
import { fetchRaisedToken, fetchTag, fetchUploadTokenIcon, RaisedToken } from '@/api/common'
import { ERR_CODE } from '@/constants/ERR_CODE'
import { fetchLaunchToken, LaunchTokenParams } from '@/api/launch'
import { VITE_IMG_HOST } from '@/utils/runtime-config'
import LoadingMore from '@/components/LoadingMore'
import Big from 'big.js'

function isValidUrl(url: string) {
  const urlPattern = /^https?:\/\/.+\..+/
  return urlPattern.test(url)
}

const RaisedTokenTotalPrice = 2000; // 最低筹集要求价值$2000的Raised Token代币
enum LaunchButtonText {
  Launch = 'Launch',
  InsufficientAssets = 'Insufficient Assets',
}

const MIGRATION_TAX = 0; // 发射时收取的手续费比例

export default function Launcher() {
  const { isConnected } = useAccount()
  const { state: { isLogin }, onConnectWallet } = useContext(AppContext)
  const uploadButtonRef = useRef<UploadButtonRef>(null)

  const [iconUrl, setIconUrl] = useState('')
  const [name, setName] = useState('')
  const [symbol, setSymbol] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [twitterUrl, setTwitterUrl] = useState('')
  const [telegramUrl, setTelegramUrl] = useState('')
  const [description, setDescription] = useState('')
  const [totalSupply, setTotalSupply] = useState('10000000')
  const [raisedAmount, setRaisedAmount] = useState('0')
  const [salesRatio, setSalesRatio] = useState('80')
  const [reservedRatio, setReservedRatio] = useState('0')
  const [liquidityPoolRatio, setLiquidityPoolRatio] = useState('20')
  
  const [raisedTokenPrice, setRaisedTokenPrice] = useState<number>()
  const [showExtraOptions, setShowExtraOptions] = useState(false)
  // const [startTime, setStartTime] = useState<Date | null>(null)
  // const [raisedTokenBalance, setRaisedTokenBalance] = useState(0)
  const [launchButtonText, ] = useState(LaunchButtonText.Launch)

  // fetch data
  const [tags, setTags] = useState<SelectOptionType<string>[]>([])
  const [tag, setTag] = useState<SelectOptionType<string>>()
  const [raisedTokens, setRaisedTokens] = useState<RaisedToken[]>([])
  const [raisedToken, setRaisedToken] = useState<RaisedToken>()
  const [isLoadingGetSignature, setIsLoadingGetSignature] = useState(false)

  // write contract
  const { onLaunch, state: launchState, onReset: onResetLaunch } = useLaunch()
  const isLoadingLaunch = launchState.loading || isLoadingGetSignature

  // 内盘开启时的价格
  const initialYprice = useMemo(() => {
    if (!raisedAmount || !liquidityPoolRatio || !salesRatio || !totalSupply) {
      return undefined
    }

    const r = Number(raisedAmount)                  // 需要筹集的平台币数量
    const l = Number(liquidityPoolRatio) / 100      // 流动性池占比  
    const s = Number(salesRatio) / 100              // 销售占比
    const t = Number(totalSupply)                   // meme币总量
    const m = MIGRATION_TAX                         // 发射时收取的手续费比例

    // 1 Meme=\frac{R⋅L} {(1−M)⋅S^2⋅T} raised
    const price = (r * l) / ((1 -m) * Math.pow(s, 2) * t)

    return price
  }, [raisedAmount, liquidityPoolRatio, salesRatio, totalSupply])
  
  // 外盘开启时的价格
  const initialYUniswapPrice = useMemo(() => {
    if (!raisedAmount || !liquidityPoolRatio || !totalSupply) {
      return undefined
    }

    const r = Number(raisedAmount)                  // 需要筹集的平台币数量
    const l = Number(liquidityPoolRatio) / 100      // 流动性池占比  
    const t = Number(totalSupply)                   // meme币总量
    const m = MIGRATION_TAX                         // 发射时收取的手续费比例

    // \frac{X}{Y}=\frac{R⋅(1−M)}{T⋅L}
    const priceUniswap = (r * (1 - m)) / (t * l);
    return priceUniswap
  }, [liquidityPoolRatio, raisedAmount, totalSupply])

  // 外盘开启时的价格涨幅
  const priceIncrease = useMemo(() => {
    if (!initialYUniswapPrice || !initialYprice) {
      return undefined
    }

    const increase = initialYUniswapPrice / initialYprice
    return increase
  }, [initialYUniswapPrice, initialYprice])

  useEffect(() => {
    // TODO: get total supply from backend
    const totalSupplyNum = 10000000000
    setTotalSupply(totalSupplyNum.toString())

    // TODO: get raised amount from backend
    const raisedAmountNum = 10000
    setRaisedAmount(raisedAmountNum.toString())

    // TODO: get raised token balance from backend or from contract
    // setRaisedTokenBalance(1000000)
  }, [])

  useEffect(() => {
    // TODO: get max token price from backend
    setRaisedTokenPrice(1)
  }, [raisedToken])

  useEffect(() => {
    const salesRatioNum = Number(salesRatio)
    const reservedRatioNum = Number(reservedRatio)

    if (salesRatioNum + reservedRatioNum <= 100) {
      setLiquidityPoolRatio((100 - salesRatioNum - reservedRatioNum).toString())
    }
  }, [salesRatio, reservedRatio])

  // get tag/raised token
  useEffect(() => {
    if (raisedToken || tag) {
      return
    }

    const getBaseInfo = async () => {
      const [tagRes, raisedTokenRes] = await Promise.all([
        fetchTag(),
        fetchRaisedToken()
      ])
      if (tagRes.code !== ERR_CODE.SUCCESS || raisedTokenRes.code !== ERR_CODE.SUCCESS) {
        return
      }
      const tagList = tagRes.data.list.map((tag) => ({
        key: `${tag.sort}`,
        value: tag.name,
      }))
      setTags(tagList)
      setTag(tagList[0])
      setRaisedTokens(raisedTokenRes.data.list)
      setRaisedToken(raisedTokenRes.data.list[0])
      setRaisedTokenPrice(Number(raisedTokenRes.data.list[0].price))

      // 计算初始平台token数量
      setRaisedAmount((Math.ceil(RaisedTokenTotalPrice / Number(raisedTokenRes.data.list[0].price))).toString())
    }
    getBaseInfo()
  }, [raisedToken, tag])

  const isTokenNameValid = useMemo(() => {
    const trimmedName = name.trim()

    if (trimmedName.length > 0 && trimmedName.length > 20) {
      return false
    }

    return true
  }, [name])

  const isTokenSymbolValid = useMemo(() => {
    const trimmedSymbol = symbol.trim()

    if (trimmedSymbol.length > 0 && trimmedSymbol.length > 10) {
      return false
    }

    return true
  }, [symbol])

  const isDescriptionValid = useMemo(() => {
    if (description.length > 0 && description.length > 256) {
      return false
    }

    return true
  }, [description])

  const isWebsiteUrlValid = useMemo(() => {
    if (websiteUrl.length > 0 && !isValidUrl(websiteUrl)) {
      return false
    }

    return true
  }, [websiteUrl])

  const isTwitterUrlValid = useMemo(() => {
    if (twitterUrl.length > 0 && !isValidUrl(twitterUrl)) {
      return false
    }

    return true
  }, [twitterUrl])

  const isTelegramUrlValid = useMemo(() => {
    if (telegramUrl.length > 0 && !isValidUrl(telegramUrl)) {
      return false
    }

    return true
  }, [telegramUrl])

  const isTotalSupplyValid = useMemo(() => {
    const num = Number(totalSupply)

    if (num < 1000000) {
      return false
    }

    return true
  }, [totalSupply])

  const isRaisedAmountValid = useMemo(() => {
    if (raisedTokenPrice === undefined) {
      return false
    }

    if (!raisedAmount) {
      return false
    }

    const num = Number(raisedAmount)

    if (num * raisedTokenPrice < 2000) {
      return false
    }

    return true
  }, [raisedAmount, raisedTokenPrice])

  const isRaisedTokenSufficient = useMemo(() => {
    // const num = Number(raisedAmount)

    // if (raisedTokenBalance < num) {
    //   return false
    // }

    return true
  }, [])

  // const isStartTimeValid = useMemo(() => {
  //   if (!startTime) {
  //     return true
  //   }

  //   const now = new Date()
  //   return startTime.getTime() > now.getTime()
  // }, [startTime])

  const passAllChecks = useMemo(() => {
    if (iconUrl === '' || name === '' || symbol === '' || description === '') {
      return false
    }

    return (
      isTokenNameValid &&
      isTokenSymbolValid &&
      isDescriptionValid &&
      isWebsiteUrlValid &&
      isTwitterUrlValid &&
      isTelegramUrlValid &&
      isTotalSupplyValid &&
      isRaisedAmountValid &&
      isRaisedTokenSufficient
    )
  }, [iconUrl, name, symbol, description, isTokenNameValid, isTokenSymbolValid, isDescriptionValid, isWebsiteUrlValid, isTwitterUrlValid, isTelegramUrlValid, isTotalSupplyValid, isRaisedAmountValid, isRaisedTokenSufficient])

  const onUploadIcon = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetchUploadTokenIcon(formData)
    if (!res || res.code !== ERR_CODE.SUCCESS) {
      return
    }
    setIconUrl(res.data.url)
  }

  const onResetForm = () => {
    setIconUrl('')
    uploadButtonRef.current?.reset()
    setName('')
    setSymbol('')
    setDescription('')
    setWebsiteUrl('')
    setTwitterUrl('')
    setTelegramUrl('')
    setTotalSupply('10000000')
    setRaisedAmount('0')
    setSalesRatio('80')
    setReservedRatio('0')
    setLiquidityPoolRatio('20')
    setRaisedToken(raisedTokens[0])
    setRaisedTokenPrice(Number(raisedTokens[0].price))
    setTag(tags[0])
    setShowExtraOptions(false)
    setIsLoadingGetSignature(false)
  }

  const isCanLaunch = useMemo(() => {
    if (!isLogin || isLoadingLaunch || !passAllChecks) {
      return false
    }

    return true;
  }, [isLoadingLaunch, isLogin, passAllChecks])
  console.log('isCanLaunch', isCanLaunch)
  

  const createToken = async () => {
    if (!isConnected || launchState.loading || isLoadingGetSignature || !raisedToken || !tag) {
      return
    }

    // 从后端请求签名
    setIsLoadingGetSignature(true)
    const launchTokenParams: LaunchTokenParams = {
      name: name,
      icon: iconUrl.replace(VITE_IMG_HOST, ''),
      symbol: symbol,
      description: description,
      raised_token: raisedToken.address,
      tag: tag.value,
      website: websiteUrl,
      twitter: twitterUrl,
      telegram: telegramUrl,
      total_supply: Number(totalSupply),
      raised_amount: Number(raisedAmount),
      sale_ratio: Number(salesRatio),
      reserved_ratio: Number(reservedRatio),
      pool_ratio: Number(liquidityPoolRatio),
      // launch_ts: dayjs(startTime).unix()
    }
    
    if (websiteUrl.length === 0) {
      delete launchTokenParams.website
    }
    if (twitterUrl.length === 0) {
      delete launchTokenParams.twitter
    }
    if (telegramUrl.length === 0) {
      delete launchTokenParams.telegram
    }

    const launchTokenRes = await fetchLaunchToken(launchTokenParams).finally(() => {
      setIsLoadingGetSignature(false)
    })
    if (!launchTokenRes || launchTokenRes.code !== ERR_CODE.SUCCESS) {
      return
    }
    
    const id = launchTokenRes.data.id
    const signature = launchTokenRes.data.signature

    // 调用合约lanch方法
    onLaunch({
      id: Number(id), 
      name, 
      symbol, 
      amount: BigInt(raisedAmount), 
      asset: raisedToken.address, 
      signature
    })
  }

  useEffect(() => {
    if (launchState.success) {
      onResetLaunch()
      toastSuccess('Successful launch')
      onResetForm()
    }

    if (launchState.error) {
      onResetLaunch()
      if (launchState.error.includes('user rejected action')) {
        toastError('Cancel Approve')
      } else {
        toastError('Launch failed')
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [launchState.success, launchState.error, onResetLaunch])

  return (
    <div className="w-full bg-[#141516] flex flex-col items-center py-8 px-4 relative">
      <h1 className="font-semibold text-[1.5rem] w-[12.5rem] mdup:w-auto mdup:text-[2.5rem] font-['Otomanopee One'] mb-12 bg-gradient-to-r from-white to-red-10 text-transparent bg-clip-text text-center">
        Launch your token on XX
      </h1>
      <div className="w-full mdup:w-[56.25rem] m-2 bg-[#2b2c2d]/50 rounded-[1.25rem] p-4 mdup:p-10 flex flex-col gap-8">
        <div className="flex w-full flex-col mdup:flex-row gap-8">
          <div className="space-y-2 ">
            <label className="text-sm mdup:text-xl font-['Outfit']">
              Token Icon <span className="text-red-10">*</span>
            </label>
            <div className="flex flex-row w-full justify-center mdup:justify-start">
              <UploadButton 
                ref={uploadButtonRef}
                onUpload={(file) => onUploadIcon(file)}
                isDisabled={isLoadingLaunch}
              />
            </div>
          </div>
          <div className="space-y-8 flex flex-col flex-1">
            <InputField
              label="Token Name"
              required
              value={name}
              onChange={setName}
              disabled={isLoadingLaunch}
              errorInfo={
                isTokenNameValid
                  ? undefined
                  : 'String must contain at most 20 characters'
              }
            />
            <InputField
              label="Token Symbol"
              required
              value={symbol}
              onChange={setSymbol}
              disabled={isLoadingLaunch}
              errorInfo={
                isTokenSymbolValid
                  ? undefined
                  : 'String must contain at most 10 characters'
              }
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-row justify-between">
            <label className="mdup:text-xl font-['Outfit']">
              Description <span className="text-red-10">*</span>
            </label>
            <span className="text-[#aaabab] mdup:text-xl font-['Outfit']">
              {description.length}/256
            </span>
          </div>
          <textarea
            rows={6}
            onChange={(e) => {
              if (e.target.value.length <= 256) {
                setDescription(e.target.value)
              }
            }}
            value={description}
            disabled={isLoadingLaunch}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
              }
            }}
            className="w-full bg-white/5 rounded-[0.625rem] border-2 border-[#FFFFFF1A] focus:border-red-10 text-white text-sm mdup:text-xl px-4 outline-none p-3"
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-row justify-between">
            <label className="text-sm mdup:text-xl font-['Outfit']">
              Raised Token
            </label>
          </div>
          <div className={`flex flex-row gap-3 mdup:gap-4 items-center flex-wrap ${raisedTokens.length >= 4 ? 'justify-between' : 'justify-start'}`}>
            {raisedTokens.map((token) => (
              <TokenButton
                key={token.address}
                token={token}
                selected={raisedToken?.address === token.address}
                onClick={() => {
                  if (isLoadingLaunch) {
                    return
                  }
                  setRaisedToken(token)
                  setRaisedTokenPrice(Number(token.price))
                  setRaisedAmount((Math.ceil(RaisedTokenTotalPrice / Number(token.price))).toString())
                }}
              />
            ))}
          </div>
        </div>
        {tag && <div className="flex flex-col gap-2">
          <div className="flex flex-row">
            <label className="text-sm mdup:text-xl font-['Outfit']">Tag</label>
          </div>
          <div className="flex flex-row w-full">
            <Select
              className="!w-full h-[2.75rem] mdup:h-[4.375rem] bg-white/5  border-2 !border-[#FFFFFF1A] focus:border-red-10 text-bold"
              optionPanelClassName="mdup:!top-[4.375rem]"
              defaultOption={tag}
              options={tags}
              isDisabled={isLoadingLaunch}
              onSelect={(val) => setTag(val)}
            />
          </div>
        </div>}
        <InputField
          label="Website"
          value={websiteUrl}
          onChange={setWebsiteUrl}
          disabled={isLoadingLaunch}
          errorInfo={isWebsiteUrlValid ? undefined : 'Invalid URL'}
        />
        <InputField
          label="Twitter"
          value={twitterUrl}
          onChange={setTwitterUrl}
          disabled={isLoadingLaunch}
          errorInfo={isTwitterUrlValid ? undefined : 'Invalid URL'}
        />
        <InputField
          label="Telegram"
          value={telegramUrl}
          onChange={setTelegramUrl}
          disabled={isLoadingLaunch}
          errorInfo={isTelegramUrlValid ? undefined : 'Invalid URL'}
        />
        <Switch
          checked={showExtraOptions}
          onChange={setShowExtraOptions}
          label="Extra Options"
        />
        {showExtraOptions && (
          <>
            <div className="flex flex-col gap-[0.625rem]">
              <InputField
                label="Total supply"
                type="number"
                value={totalSupply}
                onChange={setTotalSupply}
                disabled={isLoadingLaunch}
                errorInfo={
                  isTotalSupplyValid
                    ? undefined
                    : 'The minimum amount needs to be greater than 1,000,000'
                }
              />
            </div>

            <div className="flex flex-col gap-[0.625rem]">
              <div className="flex flex-row gap-2 items-end justify-between w-full">
                <div className="flex-1">
                  <InputField
                    label="Raised Amount"
                    type="number"
                    value={raisedAmount}
                    onChange={setRaisedAmount}
                    disabled={isLoadingLaunch}
                    errorInfo={
                      isRaisedAmountValid
                        ? undefined
                        : 'The minimum amount needs to be greater than $2,000'
                    }
                  />
                </div>
                <div className="flex row items-center mb-3 mdup:mb-6">
                  <img
                    src={raisedToken?.icon}
                    alt=""
                    className="size-4 mdup:size-[1.375rem] mr-1"
                  />
                  <span className="text-sm mdup:text-xl">
                    {raisedToken?.symbol}(${raisedTokenPrice && raisedTokenPrice * Number(raisedAmount)})
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-row gap-8 items-end mdup:w-4/5">
              <div className="flex flex-row items-end w-full gap-2">
                <InputField
                  label="Sales Ratio"
                  type="number"
                  value={salesRatio}
                  onChange={setSalesRatio}
                  disabled={isLoadingLaunch}
                  onBlur={() => {
                    const num = Number(salesRatio)

                    if (num > 100) {
                      setSalesRatio('100')
                    }

                    if (num < 60) {
                      setSalesRatio('60')
                    }
                  }}
                />
                <span className="text-sm mdup:text-xl mb-3 mdup:mb-6">%</span>
              </div>
              <div className="flex flex-row items-end w-full gap-2">
                <InputField
                  label="Reserved Ratio"
                  type="number"
                  value={reservedRatio}
                  onChange={setReservedRatio}
                  disabled={isLoadingLaunch}
                  onBlur={() => {
                    const num = Number(reservedRatio)

                    if (num > 40) {
                      setReservedRatio('40')
                    }

                    if (num < 0) {
                      setReservedRatio('0')
                    }
                  }}
                />
                <span className="text-sm mdup:text-xl mb-3 mdup:mb-6">%</span>
              </div>
              <div className="flex flex-row items-end w-full gap-2">
                <InputField
                  label="Liquidity Pool Ratio"
                  type="number"
                  value={liquidityPoolRatio}
                  onChange={setLiquidityPoolRatio}
                  disabled={true}
                  inputClassName="!text-[#FFFFFF4C]"
                />
                <span className="text-sm mdup:text-xl mb-3 mdup:mb-6">%</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 items-start  border-[#FFFFFF1A] bg-white/5 rounded-[0.625rem] border-2 p-4">
              <div className="text-white/40">
                Intial Price:
                {raisedToken && initialYprice && <span className="text-white ml-2">
                  {Big(initialYprice.toFixed(raisedToken.decimal)).toFixed()}
                  {raisedToken.symbol}
                </span>}
              </div>
              <div className="text-white/40">
                The biggest increase before list on PancakeSwap :
                {priceIncrease && <span className="text-white ml-2">
                  {Big(priceIncrease * 100).toFixed(0)}%
                </span>}
              </div>
            </div>
            {/* <div className="flex flex-col gap-4 items-start">
              <span className="text-sm mdup:text-xl font-['Outfit']">
                Start Time
              </span>
              <TimePicker value={startTime} onChange={setStartTime} />
              {!isStartTimeValid && (
                <span className="text-red-600 text-xs mdup:text-sm -mt-1">
                  Start time must be greater than current time
                </span>
              )}
            </div> */}
          </>
        )}
        <div className="flex flex-row justify-center mt-2 mb-[1.75rem]">
          {!isConnected && <SolidButton
            onClick={() => {
              onConnectWallet()
            }}
            className="mdup:!w-[26.875rem] mdup:!h-[3.5rem] !w-full !h-[2.5rem]"
          >
            Connect Wallet
          </SolidButton>}

          {isConnected && <SolidButton
            isDisabled={
              !isCanLaunch
            }
            onClick={() => {
              createToken()
            }}
            className="mdup:!w-[26.875rem] mdup:!h-[3.5rem] !w-full !h-[2.5rem]"
          >
            {isLoadingLaunch && <LoadingMore isDark={true} />}
            {!isLoadingLaunch && launchButtonText}
          </SolidButton>}
        </div>
      </div>
    </div>
  )
}
