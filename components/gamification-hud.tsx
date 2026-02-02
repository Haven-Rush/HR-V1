"use client"

import { useState } from "react"
import { Search, Users, Check, Send } from "lucide-react"

interface ScavengerItem {
  id: string
  title: string
  description: string
  found: boolean
}

interface GamificationHUDProps {
  userName: string
}

export function GamificationHUD({ userName }: GamificationHUDProps) {
  const [activeTab, setActiveTab] = useState<"hunt" | "referral">("hunt")
  const [scavengerItems, setScavengerItems] = useState<ScavengerItem[]>([
    {
      id: "1",
      title: "Chef's Kitchen",
      description: "Find the Sub-Zero refrigerator and wine storage",
      found: false,
    },
    {
      id: "2",
      title: "Spa Retreat",
      description: "Discover the heated floors in the primary bath",
      found: false,
    },
    {
      id: "3",
      title: "Smart Home Hub",
      description: "Locate the Crestron control panel",
      found: false,
    },
  ])
  const [referralEmail, setReferralEmail] = useState("")
  const [referralSent, setReferralSent] = useState(false)

  const toggleFound = (id: string) => {
    setScavengerItems((items) =>
      items.map((item) => (item.id === id ? { ...item, found: !item.found } : item))
    )
  }

  const foundCount = scavengerItems.filter((item) => item.found).length
  const progress = (foundCount / scavengerItems.length) * 100

  const handleReferral = (e: React.FormEvent) => {
    e.preventDefault()
    if (!referralEmail.trim()) return
    setReferralSent(true)
    setTimeout(() => {
      setReferralEmail("")
      setReferralSent(false)
    }, 3000)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-champagne/20 shadow-lg z-50">
      {/* Tab Navigation */}
      <div className="flex border-b border-champagne/10">
        <button
          onClick={() => setActiveTab("hunt")}
          className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm tracking-widest uppercase transition-all duration-300 ${
            activeTab === "hunt"
              ? "text-champagne border-b-2 border-champagne bg-champagne/5"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Search className="w-4 h-4" />
          <span className="hidden sm:inline">Scavenger Hunt</span>
          <span className="sm:hidden">Hunt</span>
          {foundCount > 0 && (
            <span className="ml-1 px-2 py-0.5 text-xs bg-champagne text-charcoal rounded-full">
              {foundCount}/{scavengerItems.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("referral")}
          className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm tracking-widest uppercase transition-all duration-300 ${
            activeTab === "referral"
              ? "text-champagne border-b-2 border-champagne bg-champagne/5"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Users className="w-4 h-4" />
          <span className="hidden sm:inline">Neighbor Referrals</span>
          <span className="sm:hidden">Referrals</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="max-h-[50vh] overflow-y-auto">
        {activeTab === "hunt" && (
          <div className="p-6 space-y-4">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs tracking-widest uppercase text-muted-foreground">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-1 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-champagne transition-all duration-700 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Scavenger Items */}
            <div className="space-y-3">
              {scavengerItems.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => toggleFound(item.id)}
                  className={`w-full flex items-start gap-4 p-4 border transition-all duration-300 text-left ${
                    item.found
                      ? "border-champagne bg-champagne/5"
                      : "border-champagne/20 hover:border-champagne/40"
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div
                    className={`flex-shrink-0 w-6 h-6 border rounded-full flex items-center justify-center transition-all duration-300 ${
                      item.found ? "bg-champagne border-champagne" : "border-champagne/40"
                    }`}
                  >
                    {item.found && <Check className="w-4 h-4 text-charcoal" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4
                      className={`font-serif text-lg transition-colors duration-300 ${
                        item.found ? "text-champagne" : "text-foreground"
                      }`}
                    >
                      {item.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-0.5">{item.description}</p>
                  </div>
                </button>
              ))}
            </div>

            {foundCount === scavengerItems.length && (
              <div className="text-center py-4 border border-champagne bg-champagne/10">
                <p className="font-serif text-lg text-champagne">Congratulations, {userName}!</p>
                <p className="text-sm text-muted-foreground mt-1">
                  You discovered all premium features
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "referral" && (
          <div className="p-6 space-y-6">
            <div className="text-center space-y-2">
              <h3 className="font-serif text-xl text-foreground">Know Someone Interested?</h3>
              <p className="text-sm text-muted-foreground">
                Invite a friend or neighbor to experience this exceptional property
              </p>
            </div>

            <form onSubmit={handleReferral} className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  value={referralEmail}
                  onChange={(e) => setReferralEmail(e.target.value)}
                  placeholder="friend@email.com"
                  className="w-full bg-transparent border border-champagne/30 py-3 px-4 text-foreground placeholder:text-muted-foreground focus:border-champagne focus:outline-none transition-colors duration-300"
                />
              </div>
              <button
                type="submit"
                disabled={!referralEmail.trim() || referralSent}
                className={`w-full flex items-center justify-center gap-2 py-3 px-6 border border-champagne text-sm tracking-widest uppercase transition-all duration-300 ${
                  referralSent
                    ? "bg-champagne text-charcoal"
                    : referralEmail.trim()
                    ? "hover:bg-champagne hover:text-charcoal text-foreground"
                    : "opacity-40 cursor-not-allowed text-foreground"
                }`}
              >
                {referralSent ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Invitation Sent</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Invitation</span>
                  </>
                )}
              </button>
            </form>

            <p className="text-xs text-center text-muted-foreground">
              Your referral earns priority viewing access
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
