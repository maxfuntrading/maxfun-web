import { useState } from "react";
import BaseInfo from "./components/BaseInfo";
import { SubTabType, TabType } from "./type";


export default function TokenDetail() {
  const [tab, setTab] = useState<TabType>(TabType.BuyOreSell)
  const [subTab, setSubTab] = useState<SubTabType>(SubTabType.Comments)

  const tabList = [
    {
      name: TabType.BuyOreSell,
      isActive: tab === TabType.BuyOreSell,
    },
    {
      name: TabType.Chart,
      isActive: tab === TabType.Chart,
    },
  ]

  const subTabList = [
    {
      name: SubTabType.Comments,
      isActive: subTab === SubTabType.Comments,
    },
    {
      name: SubTabType.TradingHistory,
      isActive: subTab === SubTabType.TradingHistory,
    },
  ]

  return (
    <div className=" my-container mx-auto px-4 mdup:px-0 mt-2 pt-2">
      <BaseInfo />

      <div className="flex flex-row justify-start items-center gap-[1.55rem] font-medium mt-[1.74rem]">
        {tabList.map((item, index) => (
          <div key={index} onClick={() => setTab(item.name)} className="relative cursor-pointer flex-center">
            <span className={`${item.isActive ? 'text-red-10' : 'text-white'} transition-all duration-300`}>{item.name}</span>
            <div className={`${item.isActive ? 'bg-red-10 w-full opacity-100' : 'w-0 opacity-0'} absolute bottom-[-0.7rem] h-[0.207rem] transition-all duration-300`}></div>
          </div>
        ))}
      </div>

      <div className="relative flex flex-row justify-start items-center gap-[1.55rem] font-medium mt-[1.74rem]">
        {subTabList.map((item, index) => (
          <div key={index} onClick={() => setSubTab(item.name)} className="relative cursor-pointer flex-center">
            <span className={`${item.isActive ? 'text-red-10' : 'text-white'} transition-all duration-300`}>{item.name}</span>
            <div className={`${item.isActive ? 'bg-red-10 w-full opacity-100' : 'w-0 opacity-0'} absolute bottom-[-0.75rem] h-[0.1875rem] transition-all duration-300`}></div>
          </div>
        ))}
        <div className="absolute bottom-[-0.7rem] w-full h-[0.0625rem] bg-white/10"></div>
      </div>


    </div>
  )
}
