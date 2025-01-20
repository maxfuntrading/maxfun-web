import { useContext, useEffect, useMemo, useState } from 'react'
import InputField from './components/InputField'
import TokenButton from './components/TokenButton'
import UploadButton from './components/UploadButton'
import Switch from './components/Switch'
import Select, { SelectOptionType } from '@/components/Select'
import { useAccount } from 'wagmi'
import AppContext from '@/store/app'
import SolidButton from '@/components/button/SolidButton'
import TimePicker from './components/TimePicker'

function isValidUrl(url: string) {
  const urlPattern = /^https?:\/\/.+\..+/
  return urlPattern.test(url)
}

export default function Launcher() {
  const tagsList: SelectOptionType<string>[] = [
    {
      key: 'Ai',
      value: 'Ai',
    },
    {
      key: 'Game',
      value: 'Game',
    },
    {
      key: 'Defi',
      value: 'Defi',
    },
    {
      key: 'Social',
      value: 'Social',
    },
    {
      key: 'DePin',
      value: 'DePin',
    },
    {
      key: 'Others',
      value: 'Others',
    },
  ]

  const raisedTokens = ['MAX', 'ETH', 'USDT', 'USDC']
  const { isConnected } = useAccount()
  const { onConnectWallet } = useContext(AppContext)

  const [iconUrl, setIconUrl] = useState('')
  const [name, setName] = useState('')
  const [symbol, setSymbol] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [twitterUrl, setTwitterUrl] = useState('')
  const [telegramUrl, setTelegramUrl] = useState('')
  const [description, setDescription] = useState('')
  const [totalSupply, setTotalSupply] = useState('0')
  const [raisedAmount, setRaisedAmount] = useState('0')
  const [salesRatio, setSalesRatio] = useState('80')
  const [reservedRatio, setReservedRatio] = useState('0')
  const [liquidityPoolRatio, setLiquidityPoolRatio] = useState('20')
  const [tag, setTag] = useState(tagsList[0])
  const [raisedToken, setRaisedToken] = useState(raisedTokens[0])
  const [raisedTokenPrice, setRaisedTokenPrice] = useState(0)
  const [showExtraOptions, setShowExtraOptions] = useState(true)
  const [startTime, setStartTime] = useState<Date | null>(null)

  const [raisedTokenBalance, setRaisedTokenBalance] = useState(0)

  useEffect(() => {
    // TODO: get total supply from backend
    const totalSupplyNum = 1000000
    setTotalSupply(totalSupplyNum.toString())

    // TODO: get raised amount from backend
    const raisedAmountNum = 10000
    setRaisedAmount(raisedAmountNum.toString())

    // TODO: get raised token balance from backend or from contract
    setRaisedTokenBalance(1000000)
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
    const num = Number(raisedAmount)

    if (num * raisedTokenPrice < 2000) {
      return false
    }

    return true
  }, [raisedAmount, raisedTokenPrice])

  const isRaisedTokenSufficient = useMemo(() => {
    const num = Number(raisedAmount)

    if (raisedTokenBalance < num) {
      return false
    }

    return true
  }, [raisedTokenBalance, raisedAmount])

  const isStartTimeValid = useMemo(() => {
    if (!startTime) {
      return true
    }

    const now = new Date()
    return startTime.getTime() > now.getTime()
  }, [startTime])

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
      isRaisedTokenSufficient &&
      isStartTimeValid
    )
  }, [
    iconUrl,
    name,
    symbol,
    description,
    websiteUrl,
    twitterUrl,
    telegramUrl,
    isTotalSupplyValid,
    isRaisedAmountValid,
    isRaisedTokenSufficient,
    isStartTimeValid,
  ])

  const createToken = () => {
    // TODO: create token
    console.log('>create token', startTime)
  }

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
              <UploadButton onUploaded={(url) => setIconUrl(url)} />
            </div>
          </div>
          <div className="space-y-8 flex flex-col flex-1">
            <InputField
              label="Token Name"
              required
              value={name}
              onChange={setName}
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
          <div className="flex flex-row gap-3 mdup:gap-4 justify-between items-center flex-wrap">
            {raisedTokens.map((token) => (
              <TokenButton
                key={token}
                token={token}
                selected={raisedToken === token}
                onClick={() => setRaisedToken(token)}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-row">
            <label className="text-sm mdup:text-xl font-['Outfit']">Tag</label>
          </div>
          <div className="flex flex-row w-full">
            <Select
              className="!w-full h-[2.75rem] mdup:h-[4.375rem] bg-white/5  border-2 !border-[#FFFFFF1A] focus:border-red-10 text-bold"
              optionPanelClassName="mdup:!top-[4.375rem]"
              defaultOption={tag}
              options={tagsList}
              onSelect={(val) => setTag(val)}
            />
          </div>
        </div>
        <InputField
          label="Website"
          value={websiteUrl}
          onChange={setWebsiteUrl}
          errorInfo={isWebsiteUrlValid ? undefined : 'Invalid URL'}
        />
        <InputField
          label="Twitter"
          value={twitterUrl}
          onChange={setTwitterUrl}
          errorInfo={isTwitterUrlValid ? undefined : 'Invalid URL'}
        />
        <InputField
          label="Telegram"
          value={telegramUrl}
          onChange={setTelegramUrl}
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
                    errorInfo={
                      isRaisedAmountValid
                        ? undefined
                        : 'The minimum amount needs to be greater than $2,000'
                    }
                  />
                </div>
                <div className="flex row items-center mb-3 mdup:mb-6">
                  <img
                    src={`/${raisedToken}.png`}
                    alt=""
                    className="size-4 mdup:size-[1.375rem] mr-1"
                  />
                  <span className="text-sm mdup:text-xl">
                    {raisedToken}(${raisedTokenPrice * Number(raisedAmount)})
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-row gap-8 items-end mdup:w-2/3">
              <div className="flex flex-row items-end w-full gap-2">
                <InputField
                  label="Sales Ratio"
                  type="number"
                  value={salesRatio}
                  onChange={setSalesRatio}
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
                  disabled
                />
                <span className="text-sm mdup:text-xl mb-3 mdup:mb-6">%</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 items-start  border-[#FFFFFF1A] bg-white/5 rounded-[0.625rem] border-2 p-4">
              <div className="text-white/40">
                Intial Price:
                <span className="text-white ml-2">
                  {(Number(totalSupply) / Number(raisedAmount)).toFixed(2)}
                  {raisedToken}
                </span>
              </div>
              <div className="text-white/40">
                The biggest increase before list on PancakeSwap :
                <span className="text-white ml-2">
                  {Number(salesRatio) * 10}%
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-4 items-start">
              <span className="text-sm mdup:text-xl font-['Outfit']">
                Start Time
              </span>
              <TimePicker value={startTime} onChange={setStartTime} />
              {!isStartTimeValid && (
                <span className="text-red-600 text-xs mdup:text-sm -mt-1">
                  Start time must be greater than current time
                </span>
              )}
            </div>
          </>
        )}
        <div className="flex flex-row justify-center mt-2 mb-[1.75rem]">
          <SolidButton
            isDisabled={
              isConnected && (!isRaisedTokenSufficient || !passAllChecks)
            }
            onClick={() => {
              if (isConnected) {
                createToken()
              } else {
                onConnectWallet()
              }
            }}
            className="mdup:!w-[26.875rem] mdup:!h-[3.5rem] !w-full !h-[2.5rem]"
          >
            {isConnected
              ? isRaisedTokenSufficient
                ? 'Launch'
                : 'Insufficient Assets'
              : 'Connect Wallet'}
          </SolidButton>
        </div>
      </div>
    </div>
  )
}
