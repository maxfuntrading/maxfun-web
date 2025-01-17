
import HotTx from "./components/HotTx";
import Banner from "./components/Banner";
import TokenList from "./components/TokenList";
export default function Home() {
  

  return (
    <div className=" w-full px-4 mdup:px-[3.62rem]">
      <HotTx />
      <div className=" my-container mx-auto">
        <Banner />
        <TokenList />
        <div className="h-[3rem] mdup:h-[5rem]"></div>
      </div>
    </div>
  )
}

