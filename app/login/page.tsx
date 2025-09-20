"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useGame } from "@/components/game-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Lock, Mail, Zap } from "lucide-react"
import { loginWithEmailPassword } from "@/lib/firebase-auth"
import { getTeamInfo } from "@/lib/firebase-db"

export default function LoginPage() {
  const router = useRouter()
  const { setTeamName } = useGame()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Attempt Firebase login
      const result = await loginWithEmailPassword({ email, password })
      
      if (result.success && result.user) {
        // Get team info from existing data
        const teamInfo = await getTeamInfo(result.user.uid)
        
        let teamName = ""
        if (teamInfo) {
          teamName = teamInfo.teamName
        } else {
          // If no team info exists, use email prefix as fallback
          teamName = email.split('@')[0] + "'s Team"
        }
        
        // Set team name in game context
        setTeamName(teamName)
        
        // Navigate to start page
        router.push("/start")
      } else {
        setError(result.error || "Login failed")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <Card className="w-full max-w-md relative z-10 border border-cyan-500/20 bg-black/40 backdrop-blur-xl shadow-[0_0_60px_rgba(6,182,212,0.3)]">
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 opacity-50 blur-xl" />

        <CardHeader className="text-center pb-8 relative">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 flex items-center justify-center border border-cyan-400/30">
            <Zap className="w-8 h-8 text-cyan-400" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Access Terminal
          </CardTitle>
          <p className="text-sm text-gray-400 mt-2">Enter your credentials to proceed</p>
        </CardHeader>

        <CardContent className="space-y-6 relative">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-cyan-300 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-black/50 border-cyan-500/30 text-white placeholder-gray-500 focus:border-cyan-400 focus:ring-cyan-400/20 pl-4 pr-4"
                  placeholder="user@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-cyan-300 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Access Code
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-black/50 border-cyan-500/30 text-white placeholder-gray-500 focus:border-cyan-400 focus:ring-cyan-400/20 pl-4 pr-4"
                  placeholder="Enter access code"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-400 hover:via-purple-400 hover:to-pink-400 text-white font-semibold rounded-lg shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Initialize Access
                </div>
              )}
            </Button>
          </form>


        </CardContent>
      </Card>
    </main>
  )
}
