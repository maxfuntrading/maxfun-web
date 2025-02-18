import { createChart, IChartApi } from 'lightweight-charts'
import { useEffect, useRef } from 'react'
import clsx from 'clsx'
import { TabType } from '../types/type'
import { fetchKline } from '@/api/token-detila'
import { ERR_CODE } from '@/constants/ERR_CODE'
import { useReadContract } from 'wagmi'
import { VITE_CONTRACT_UNISWAP_V2_FACTORY } from '@/utils/runtime-config'
import { UniswapV2Factory } from '@/constants/abi/UniswapV2Factory'

interface KlineData {
  time: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export default function PriceChart({className, tab, tokenAddress}: {className?: string, tab: TabType, tokenAddress: string}) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)

  useEffect(() => {
    if (!chartContainerRef.current) return

    // 创建图表
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: '#1E222D' },
        textColor: '#DDD',
      },
      grid: {
        vertLines: { color: '#2B2B43' },
        horzLines: { color: '#2B2B43' },
      },
      crosshair: {
        mode: 1,
        vertLine: {
          width: 1,
          color: '#758696',
          style: 1,
        },
        horzLine: {
          width: 1,
          color: '#758696',
          style: 1,
        },
      },
      width: chartContainerRef.current.clientWidth,
    })

    // 创建K线图系列
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    })

    // 添加成交量图
    const volumeSeries = chart.addHistogramSeries({
      color: '#26a69a',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '', // 在单独的面板中显示
    })

    // 示例数据
    const data: KlineData[] = []

    // 设置数据
    candlestickSeries.setData(data as any)
    volumeSeries.setData(data.map(item => ({
      time: item.time,
      value: item.volume,
      color: item.close >= item.open ? '#26a69a' : '#ef5350',
    })) as any)

    // 自适应大小
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
        })
      }
    }

    window.addEventListener('resize', handleResize)
    chartRef.current = chart

    // 清理函数
    return () => {
      window.removeEventListener('resize', handleResize)
      chart.remove()
    }
  }, [tab])

  // // 获取实时数据的示例
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const currentTs = Date.now()
  //       const klineData = await fetchKline(tokenAddress, currentTs, 20)
  //       if (!klineData || klineData.code !== ERR_CODE.SUCCESS) {
  //         return
  //       }

  //       if (!chartRef.current) return

  //       // Sort data by timestamp and remove duplicates
  //       // const data = [{
  //       //   time: Date.now(),
  //       //   open: Math.random() * 100,
  //       //   high: Math.random() * 100,
  //       //   low: Math.random() * 100,
  //       //   close: Math.random() * 100,
  //       //   volume: Math.random() * 1000
  //       // }]

  //       const dataFilter: KlineData[] = klineData.data.list
  //         .map((item) => ({
  //           time: item.open_ts,
  //           open: Number(item.open),
  //           high: Number(item.high),
  //           low: Number(item.low),
  //           close: Number(item.close),
  //           volume: Number(item.volume),
  //         }))
  //         .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
  //         .filter((item, index, self) => 
  //           index === self.findIndex((t) => t.time === item.time)
  //         );

  //       const candlestickSeries = chartRef.current.addCandlestickSeries()
  //       candlestickSeries.setData(dataFilter as any)
  //     } catch (error) {
  //       console.error('Failed to fetch data:', error)
  //     }
  //   }

  //   // 定期更新数据
  //   const interval = setInterval(fetchData, 5000)
  //   return () => clearInterval(interval)
  // }, [tokenAddress])

  // 获取历史数据
  useEffect(() => {
    if (!chartRef.current) return
    if (!tokenAddress) return

    const fetchData = async () => {
      try {
        const currentTs = Date.now()
        const klineData = await fetchKline(tokenAddress, currentTs, 100)
        if (!klineData || klineData.code !== ERR_CODE.SUCCESS) {
          return
        }

        const dataFilter: KlineData[] = klineData.data.list
          .map((item) => ({
            time: item.close_ts,
            open: Number(item.open),
            high: Number(item.high),
            low: Number(item.low),
            close: Number(item.close),
            volume: Number(item.volume),
          }))
          .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
          .filter((item, index, self) => 
            index === self.findIndex((t) => t.time === item.time)
          );

        if (!chartRef.current) return

        const candlestickSeries = chartRef.current.addCandlestickSeries()
        candlestickSeries.setData(dataFilter as any)
      } catch (error) {
        console.error('Failed to fetch data:', error)
      }
    }

    fetchData()
  }, [tokenAddress, tab])

  return (
    <div className={clsx("w-full sm:h-[24rem] mdup:flex-1 rounded-[0.625rem] bg-black-10 overflow-hidden p-4 mdup:px-[1.57rem] mdup:py-[1.4rem]", className)}>
      <div ref={chartContainerRef} className="w-full" />
    </div>
  )
}


export function PriceChartIframe({className, agentToken, raiseTokenAddress}: {className?: string, agentToken: string, raiseTokenAddress: string}) {
  const {data: poolAddress} = useReadContract({
    address: VITE_CONTRACT_UNISWAP_V2_FACTORY as `0x${string}`,
    abi: UniswapV2Factory,
    functionName: 'getPair',
    args: [agentToken as `0x${string}`, raiseTokenAddress as `0x${string}`]
  })
  
  return <div className={clsx("w-full sm:h-[24rem] rounded-[0.625rem] bg-black-10 overflow-hidden p-4  mdup:px-[1.57rem] mdup:py-[1.4rem]", className)}>
    {poolAddress !== undefined && <iframe 
      src={`https://www.geckoterminal.com/base/pools/${poolAddress}?embed=1&info=0&swaps=0`} 
      // src="https://www.geckoterminal.com/base/pools/0xc8862e713776eca8e6958c48d2bdce16b8b8035a?embed=1&info=0&swaps=0" 
      width="100%" 
      height="100%" 
    />}
  </div>
}