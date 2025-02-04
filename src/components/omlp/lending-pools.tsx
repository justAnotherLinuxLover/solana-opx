'use client'

import { Button } from '../ui/button'
import { RefreshCw, DollarSign, Coins } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

type Pool = {
  token: string
  supply: number
  supplyApy: number
  borrowed: number
  borrowApy: number
  utilization: number
  supplyLimit: number
  tokenPrice: number
}

const mockPools: Pool[] = [
  {
    token: 'SOL',
    supply: 892451,
    supplyApy: 15.83,
    borrowed: 723164,
    borrowApy: 21.94,
    utilization: ((723164 / 892451) * 100),
    supplyLimit: 1000000,
    tokenPrice: 95.42
  },
  {
    token: 'LABS',
    supply: 156732,
    supplyApy: 28.64,
    borrowed: 42891,
    borrowApy: 35.17,
    utilization: ((42891 / 156732) * 100),
    supplyLimit: 200000,
    tokenPrice: 1.23
  }
]

export function LendingPools() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showUSD, setShowUSD] = useState(true)
  
  const tvl = mockPools.reduce((acc, pool) => {
    const poolValueUSD = pool.supply * pool.tokenPrice
    return acc + poolValueUSD
  }, 0)

  const calculateUtilization = (borrowed: number, supply: number) => {
    return ((borrowed / supply) * 100).toFixed(2)
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const formatValue = (value: number, tokenPrice: number, token: string) => {
    if (showUSD) {
      return `$${Math.round(value * tokenPrice).toLocaleString()}`
    }
    return `${Math.round(value).toLocaleString()} ${token}`
  }

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow">
      <div className="flex items-center justify-between p-4">
        <h2 className="text-lg font-semibold">Option Margin Liquidity Pool</h2>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "flex items-center gap-2 border border-gray-800 hover:border-gray-600 transition-all",
              "hover:bg-gray-800/50"
            )}
            onClick={() => setShowUSD(!showUSD)}
          >
            {showUSD ? (
              <>
                <DollarSign className="h-4 w-4" />
                <span>USD</span>
              </>
            ) : (
              <>
                <Coins className="h-4 w-4" />
                <span>Tokens</span>
              </>
            )}
          </Button>
          <span className="text-sm" style={{ color: '#4a85ff' }}>
            TVL: ${Math.round(tvl).toLocaleString()}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 p-0"
            onClick={handleRefresh}
          >
            <RefreshCw
              className={cn(
                'h-4 w-4 text-muted-foreground',
                isRefreshing && 'animate-spin'
              )}
            />
          </Button>
        </div>
      </div>
      
      <div className="border-t">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left p-4">Pool</th>
              <th className="text-right p-4">Supply</th>
              <th className="text-right p-4">Supply APY</th>
              <th className="text-right p-4">Borrowed</th>
              <th className="text-right p-4">Borrow APY</th>
              <th className="text-right p-4">Utilization</th>
              <th className="text-right p-4">Supply limit</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {mockPools.map((pool, i) => (
              <tr key={i} className="border-b last:border-0">
                <td className="p-4">{pool.token}</td>
                <td className="text-right p-4">
                  {formatValue(pool.supply, pool.tokenPrice, pool.token)}
                </td>
                <td className="text-right p-4">{pool.supplyApy}%</td>
                <td className="text-right p-4">
                  {formatValue(pool.borrowed, pool.tokenPrice, pool.token)}
                </td>
                <td className="text-right p-4">{pool.borrowApy}%</td>
                <td className="text-right p-4">
                  {calculateUtilization(pool.borrowed, pool.supply)}%
                </td>
                <td className="text-right p-4">
                  {formatValue(pool.supplyLimit, pool.tokenPrice, pool.token)}
                </td>
                <td className="p-4">
                  <Button>Deposit</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 