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
}

interface MoneyballLeaderboardProps {
  visitors: Visitor[]
}

export function MoneyballLeaderboard({ visitors }: MoneyballLeaderboardProps) {
  // Sort visitors by engagement score (highest first)
  const rankedVisitors = [...visitors].sort((a, b) => b.engagementScore - a.engagementScore)

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000)
    
    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
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
          label="High Engagement"
          value={visitors.filter((v) => v.engagementScore >= 60).length.toString()}
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
        <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-charcoal text-primary-foreground text-xs tracking-widest uppercase">
          <div className="col-span-1 text-center">#</div>
          <div className="col-span-4 sm:col-span-3">Visitor</div>
          <div className="col-span-3 sm:col-span-2 text-center hidden sm:block">Time</div>
          <div className="col-span-4 sm:col-span-3 text-center">Score</div>
          <div className="col-span-3 sm:col-span-3">Engagement</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-champagne/10">
          {rankedVisitors.map((visitor, index) => (
            <div
              key={visitor.id}
              className="grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-champagne/5 transition-colors duration-200"
            >
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
              <div className="col-span-4 sm:col-span-3 min-w-0">
                <p className="font-medium text-foreground truncate">{visitor.name}</p>
                <p className="text-xs text-muted-foreground truncate">{visitor.email}</p>
              </div>

              {/* Time */}
              <div className="col-span-3 sm:col-span-2 text-center hidden sm:block">
                <span className="text-sm text-muted-foreground">
                  {getTimeAgo(visitor.checkedInAt)}
                </span>
              </div>

              {/* Score */}
              <div className="col-span-4 sm:col-span-3 text-center">
                <span className={`font-serif text-2xl ${getScoreColor(visitor.engagementScore)}`}>
                  {visitor.engagementScore}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="col-span-3 sm:col-span-3">
                <div className="space-y-1">
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getProgressColor(visitor.engagementScore)} transition-all duration-1000 ease-out animate-progress`}
                      style={{ width: `${visitor.engagementScore}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {visitor.engagementScore >= 80
                      ? "Hot Lead"
                      : visitor.engagementScore >= 60
                      ? "Engaged"
                      : visitor.engagementScore >= 40
                      ? "Interested"
                      : "Browsing"}
                  </p>
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
