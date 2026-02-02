"use client"

import { useState } from "react"
import { CheckInForm } from "@/components/check-in-form"
import { GamificationHUD } from "@/components/gamification-hud"

export default function OpenHouseExperience() {
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [visitorName, setVisitorName] = useState("")

  const handleCheckIn = (name: string, email: string) => {
    setVisitorName(name)
    setIsCheckedIn(true)
    
    // Store visitor data for the agent portal
    const visitors = JSON.parse(localStorage.getItem("openhouse-visitors") || "[]")
    const newVisitor = {
      id: Date.now().toString(),
      name,
      email,
      checkedInAt: new Date().toISOString(),
      engagementScore: Math.floor(Math.random() * 40) + 10,
      featuresFound: 0,
      referralsSent: 0,
    }
    localStorage.setItem("openhouse-visitors", JSON.stringify([...visitors, newVisitor]))
  }

  return (
    <main className="min-h-screen bg-background">
      {!isCheckedIn ? (
        <WelcomeScreen onComplete={handleCheckIn} />
      ) : (
        <ExperienceScreen userName={visitorName} />
      )}
    </main>
  )
}

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

function ExperienceScreen({ userName }: { userName: string }) {
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
      <GamificationHUD userName={firstName} />
    </div>
  )
}
