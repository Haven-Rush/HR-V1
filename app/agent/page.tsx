"use client"

import { useState, useEffect } from "react"
import { RefreshCw, LayoutDashboard, LogOut, Radio, TrendingUp, Trophy, Clock, Users, LogIn, Compass } from "lucide-react"

// ============================================
// TYPES
// ============================================

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

// ============================================
// DEMO DATA
// ============================================

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

// ============================================
// BRI LEADERBOARD COMPONENT
// ============================================

function StatCard({
  label,
  value,
  icon,
}: {
  label: string
  value: string
  icon: React.ReactNode
}) {
  return (
    <div className="border border-champagne/20 p-4 space-y-2 hover:border-champagne/40 transition-colors duration-300">
      <div className="flex items-center gap-2 text-champagne">
        {icon}
        <span className="text-xs tracking-widest uppercase text-muted-foreground">{label}</span>
      </div>
      <p className="font-serif text-3xl text-foreground">{value}</p>
    </div>
  )
}

interface BRILeaderboardProps {
  visitors: Visitor[]
}

function BRILeaderboard({ visitors }: BRILeaderboardProps) {
  const rankedVisitors = [...visitors].sort((a, b) => b.engagementScore - a.engagementScore)

  const getReadinessLevel = (score: number): { label: string; color: string; bgColor: string } => {
    if (score >= 75) return { label: "High-Priority", color: "text-emerald-400", bgColor: "bg-emerald-400" }
    if (score >= 50) return { label: "Engaged", color: "text-champagne", bgColor: "bg-champagne" }
    return { label: "Evaluating", color: "text-muted-foreground", bgColor: "bg-muted-foreground" }
  }

  const formatTimeInHome = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }

  const avgScore = visitors.length > 0 
    ? Math.round(visitors.reduce((acc, v) => acc + v.engagementScore, 0) / visitors.length)
    : 0

  const highPriorityCount = visitors.filter(v => v.engagementScore >= 75).length

  if (visitors.length === 0) {
    return (
      <div className="text-center py-16 space-y-4 border border-champagne/20">
        <div className="w-16 h-16 mx-auto border border-champagne/30 flex items-center justify-center">
          <Trophy className="w-8 h-8 text-champagne/50" />
        </div>
        <div className="space-y-2">
          <h3 className="font-serif text-xl text-foreground">No Visitors Yet</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Visitors will appear here as they check in to the property experience.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Visitors"
          value={visitors.length.toString()}
          icon={<Users className="w-4 h-4" />}
        />
        <StatCard
          label="Avg. BRI Score"
          value={avgScore.toString()}
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <StatCard
          label="High-Priority"
          value={highPriorityCount.toString()}
          icon={<Trophy className="w-4 h-4" />}
        />
        <StatCard
          label="Avg. Time"
          value={formatTimeInHome(Math.round(visitors.reduce((acc, v) => acc + (v.timeInHome || 0), 0) / visitors.length))}
          icon={<Clock className="w-4 h-4" />}
        />
      </div>

      {/* Leaderboard Table */}
      <div className="border border-champagne/20 overflow-hidden">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-charcoal text-primary-foreground text-xs tracking-widest uppercase">
          <div className="col-span-4">Lead Name</div>
          <div className="col-span-5">Signal Strength</div>
          <div className="col-span-3 text-right">Readiness Level</div>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden px-6 py-4 bg-charcoal text-primary-foreground text-xs tracking-widest uppercase">
          BRI Rankings
        </div>

        {/* Table Body */}
        <div className="divide-y divide-champagne/10">
          {rankedVisitors.map((visitor, index) => {
            const readiness = getReadinessLevel(visitor.engagementScore)
            
            return (
              <div
                key={visitor.id}
                className="px-6 py-5 hover:bg-champagne/5 transition-colors duration-200"
              >
                {/* Desktop Layout */}
                <div className="hidden md:grid grid-cols-12 gap-4 items-center">
                  {/* Lead Name */}
                  <div className="col-span-4 flex items-center gap-3">
                    {index < 3 ? (
                      <span
                        className={`inline-flex items-center justify-center w-7 h-7 text-sm font-medium flex-shrink-0 ${
                          index === 0
                            ? "bg-champagne text-charcoal"
                            : index === 1
                            ? "bg-champagne/60 text-charcoal"
                            : "bg-champagne/30 text-foreground"
                        }`}
                      >
                        {index + 1}
                      </span>
                    ) : (
                      <span className="w-7 text-center text-muted-foreground flex-shrink-0">{index + 1}</span>
                    )}
                    <div className="min-w-0">
                      <p className="font-medium text-foreground truncate">{visitor.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{formatTimeInHome(visitor.timeInHome || 0)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Signal Strength Gauge */}
                  <div className="col-span-5">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-3 bg-muted overflow-hidden relative">
                          {/* Background segments */}
                          <div className="absolute inset-0 flex">
                            <div className="flex-1 border-r border-background/20" />
                            <div className="flex-1 border-r border-background/20" />
                            <div className="flex-1 border-r border-background/20" />
                            <div className="flex-1" />
                          </div>
                          {/* Fill */}
                          <div
                            className={`h-full ${readiness.bgColor} transition-all duration-1000 ease-out relative`}
                            style={{ width: `${visitor.engagementScore}%` }}
                          />
                        </div>
                        <span className={`font-serif text-xl min-w-[3ch] text-right ${readiness.color}`}>
                          {visitor.engagementScore}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Readiness Level */}
                  <div className="col-span-3 text-right">
                    <span className={`inline-flex px-3 py-1.5 text-xs tracking-widest uppercase border ${
                      visitor.engagementScore >= 75 
                        ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-400"
                        : visitor.engagementScore >= 50
                        ? "border-champagne/40 bg-champagne/10 text-champagne"
                        : "border-muted-foreground/30 bg-muted/30 text-muted-foreground"
                    }`}>
                      {readiness.label}
                    </span>
                  </div>
                </div>

                {/* Mobile Layout */}
                <div className="md:hidden space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {index < 3 ? (
                        <span
                          className={`inline-flex items-center justify-center w-7 h-7 text-sm font-medium flex-shrink-0 ${
                            index === 0
                              ? "bg-champagne text-charcoal"
                              : index === 1
                              ? "bg-champagne/60 text-charcoal"
                              : "bg-champagne/30 text-foreground"
                          }`}
                        >
                          {index + 1}
                        </span>
                      ) : (
                        <span className="w-7 text-center text-muted-foreground flex-shrink-0">{index + 1}</span>
                      )}
                      <div className="min-w-0">
                        <p className="font-medium text-foreground truncate">{visitor.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{formatTimeInHome(visitor.timeInHome || 0)}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`font-serif text-2xl flex-shrink-0 ${readiness.color}`}>
                      {visitor.engagementScore}
                    </span>
                  </div>

                  <div className="h-2 bg-muted overflow-hidden">
                    <div
                      className={`h-full ${readiness.bgColor} transition-all duration-1000 ease-out`}
                      style={{ width: `${visitor.engagementScore}%` }}
                    />
                  </div>

                  <div className="flex justify-end">
                    <span className={`inline-flex px-3 py-1 text-xs tracking-widest uppercase border ${
                      visitor.engagementScore >= 75 
                        ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-400"
                        : visitor.engagementScore >= 50
                        ? "border-champagne/40 bg-champagne/10 text-champagne"
                        : "border-muted-foreground/30 bg-muted/30 text-muted-foreground"
                    }`}>
                      {readiness.label}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ============================================
// LIVE SIGNAL FEED COMPONENT
// ============================================

interface LiveSignalFeedProps {
  signals: Signal[]
}

function LiveSignalFeed({ signals }: LiveSignalFeedProps) {
  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const then = new Date(timestamp)
    const diffMs = now.getTime() - then.getTime()
    const diffMins = Math.floor(diffMs / 1000 / 60)
    
    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    return `${Math.floor(diffHours / 24)}d ago`
  }

  const getSignalIcon = (type: Signal["type"]) => {
    switch (type) {
      case "check-in":
        return <LogIn className="w-3.5 h-3.5" />
      case "feature-discovered":
        return <Compass className="w-3.5 h-3.5" />
      case "referral":
        return <Users className="w-3.5 h-3.5" />
    }
  }

  const getSignalMessage = (signal: Signal) => {
    switch (signal.type) {
      case "check-in":
        return "checked in to the property"
      case "feature-discovered":
        return `completed Feature Discovery: ${signal.detail}`
      case "referral":
        return "sent a referral invitation"
    }
  }

  if (signals.length === 0) {
    return (
      <div className="border border-champagne/20 p-6 text-center">
        <p className="text-sm text-muted-foreground">No signals yet</p>
      </div>
    )
  }

  return (
    <div className="border border-champagne/20 divide-y divide-champagne/10 max-h-[600px] overflow-y-auto">
      {signals.map((signal, index) => (
        <div
          key={signal.id}
          className="p-4 hover:bg-champagne/5 transition-colors duration-200"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <div className="flex items-start gap-3">
            <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center border ${
              signal.type === "feature-discovered"
                ? "border-champagne/40 bg-champagne/10 text-champagne"
                : signal.type === "check-in"
                ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-400"
                : "border-muted-foreground/30 bg-muted/30 text-muted-foreground"
            }`}>
              {getSignalIcon(signal.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground">
                <span className="font-medium">{signal.userName}</span>{" "}
                <span className="text-muted-foreground">{getSignalMessage(signal)}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatTimeAgo(signal.timestamp)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ============================================
// MAIN AGENT PORTAL PAGE
// ============================================

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
