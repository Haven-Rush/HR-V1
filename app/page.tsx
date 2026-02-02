"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { ArrowRight, Compass, Users, Check, Send, Radio } from "lucide-react"

// ============================================
// CHECK-IN FORM COMPONENT
// ============================================

interface CheckInFormProps {
  onComplete: (name: string, email: string) => void
}

function CheckInForm({ onComplete }: CheckInFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [focused, setFocused] = useState<"name" | "email" | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return

    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 600))
    onComplete(name, email)
  }

  const isValid = name.trim().length > 0 && email.trim().length > 0

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-8">
      <div className="space-y-6">
        {/* Name Field */}
        <div className="relative">
          <label
            htmlFor="name"
            className={`absolute left-0 transition-all duration-300 ${
              focused === "name" || name
                ? "-top-6 text-xs tracking-widest uppercase text-champagne"
                : "top-3 text-muted-foreground"
            }`}
          >
            Full Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onFocus={() => setFocused("name")}
            onBlur={() => setFocused(null)}
            className="w-full bg-transparent border-b border-champagne/30 py-3 text-foreground placeholder:text-transparent focus:border-champagne focus:outline-none transition-colors duration-300"
            placeholder="Your name"
            autoComplete="name"
          />
          <div
            className={`absolute bottom-0 left-0 h-px bg-champagne transition-all duration-300 ${
              focused === "name" ? "w-full" : "w-0"
            }`}
          />
        </div>

        {/* Email Field */}
        <div className="relative">
          <label
            htmlFor="email"
            className={`absolute left-0 transition-all duration-300 ${
              focused === "email" || email
                ? "-top-6 text-xs tracking-widest uppercase text-champagne"
                : "top-3 text-muted-foreground"
            }`}
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setFocused("email")}
            onBlur={() => setFocused(null)}
            className="w-full bg-transparent border-b border-champagne/30 py-3 text-foreground placeholder:text-transparent focus:border-champagne focus:outline-none transition-colors duration-300"
            placeholder="your@email.com"
            autoComplete="email"
          />
          <div
            className={`absolute bottom-0 left-0 h-px bg-champagne transition-all duration-300 ${
              focused === "email" ? "w-full" : "w-0"
            }`}
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!isValid || isSubmitting}
        className={`group relative w-full flex items-center justify-center gap-3 py-4 px-8 border border-champagne text-foreground font-light tracking-widest uppercase text-sm transition-all duration-500 overflow-hidden ${
          isValid
            ? "hover:bg-champagne hover:text-charcoal cursor-pointer"
            : "opacity-40 cursor-not-allowed"
        }`}
      >
        <span className={`transition-transform duration-300 ${isSubmitting ? "opacity-0" : ""}`}>
          Begin the Property Experience
        </span>
        <ArrowRight
          className={`w-4 h-4 transition-all duration-300 ${
            isSubmitting ? "opacity-0" : "group-hover:translate-x-1"
          }`}
        />
        {isSubmitting && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-5 h-5 border border-champagne border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </button>
    </form>
  )
}

// ============================================
// GAMIFICATION HUD COMPONENT
// ============================================

interface FeatureItem {
  id: string
  title: string
  description: string
  discovered: boolean
}

interface GamificationHUDProps {
  userName: string
  propId: string
}

function GamificationHUD({ userName, propId }: GamificationHUDProps) {
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
      
      try {
        await fetch("/api/signals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            signal_type: "feature_discovered",
            prop_id: propId,
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
    
    try {
      await fetch("/api/signals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          signal_type: "referral_sent",
          prop_id: propId,
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

// ============================================
// PAGE SCREENS
// ============================================

function WelcomeScreen({ onComplete }: { onComplete: (name: string, email: string) => void }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-center py-8 px-6">
        <div className="text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-champagne">Haven Rush</p>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
        <div className="w-full max-w-lg text-center space-y-12">
          {/* Welcome Text */}
          <div className="space-y-4 animate-fade-in-up">
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal text-foreground leading-tight text-balance">
              Welcome
            </h1>
            <div className="w-16 h-px bg-champagne mx-auto" />
            <p className="text-muted-foreground text-lg font-light">
              Begin your exclusive property experience
            </p>
          </div>

          {/* Check-in Form */}
          <div className="animate-fade-in-up stagger-2 opacity-0">
            <CheckInForm onComplete={onComplete} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 text-center">
        <p className="text-xs text-muted-foreground tracking-widest uppercase">
          Private Showing
        </p>
      </footer>
    </div>
  )
}

function ExperienceScreen({ userName, propId }: { userName: string; propId: string }) {
  const firstName = userName.split(" ")[0]

  return (
    <div className="min-h-screen flex flex-col pb-48">
      {/* Header */}
      <header className="flex items-center justify-between py-6 px-6 border-b border-champagne/10">
        <p className="text-xs tracking-[0.3em] uppercase text-champagne">Haven Rush</p>
        <p className="text-sm text-muted-foreground">
          Welcome, <span className="text-foreground">{firstName}</span>
        </p>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl text-center space-y-12">
          {/* Property Hero */}
          <div className="space-y-6 animate-fade-in-up">
            <p className="text-xs tracking-[0.3em] uppercase text-champagne">Now Exploring</p>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-foreground leading-tight text-balance">
              The Meridian Estate
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              A masterpiece of modern architecture featuring 5 bedrooms, 6 bathrooms, and over 8,000 square feet of refined living space.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-6 py-8 border-y border-champagne/10 animate-fade-in-up stagger-2 opacity-0">
            <div className="text-center space-y-1">
              <p className="font-serif text-2xl sm:text-3xl text-foreground">5</p>
              <p className="text-xs tracking-widest uppercase text-muted-foreground">Bedrooms</p>
            </div>
            <div className="text-center space-y-1">
              <p className="font-serif text-2xl sm:text-3xl text-foreground">6</p>
              <p className="text-xs tracking-widest uppercase text-muted-foreground">Bathrooms</p>
            </div>
            <div className="text-center space-y-1">
              <p className="font-serif text-2xl sm:text-3xl text-foreground">8,200</p>
              <p className="text-xs tracking-widest uppercase text-muted-foreground">Sq. Ft.</p>
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-4 animate-fade-in-up stagger-3 opacity-0">
            <p className="text-sm text-muted-foreground">
              Explore the property and use the tabs below to discover premium features and invite friends.
            </p>
          </div>
        </div>
      </div>

      {/* Gamification HUD */}
      <GamificationHUD userName={firstName} propId={propId} />
    </div>
  )
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================

export default function OpenHouseExperience() {
  const searchParams = useSearchParams()
  const propId = searchParams.get("propId") || ""
  
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [visitorName, setVisitorName] = useState("")

  const handleCheckIn = async (name: string, email: string) => {
    setVisitorName(name)
    setIsCheckedIn(true)
    
    try {
      await fetch("/api/signals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          signal_type: "check_in",
          prop_id: propId,
          name,
          email,
          timestamp: new Date().toISOString(),
        }),
      })
    } catch (error) {
      console.error("Failed to send check-in signal:", error)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      {!isCheckedIn ? (
        <WelcomeScreen onComplete={handleCheckIn} />
      ) : (
        <ExperienceScreen userName={visitorName} propId={propId} />
      )}
    </main>
  )
}
