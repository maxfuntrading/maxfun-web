import { createChart, IChartApi } from 'lightweight-charts'
import { useEffect, useRef } from 'react'
import clsx from 'clsx'
import { TabType } from '../types/type'
import { fetchKline } from '@/api/token-detila'
import { ERR_CODE } from '@/constants/ERR_CODE'
import { useReadContract } from 'wagmi'
import { VITE_CONTRACT_UNISWAP_V2_FACTORY } from '@/utils/runtime-config'
import { UniswapV2Factory } from '@/constants/abi/UniswapV2Factory'
import { TokenKlineItemResponse } from '../types/response'

interface KlineData {
  time: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export default function PriceChart({className, tab, tokenAddress, data}: {className?: string, tab: TabType, tokenAddress: string, data: TokenKlineItemResponse[]}) {
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
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        tickMarkFormatter: (time: number) => {
          const date = new Date(time * 1000);
          return date.toLocaleString('en-US', {
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          });
        }
      },
      rightPriceScale: {
        autoScale: true,
        scaleMargins: {
          top: 0.1,
          bottom: 0.01,
        },
      },
    })

    // 创建K线图系列
    const data: KlineData[] = []

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
      priceFormat: {
        type: 'price',
        precision: 10,
        minMove: 0.0000000001,
      },
    })

    // 添加成交量图
    const volumeSeries = chart.addHistogramSeries({
      color: '#26a69a',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '', // 在单独的面板中显示
    })

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

  // get history data
  useEffect(() => {
    if (!chartRef.current) return
    if (!tokenAddress) return

    const fetchData = async () => {
      try {
        let apiData: TokenKlineItemResponse[] = []

        if (data.length > 0) {
          apiData = data
        } else {
          const currentTs = Date.now()
          const klineData = await fetchKline(tokenAddress, currentTs, 100)
          if (!klineData || klineData.code !== ERR_CODE.SUCCESS) {
            return
          }
          apiData = klineData.data.list
        }

        const dataFilter: KlineData[] = apiData
          .map((item) => ({
            time: Number(item.close_ts),
            open: Number(item.open),
            high: Number(item.high),
            low: Number(item.low),
            close: Number(item.close),
            volume: Number(item.volume),
          }))
          .sort((a, b) => a.time - b.time)
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
  }, [tokenAddress, tab, data])

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