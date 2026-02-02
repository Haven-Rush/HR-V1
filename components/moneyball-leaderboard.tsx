"use client"

import { TrendingUp, Trophy, Clock, Mail } from "lucide-react"

interface Visitor {
  id: string
  name: string
  email: string
  checkedInAt: string
  engagementScore: number
  featuresFound: number
  referralsSent: number
  timeInHome: number // in minutes
}

interface MoneyballLeaderboardProps {
  visitors: Visitor[]
}

export function MoneyballLeaderboard({ visitors }: MoneyballLeaderboardProps) {
  // Sort visitors by engagement score (highest first)
  const rankedVisitors = [...visitors].sort((a, b) => b.engagementScore - a.engagementScore)

  const formatTimeInHome = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400"
    if (score >= 60) return "text-champagne"
    if (score >= 40) return "text-amber-400"
    return "text-muted-foreground"
  }

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-emerald-400"
    if (score >= 60) return "bg-champagne"
    if (score >= 40) return "bg-amber-400"
    return "bg-muted-foreground"
  }

  const getIntentLabel = (score: number) => {
    if (score >= 80) return "Hot Lead"
    if (score >= 60) return "High Intent"
    if (score >= 40) return "Interested"
    return "Browsing"
  }

  const avgTimeInHome = visitors.length > 0 
    ? Math.round(visitors.reduce((acc, v) => acc + (v.timeInHome || 0), 0) / visitors.length)
    : 0

  if (visitors.length === 0) {
    return (
      <div className="text-center py-16 space-y-4">
        <div className="w-16 h-16 mx-auto border border-champagne/30 rounded-full flex items-center justify-center">
          <Trophy className="w-8 h-8 text-champagne/50" />
        </div>
        <div className="space-y-2">
          <h3 className="font-serif text-xl text-foreground">No Visitors Yet</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Visitors will appear here as they check in to the open house experience.
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
          icon={<Trophy className="w-4 h-4" />}
        />
        <StatCard
          label="Avg. Score"
          value={Math.round(visitors.reduce((acc, v) => acc + v.engagementScore, 0) / visitors.length).toString()}
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <StatCard
          label="Avg. Time"
          value={formatTimeInHome(avgTimeInHome)}
          icon={<Clock className="w-4 h-4" />}
        />
        <StatCard
          label="Total Referrals"
          value={visitors.reduce((acc, v) => acc + v.referralsSent, 0).toString()}
          icon={<Mail className="w-4 h-4" />}
        />
      </div>

      {/* Leaderboard Table */}
      <div className="border border-champagne/20 overflow-hidden">
        {/* Table Header */}
        <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-4 bg-charcoal text-primary-foreground text-xs tracking-widest uppercase">
          <div className="col-span-1 text-center">#</div>
          <div className="col-span-3">Visitor</div>
          <div className="col-span-2 text-center">Time in Home</div>
          <div className="col-span-2 text-center">Score</div>
          <div className="col-span-4">Engagement</div>
        </div>

        {/* Mobile Header */}
        <div className="sm:hidden px-6 py-4 bg-charcoal text-primary-foreground text-xs tracking-widest uppercase">
          Visitor Rankings
        </div>

        {/* Table Body */}
        <div className="divide-y divide-champagne/10">
          {rankedVisitors.map((visitor, index) => (
            <div
              key={visitor.id}
              className="px-6 py-5 hover:bg-champagne/5 transition-colors duration-200"
            >
              {/* Desktop Layout */}
              <div className="hidden sm:grid grid-cols-12 gap-4 items-center">
                {/* Rank */}
                <div className="col-span-1 text-center">
                  {index < 3 ? (
                    <span
                      className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-medium ${
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
                    <span className="text-muted-foreground">{index + 1}</span>
                  )}
                </div>

                {/* Visitor Info */}
                <div className="col-span-3 min-w-0">
                  <p className="font-medium text-foreground truncate">{visitor.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{visitor.email}</p>
                </div>

                {/* Time in Home */}
                <div className="col-span-2 text-center">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-card border border-champagne/20 rounded-full">
                    <Clock className="w-3.5 h-3.5 text-champagne" />
                    <span className="text-sm font-medium text-foreground">
                      {formatTimeInHome(visitor.timeInHome || 0)}
                    </span>
                  </div>
                </div>

                {/* Score */}
                <div className="col-span-2 text-center">
                  <span className={`font-serif text-2xl ${getScoreColor(visitor.engagementScore)}`}>
                    {visitor.engagementScore}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="col-span-4">
                  <div className="space-y-1.5">
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getProgressColor(visitor.engagementScore)} transition-all duration-1000 ease-out`}
                        style={{ width: `${visitor.engagementScore}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {getIntentLabel(visitor.engagementScore)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Mobile Layout */}
              <div className="sm:hidden space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {index < 3 ? (
                      <span
                        className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-medium flex-shrink-0 ${
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
                      <p className="text-xs text-muted-foreground truncate">{visitor.email}</p>
                    </div>
                  </div>
                  <span className={`font-serif text-2xl flex-shrink-0 ${getScoreColor(visitor.engagementScore)}`}>
                    {visitor.engagementScore}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-card border border-champagne/20 rounded-full">
                    <Clock className="w-3.5 h-3.5 text-champagne" />
                    <span className="text-sm font-medium text-foreground">
                      {formatTimeInHome(visitor.timeInHome || 0)}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {getIntentLabel(visitor.engagementScore)}
                  </span>
                </div>

                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getProgressColor(visitor.engagementScore)} transition-all duration-1000 ease-out`}
                    style={{ width: `${visitor.engagementScore}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

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
