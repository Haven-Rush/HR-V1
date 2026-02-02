"use client"

import { useState, useEffect } from "react"
import { Compass, Users, Check, Send, Radio } from "lucide-react"

interface FeatureItem {
  id: string
  title: string
  description: string
  discovered: boolean
}

interface GamificationHUDProps {
  userName: string
}

export function GamificationHUD({ userName }: GamificationHUDProps) {
  const [activeTab, setActiveTab] = useState<"discovery" | "referral">("discovery")
  const [notification, setNotification] = useState<string | null>(null)
  const [featureItems, setFeatureItems] = useState<FeatureItem[]>([
    {
      id: "1",
      title: "Gourmet Kitchen",
      description: "Sub-Zero refrigerator and La Cornue range",
      discovered: false,
    },
    {
      id: "2",
      title: "Smart Tech",
      description: "Crestron control panel and automated blinds",
      discovered: false,
    },
    {
      id: "3",
      title: "Primary Suite",
      description: "Spa bath with heated floors and fireplace",
      discovered: false,
    },
  ])
  const [referralEmail, setReferralEmail] = useState("")
  const [referralSent, setReferralSent] = useState(false)

  const showNotification = (featureTitle: string) => {
    setNotification(featureTitle)
    setTimeout(() => setNotification(null), 3000)
  }

  const toggleDiscovered = async (id: string, title: string) => {
    const item = featureItems.find((i) => i.id === id)
    if (item && !item.discovered) {
      setFeatureItems((items) =>
        items.map((i) => (i.id === id ? { ...i, discovered: true } : i))
      )
      showNotification(title)
      
      // Send feature discovery signal to API
      try {
        await fetch("/api/signals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            signal_type: "feature_discovered",
            user_name: userName,
            feature: title,
            timestamp: new Date().toISOString(),
          }),
        })
      } catch (error) {
        console.error("Failed to send signal:", error)
      }
    }
  }

  const discoveredCount = featureItems.filter((item) => item.discovered).length
  const progress = (discoveredCount / featureItems.length) * 100

  const handleReferral = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!referralEmail.trim()) return
    setReferralSent(true)
    
    // Send referral signal to API
    try {
      await fetch("/api/signals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          signal_type: "referral_sent",
          user_name: userName,
          referral_email: referralEmail,
          timestamp: new Date().toISOString(),
        }),
      })
    } catch (error) {
      console.error("Failed to send referral signal:", error)
    }
    
    setTimeout(() => {
      setReferralEmail("")
      setReferralSent(false)
    }, 3000)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-champagne/20 shadow-lg z-50">
      {/* Intent Signal Notification */}
      <div
        className={`absolute -top-16 left-1/2 -translate-x-1/2 transition-all duration-500 ${
          notification ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-3 px-5 py-3 bg-charcoal border border-champagne/40 shadow-xl">
          <div className="relative">
            <Radio className="w-4 h-4 text-champagne" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-champagne rounded-full animate-ping" />
          </div>
          <div>
            <p className="text-xs tracking-widest uppercase text-champagne">Intent Signal Captured</p>
            <p className="text-sm text-foreground">{notification}</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-champagne/10">
        <button
          onClick={() => setActiveTab("discovery")}
          className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm tracking-widest uppercase transition-all duration-300 ${
            activeTab === "discovery"
              ? "text-champagne border-b-2 border-champagne bg-champagne/5"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Compass className="w-4 h-4" />
          <span className="hidden sm:inline">Feature Discovery</span>
          <span className="sm:hidden">Discovery</span>
          {discoveredCount > 0 && (
            <span className="ml-1 px-2 py-0.5 text-xs bg-champagne text-charcoal rounded-full">
              {discoveredCount}/{featureItems.length}
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
        {activeTab === "discovery" && (
          <div className="p-6 space-y-4">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs tracking-widest uppercase text-muted-foreground">
                <span>Discovery Progress</span>
                <span>{discoveredCount} of {featureItems.length}</span>
              </div>
              <div className="h-1 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-champagne transition-all duration-700 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Feature Items */}
            <div className="space-y-3">
              {featureItems.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => toggleDiscovered(item.id, item.title)}
                  disabled={item.discovered}
                  className={`w-full flex items-start gap-4 p-4 border transition-all duration-300 text-left ${
                    item.discovered
                      ? "border-champagne bg-champagne/5 cursor-default"
                      : "border-champagne/20 hover:border-champagne/40"
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div
                    className={`flex-shrink-0 w-6 h-6 border flex items-center justify-center transition-all duration-300 ${
                      item.discovered ? "bg-champagne border-champagne" : "border-champagne/40"
                    }`}
                  >
                    {item.discovered && <Check className="w-4 h-4 text-charcoal" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4
                        className={`font-serif text-lg transition-colors duration-300 ${
                          item.discovered ? "text-champagne" : "text-foreground"
                        }`}
                      >
                        {item.title}
                      </h4>
                      {item.discovered && (
                        <span className="text-xs tracking-widest uppercase text-champagne/70">Discovered</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">{item.description}</p>
                  </div>
                </button>
              ))}
            </div>

            {discoveredCount === featureItems.length && (
              <div className="text-center py-4 border border-champagne bg-champagne/10">
                <p className="font-serif text-lg text-champagne">Complete Profile, {userName}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  All features discovered — high buyer intent captured
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
