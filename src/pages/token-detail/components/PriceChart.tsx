import { createChart, IChartApi } from 'lightweight-charts'
import { useEffect, useRef } from 'react'
import clsx from 'clsx'
import { TabType } from '../type'

export default function PriceChart({className, tab}: {className?: string, tab: TabType}) {
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
      height: 500,
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
    const data = [
      { time: '2023-01-01', open: 100, high: 105, low: 95, close: 102, volume: 1000 },
      { time: '2023-01-02', open: 102, high: 108, low: 100, close: 105, volume: 1200 },
      { time: '2023-01-03', open: 105, high: 106, low: 98, close: 99, volume: 1100 },
      // ... 更多数据
    ]

    // 设置数据
    candlestickSeries.setData(data)
    volumeSeries.setData(data.map(item => ({
      time: item.time,
      value: item.volume,
      color: item.close >= item.open ? '#26a69a' : '#ef5350',
    })))

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

  // 获取实时数据的示例
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 这里替换成您的API
        // const response = await fetch('your-api-endpoint')
        // const data = await response.json()
        
        // if (chartRef.current) {
        //   // 更新数据
        //   // chartRef.current.candlestickSeries.update(data)
        // }
      } catch (error) {
        console.error('Failed to fetch data:', error)
      }
    }

    // 定期更新数据
    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className={clsx("w-full md:flex-1 rounded-[0.625rem] bg-black-10 overflow-hidden p-4  mdup:px-[1.57rem] mdup:py-[1.4rem]", className)}>
      <div ref={chartContainerRef} className="w-full" />
    </div>
  )
}


export function PriceChartIframe({className}: {className?: string}) {
  return <div className={clsx("w-full sm:h-[24rem] rounded-[0.625rem] bg-black-10 overflow-hidden p-4  mdup:px-[1.57rem] mdup:py-[1.4rem]", className)}>
    <iframe 
      src="https://www.geckoterminal.com/base/pools/0xc8862e713776eca8e6958c48d2bdce16b8b8035a?embed=1&info=0&swaps=0" 
      width="100%" 
      height="100%" 
    />
  </div>
}