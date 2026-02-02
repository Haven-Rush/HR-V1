"use client"

import { useState } from "react"
import { ArrowRight } from "lucide-react"

interface CheckInFormProps {
  onComplete: (name: string, email: string) => void
}

export function CheckInForm({ onComplete }: CheckInFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [focused, setFocused] = useState<"name" | "email" | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return

    setIsSubmitting(true)
    // Simulate a brief delay for the premium feel
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
