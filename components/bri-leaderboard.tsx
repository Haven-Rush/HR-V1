"use client"

import { TrendingUp, Trophy, Clock, Users } from "lucide-react"

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

interface BRILeaderboardProps {
  visitors: Visitor[]
}

export function BRILeaderboard({ visitors }: BRILeaderboardProps) {
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
