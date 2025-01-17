import { useState } from 'react'
import InputField from './components/InputField'
import { Select } from '@chakra-ui/react'
import BnbIcon from '@/assets/images/launcher/bnb.svg'
import { Token } from './typs'
import TokenButton from './components/TokenButton'
import UploadButton from './components/UploadButton'
import Switch from './components/Switch'

function formatDateTime(date: Date) {
  return date.toISOString().slice(0, 19)
}

export default function Launcher() {
  const [iconUrl, setIconUrl] = useState('')
  const [name, setName] = useState('')
  const [symbol, setSymbol] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [twitterUrl, setTwitterUrl] = useState('')
  const [telegramUrl, setTelegramUrl] = useState('')
  const [description, setDescription] = useState('')
  const [totalSupply, setTotalSupply] = useState('')
  const [raisedAmount, setRaisedAmount] = useState('')
  const [salesRatio, setSalesRatio] = useState('')
  const [reservedRatio, setReservedRatio] = useState('')
  const [marketingRatio, setMarketingRatio] = useState('')
  const [maxPerUser, setMaxPerUser] = useState('')
  const [extraOptions, setExtraOptions] = useState(false)
  const [raisedToken, setRaisedToken] = useState(Token.MAX)
  const [currentDateTime, setCurrentDateTime] = useState(
    formatDateTime(new Date())
  )

  const handleUploaded = (url: string) => {
    setIconUrl(url)
  }

  return (
    <div className="w-full min-h-screen bg-[#141516] flex flex-col items-center py-8 px-4">
      <h1 className="font-semibold text-[1.5rem] w-[12.5rem] mdup:w-auto mdup:text-[2.5rem] font-['Otomanopee One'] mb-12 bg-gradient-to-r from-white to-red-10 text-transparent bg-clip-text text-center">
        Launch your token on XX
      </h1>
      <div className="w-full mdup:w-[56.25rem] m-2 bg-[#2b2c2d]/50 rounded-[1.25rem] p-4 flex flex-col gap-8">
        <div className="flex w-full flex-col mdup:flex-row gap-8">
          <div className="space-y-2 ">
            <label className="text-base mdup:text-xl font-['Outfit']">
              Token Icon <span className="text-red-10">*</span>
            </label>
            <div className="flex flex-row w-full justify-center mdup:justify-start">
              <UploadButton onUploaded={(url) => setIconUrl(url)} />
            </div>
          </div>
          <div className="space-y-8 flex flex-col flex-1">
            <InputField
              label="Token Name"
              placeholder="Enter name"
              required
              value={name}
              onChange={setName}
            />
            <InputField
              label="Token Symbol"
              placeholder="Enter symbol"
              required
              value={symbol}
              onChange={setSymbol}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-row justify-between">
            <label className="mdup:text-xl font-['Outfit']">
              Description <span className="text-red-10">*</span>
            </label>
            <span className="text-[#aaabab] mdup:text-xl font-['Outfit']">
              0/256
            </span>
          </div>
          <textarea
            rows={6}
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            className="w-full bg-white/5 rounded-[10px] border-2 border-[#FFFFFF1A] focus:border-red-10 text-white text-sm mdup:text-xl px-4 outline-none p-3"
          ></textarea>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-row justify-between">
            <label className="mdup:text-xl font-['Outfit']">Raised Token</label>
          </div>
          <div className="flex flex-row gap-3 mdup:gap-4 justify-between items-center flex-wrap">
            <TokenButton
              token={Token.MAX}
              selected={raisedToken === Token.MAX}
              onClick={() => setRaisedToken(Token.MAX)}
            />
            <TokenButton
              token={Token.ETH}
              selected={raisedToken === Token.ETH}
              onClick={() => setRaisedToken(Token.ETH)}
            />
            <TokenButton
              token={Token.USDT}
              selected={raisedToken === Token.USDT}
              onClick={() => setRaisedToken(Token.USDT)}
            />
            <TokenButton
              token={Token.USDC}
              selected={raisedToken === Token.USDC}
              onClick={() => setRaisedToken(Token.USDC)}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-row justify-between">
            <label className="mdup:text-xl font-['Outfit']">Tag</label>
          </div>
          <Select
            placeholder="Select Tag"
            bg="whiteAlpha.50"
            border="2px solid rgba(255, 255, 255, 0.1)"
            _hover={{ borderColor: 'primary.500' }}
            _focus={{ borderColor: 'primary.500' }}
            color="white"
            fontSize="xl"
            height="70px"
            zIndex={0}
            className="mdup:text-xl"
          >
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option>
          </Select>
        </div>
        <InputField
          label="Website"
          placeholder="Enter website"
          value={websiteUrl}
          onChange={setWebsiteUrl}
        />
        <InputField
          label="Twitter"
          placeholder="Enter twitter"
          value={twitterUrl}
          onChange={setTwitterUrl}
        />
        <InputField
          label="Telegram"
          placeholder="Enter telegram"
          value={telegramUrl}
          onChange={setTelegramUrl}
        />
        <Switch
          checked={extraOptions}
          onChange={setExtraOptions}
          label="Extra Options"
        />
        <div className="flex flex-col gap-1">
          <InputField
            label="Total supply"
            placeholder="Enter total supply"
            value={totalSupply}
            onChange={setTotalSupply}
          />
          <span className="text-m text-white/40">
            The minimum amount needs to be greater than 1,000,000
          </span>
        </div>
        <div className="flex flex-row gap-2 items-end justify-between w-full">
          <div className="flex-1">
            <InputField
              label="Raised Amount"
              placeholder="Enter raised amount"
              value={raisedAmount}
              onChange={setRaisedAmount}
            />
          </div>
          <div className="flex row items-center mb-3 mdup:mb-6">
            <img
              src={BnbIcon}
              alt=""
              className="size-4 mdup:size-[1.375rem] mr-1"
            />
            <span className="text-sm mdup:text-xl">BNB($122222222)</span>
          </div>
        </div>
        <div className="flex flex-row gap-8 items-end mdup:w-2/3">
          <InputField
            label="Sales Ratio"
            placeholder="Enter sales ratio"
            value={salesRatio}
            onChange={setSalesRatio}
          />
          <InputField
            label="Reserved Ratio"
            placeholder="Enter reserved ratio"
            value={reservedRatio}
            onChange={setReservedRatio}
          />
          <InputField
            label="Marketing Ratio"
            placeholder="Enter marketing ratio"
            value={marketingRatio}
            onChange={setMarketingRatio}
          />
        </div>
        <div className="flex flex-col gap-2 items-start  border-[#FFFFFF1A] bg-white/5 rounded-[10px] border-2 p-4">
          <div className="text-white/40">
            Intial Price:<span className="text-white ml-2">0.00007BNB</span>
          </div>
          <div className="text-white/40">
            The biggest increase before list on PancakeSwap :
            <span className="text-white ml-2">+1,436.64%</span>
          </div>
        </div>
        <div className="flex flex-col gap-4 items-start">
          <span>V3LP Trading Fee</span>
          <div className="flex flex-row gap-4">
            <span className="border-[#FFFFFF1A] bg-white/5 rounded-[10px] border-2 p-4 w-24 text-center">
              0.25%
            </span>
            <div className="border-[#FFFFFF1A] bg-white/5 rounded-[10px] border-2 p-4 w-24 text-center">
              0.1%
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 items-start">
          <span>Start Time</span>
          <input
            type="datetime-local"
            className="h-[2.75rem] mdup:h-[4.375rem] rounded-md p-4 w-full border-2 border-[#FFFFFF1A]"
            step="1"
            defaultValue={formatDateTime(new Date())}
            onChange={(e) => setCurrentDateTime(e.target.value)}
            style={{
              WebkitAppearance: 'none',
              maxWidth: '100%',
              minHeight: '2.75rem',
              fontSize: '1rem',
              backgroundColor: '#FFFFFF0D',
            }}
          ></input>
        </div>
        <div className="flex flex-row gap-2 items-end">
          <div className="w-1/2 mdup:w-1/3">
            <InputField
              label="Maximum per user"
              placeholder="Enter number"
              value={maxPerUser}
              onChange={setMaxPerUser}
            />
          </div>
          <div className="mb-3 mdup:mb-6 ml-4 flex flex-row gap-2 items-center">
            <img src={BnbIcon} alt="" className="size-4 mdup:size-[1.375rem]" />
            <span className="text-white mdup:text-xl text-sm">BNB</span>
          </div>
        </div>
        <div className="flex justify-center my-8">
          <button className="w-[26.875rem] h-14 bg-red-10 rounded-[0.625rem] text-white font-medium shadow-[inset_0px_0px_20px_0px_rgba(236,62,111,0.5)]">
            Connect Wallet
          </button>
        </div>
      </div>
    </div>
  )
}
