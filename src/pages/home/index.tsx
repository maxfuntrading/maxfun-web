import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Home() {
  return (
    <div className=" w-full h-full">
      <div className=" flex justify-between items-center">
        <div className=" font-bold">Logo</div>
        <ConnectButton />
      </div>
    </div>
  )
}
