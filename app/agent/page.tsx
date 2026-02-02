"use client"

import { useState, useEffect } from "react"
import { RefreshCw, LayoutDashboard, LogOut, Radio } from "lucide-react"
import { BRILeaderboard } from "@/components/bri-leaderboard"
import { LiveSignalFeed } from "@/components/live-signal-feed"

interface Visitor {
  id: string
  name: string
  email: string
  checkedInAt: string
  engagementScore: number
  featuresFound: number
  referralsSent: number
  timeInHome: number
}

interface Signal {
  id: string
  type: "check-in" | "feature-discovered" | "referral"
  userName: string
  detail: string
  timestamp: string
}

// Demo visitors for when API returns no data
const demoVisitors: Visitor[] = [
  {
    id: "demo-1",
    name: "Alexandra Chen",
    email: "alexandra.chen@email.com",
    checkedInAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    engagementScore: 92,
    featuresFound: 3,
    referralsSent: 2,
    timeInHome: 47,
  },
  {
    id: "demo-2",
    name: "Marcus Williams",
    email: "m.williams@company.io",
    checkedInAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    engagementScore: 78,
    featuresFound: 2,
    referralsSent: 1,
    timeInHome: 32,
  },
  {
    id: "demo-3",
    name: "Sofia Rodriguez",
    email: "sofia.r@gmail.com",
    checkedInAt: new Date(Date.now() - 1000 * 60 * 32).toISOString(),
    engagementScore: 65,
    featuresFound: 2,
    referralsSent: 0,
    timeInHome: 24,
  },
  {
    id: "demo-4",
    name: "James Thompson",
    email: "james.t@outlook.com",
    checkedInAt: new Date(Date.now() - 1000 * 60 * 48).toISOString(),
    engagementScore: 45,
    featuresFound: 1,
    referralsSent: 0,
    timeInHome: 15,
  },
  {
    id: "demo-5",
    name: "Emily Park",
    email: "emily.park@email.com",
    checkedInAt: new Date(Date.now() - 1000 * 60 * 75).toISOString(),
    engagementScore: 28,
    featuresFound: 0,
    referralsSent: 0,
    timeInHome: 8,
  },
]

const demoSignals: Signal[] = [
  {
    id: "sig-1",
    type: "feature-discovered",
    userName: "Alexandra C.",
    detail: "Gourmet Kitchen",
    timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
  },
  {
    id: "sig-2",
    type: "feature-discovered",
    userName: "Marcus W.",
    detail: "Smart Tech",
    timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
  },
  {
    id: "sig-3",
    type: "check-in",
    userName: "Sofia R.",
    detail: "Checked in",
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  },
  {
    id: "sig-4",
    type: "referral",
    userName: "Alexandra C.",
    detail: "Sent referral",
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: "sig-5",
    type: "feature-discovered",
    userName: "James T.",
    detail: "Primary Suite",
    timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
  },
]

export default function AgentPortal() {
  const [visitors, setVisitors] = useState<Visitor[]>([])
  const [signals, setSignals] = useState<Signal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [useDemoData, setUseDemoData] = useState(false)

  const loadData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/signals")
      if (response.ok) {
        const data = await response.json()
        if (data.visitors && data.visitors.length > 0) {
          setVisitors(data.visitors)
          setSignals(data.signals || [])
          setUseDemoData(false)
        } else {
          setVisitors(demoVisitors)
          setSignals(demoSignals)
          setUseDemoData(true)
        }
      } else {
        setVisitors(demoVisitors)
        setSignals(demoSignals)
        setUseDemoData(true)
      }
    } catch {
      setVisitors(demoVisitors)
      setSignals(demoSignals)
      setUseDemoData(true)
    }
    setLastUpdated(new Date())
    setIsLoading(false)
  }

  useEffect(() => {
    loadData()
    const interval = setInterval(loadData, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleRefresh = () => {
    loadData()
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-champagne/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <LayoutDashboard className="w-5 h-5 text-champagne" />
                <span className="text-xs tracking-[0.3em] uppercase text-champagne">
                  Haven Rush
                </span>
              </div>
              <div className="hidden sm:block h-6 w-px bg-champagne/20" />
              <h1 className="hidden sm:block font-serif text-xl text-foreground">Agent Analytics</h1>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground border border-champagne/20 hover:border-champagne/40 transition-all duration-300"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <a
                href="/"
                className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground border border-champagne/20 hover:border-champagne/40 transition-all duration-300"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Exit</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h2 className="font-serif text-3xl sm:text-4xl text-foreground">BRI Leaderboard</h2>
                <span className="px-3 py-1 text-xs tracking-widest uppercase bg-champagne/10 border border-champagne/30 text-champagne">
                  Buyer Readiness Index
                </span>
              </div>
              <p className="text-muted-foreground">
                Real-time buyer intent signals and engagement analytics
              </p>
            </div>
            <div className="text-sm text-muted-foreground">
              Last updated: {formatTime(lastUpdated)}
            </div>
          </div>

          {useDemoData && (
            <div className="inline-flex items-center gap-2 px-4 py-2 border border-champagne/30 bg-champagne/5 text-sm text-champagne">
              <span>Showing demo data</span>
              <span className="text-muted-foreground">|</span>
              <span className="text-muted-foreground">Check in visitors to see live data</span>
            </div>
          )}
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Leaderboard */}
          <div className="lg:col-span-2">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="space-y-4 text-center">
                  <div className="w-8 h-8 mx-auto border-2 border-champagne border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm text-muted-foreground">Loading visitor data...</p>
                </div>
              </div>
            ) : (
              <BRILeaderboard visitors={visitors} />
            )}
          </div>

          {/* Live Signal Feed */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <div className="relative">
                  <Radio className="w-4 h-4 text-champagne" />
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-champagne rounded-full animate-ping" />
                </div>
                <h3 className="text-xs tracking-widest uppercase text-champagne">Live Signal Feed</h3>
              </div>
              <LiveSignalFeed signals={signals} />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-champagne/10 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <p>Agent Analytics Dashboard | The Meridian Estate</p>
            <p className="tracking-widest uppercase">Haven Rush</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
