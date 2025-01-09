
import HotTx from "./components/HotTx";
import Banner from "./components/Banner";
import TokenList from "./components/TokenList";
export default function Home() {
  

  return (
    <div className=" w-full">
      <HotTx />
      <Banner />
      <TokenList />
    </div>
  )
}

