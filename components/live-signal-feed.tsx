"use client"

import { LogIn, Compass, Users } from "lucide-react"

interface Signal {
  id: string
  type: "check-in" | "feature-discovered" | "referral"
  userName: string
  detail: string
  timestamp: string
}

interface LiveSignalFeedProps {
  signals: Signal[]
}

export function LiveSignalFeed({ signals }: LiveSignalFeedProps) {
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
