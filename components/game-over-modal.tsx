"use client"

import { useRouter } from "next/navigation"
import { useGame } from "@/components/game-context"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Clock, Trophy, Zap, AlertTriangle } from "lucide-react"

export default function GameOverModal() {
  const router = useRouter()
  const { state, formatTime } = useGame()
  
  const isOpen = state.gameStatus === 'completed' || state.gameStatus === 'timeout'
  const isTimeout = state.gameStatus === 'timeout'

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-md mx-auto bg-gradient-to-br from-black/90 via-gray-900/90 to-black/90 border border-cyan-500/20 backdrop-blur-xl">
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 opacity-50 blur-xl" />
        
        <DialogHeader className="text-center pb-6 relative">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 flex items-center justify-center border border-cyan-400/30">
            {isTimeout ? (
              <AlertTriangle className="w-8 h-8 text-red-400" />
            ) : (
              <Trophy className="w-8 h-8 text-yellow-400" />
            )}
          </div>
          
          <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            {isTimeout ? "Time's Up!" : "Congratulations!"}
          </DialogTitle>
          
          <p className="text-gray-400 mt-2">
            {isTimeout ? "The round has ended due to timeout" : "You've completed the round!"}
          </p>
        </DialogHeader>

        <div className="space-y-6 relative">
          {/* Game Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-400/20">
              <div className="flex items-center justify-center mb-2">
                <Zap className="w-5 h-5 text-cyan-400 mr-2" />
                <span className="text-sm text-cyan-300">Final Score</span>
              </div>
              <div className="text-2xl font-bold text-white">{state.score}</div>
            </div>
            
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-400/20">
              <div className="flex items-center justify-center mb-2">
                <Clock className="w-5 h-5 text-purple-400 mr-2" />
                <span className="text-sm text-purple-300">Time Used</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {formatTime((parseInt(process.env.NEXT_PUBLIC_ROUND_TIME_LIMIT || '30') * 60) - state.timeRemaining)}
              </div>
            </div>
          </div>

          {/* Performance Summary */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-black/40 to-gray-900/40 border border-gray-600/20">
            <h3 className="text-lg font-semibold text-white mb-3">Performance Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-300">Correct Answers:</span>
                <span className="text-green-400 font-semibold">
                  {state.answers.filter(a => a.correct).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Wrong Answers:</span>
                <span className="text-red-400 font-semibold">
                  {state.answers.filter(a => !a.correct).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Rooms Unlocked:</span>
                <span className="text-blue-400 font-semibold">
                  {state.maxRoomUnlocked}/10
                </span>
              </div>
            </div>
          </div>

          {/* Fragment Status */}
          {!isTimeout && state.hasFragment && (
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-400/20">
              <Badge className="mb-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 border-yellow-400/30">
                {state.fragmentEarned ? "Fragment Earned!" : "No Fragment"}
              </Badge>
              <p className="text-sm text-gray-300">
                {state.fragmentEarned 
                  ? "You've earned a code fragment for your performance!" 
                  : "Keep practicing to earn code fragments!"}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
