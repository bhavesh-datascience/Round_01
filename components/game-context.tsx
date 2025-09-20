"use client"

import type React from "react"
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import useSWR from "swr"
import { onAuthStateChanged, User } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { createRound1Data, updateRound1Score, finishRound1 } from "@/lib/firebase-db"

type Question = {
  id: number
  prompt: string
  options: string[]
  correctIndex: number
  isTrap: boolean
}

type LevelData = {
  level: number
  questions: Question[]
}

type QuestionsData = {
  levels: LevelData[]
}

type AnswerLog = {
  room: number
  door: number
  doorGlobalIndex: number
  questionId: number
  prompt: string
  options: string[]
  correctIndex: number
  selectedIndex: number
  correct: boolean
  doorType: "trap" | "normal"
  deltaScore: number
  answeredAt: string
}

type GameState = {
  teamName: string
  startTime?: string
  endTime?: string
  score: number
  answers: AnswerLog[]
  answeredDoorIds: number[]
  maxRoomUnlocked: number
  hasFragment?: boolean
  fragmentEarned?: boolean
  timeRemaining: number
  gameStatus: 'not_started' | 'playing' | 'completed' | 'timeout'
}

type GameContextValue = {
  gameName: string
  tagline: string
  state: GameState
  questions: Question[]
  currentUser: User | null
  setTeamName: (name: string) => void
  startGame: () => Promise<void>
  finishGame: (reason?: 'completed' | 'timeout') => Promise<void>
  answerDoor: (args: { room: number; door: number; doorGlobalIndex: number; selectedIndex: number }) => void
  isDoorAnswered: (doorGlobalIndex: number) => boolean
  resetGame: () => void
  sessionJson: () => any
  maxRoomUnlocked: number
  timeRemaining: number
  formatTime: (seconds: number) => string
}

const STORAGE_KEY = "fragment-forge-state"
const fetcher = (url: string) => fetch(url).then((r) => r.json())

const ROUND_TIME_LIMIT = parseInt(process.env.NEXT_PUBLIC_ROUND_TIME_LIMIT || '30') * 60 // Convert minutes to seconds

const defaultState: GameState = {
  teamName: "",
  score: 0,
  answers: [],
  answeredDoorIds: [],
  maxRoomUnlocked: 0,
  hasFragment: false,
  fragmentEarned: false,
  timeRemaining: ROUND_TIME_LIMIT,
  gameStatus: 'not_started',
}

const GameContext = createContext<GameContextValue | null>(null)

export function GameProvider({ children }: { children: React.ReactNode }) {
  const { data: questionsData = { levels: [] } } = useSWR<QuestionsData>("/data/questions.json", fetcher)
  const [state, setState] = useState<GameState>(defaultState)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const loadedRef = useRef(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
    })

    return () => unsubscribe()
  }, [])

  // Timer effect
  useEffect(() => {
    if (state.gameStatus === 'playing' && state.timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setState(prevState => {
          const newTimeRemaining = prevState.timeRemaining - 1
          
          if (newTimeRemaining <= 0) {
            // Time's up - finish game with timeout
            finishGame('timeout')
            return {
              ...prevState,
              timeRemaining: 0,
              gameStatus: 'timeout'
            }
          }
          
          return {
            ...prevState,
            timeRemaining: newTimeRemaining
          }
        })
      }, 1000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [state.gameStatus, state.timeRemaining])

  // Generate questions array from levels, selecting randomly based on room level
  const questions = useMemo(() => {
    const allQuestions: Question[] = []
    const maxDoors = 50 // 10 rooms * 5 doors each

    for (let doorIndex = 0; doorIndex < maxDoors; doorIndex++) {
      const roomNumber = Math.floor(doorIndex / 5) + 1 // Rooms 1-10
      const levelIndex = Math.min(roomNumber - 1, (questionsData?.levels?.length ?? 0) - 1) // Map room to level (0-based)
      const levelData = questionsData?.levels?.[levelIndex]

      if (levelData && levelData.questions && levelData.questions.length > 0) {
        // Randomly select a question from this level
        const randomIndex = doorIndex;
        allQuestions.push(levelData.questions[randomIndex])
      } else {
        // Fallback if no questions available for this level
        allQuestions.push({
          id: doorIndex + 1,
          prompt: "Question not available",
          options: ["Option 1", "Option 2", "Option 3", "Option 4"],
          correctIndex: 0,
          isTrap: false
        })
      }
    }

    return allQuestions
  }, [questionsData])

  // Load persisted session
  useEffect(() => {
    if (loadedRef.current) return
    loadedRef.current = true
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setState(JSON.parse(raw))
    } catch {}
  }, [])

  // Persist session
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {}
  }, [state])

  const setTeamName = useCallback((name: string) => setState((s) => ({ ...s, teamName: name })), [])

  const startGame = useCallback(async () => {
    setState((s) => ({
      ...s,
      score: 0,
      answers: [],
      answeredDoorIds: [],
      startTime: new Date().toISOString(),
      endTime: undefined,
      maxRoomUnlocked: 1,
      // Reset fragment tracking
      hasFragment: false,
      fragmentEarned: false,
      timeRemaining: ROUND_TIME_LIMIT,
      gameStatus: 'playing',
    }));

    // Create round1 data in Firebase when game starts
    if (currentUser) {
      try {
        await createRound1Data(currentUser.uid)
      } catch (error) {
        console.error('Error creating round1 data:', error)
      }
    }
  }, [currentUser]);

  const finishGame = useCallback(async (reason: 'completed' | 'timeout' = 'completed') => {
    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    setState((s) => {
      const endTime = new Date().toISOString()
      const startTime = new Date(s.startTime || Date.now())
      const totalMinutes = (new Date(endTime).getTime() - startTime.getTime()) / (1000 * 60)

      // Calculate if user gets fragment based on specification
      const correctAnswers = s.answers.filter((a) => a.correct).length
      const highScore = correctAnswers >= 40 // 200-250 points (40+ correct * 5 points)
      const lowScore = correctAnswers < 40 // 150-200 points (less than 40 correct)

      let fragmentEarned = false

      // Fragment conditions from specification (only if completed, not timeout)
      if (reason === 'completed') {
        if (totalMinutes >= 10 && totalMinutes <= 15 && highScore) {
          fragmentEarned = true // Condition 1
        } else if (totalMinutes >= 15 && totalMinutes <= 20 && lowScore) {
          fragmentEarned = false // Condition 2
        } else if (totalMinutes >= 20 && totalMinutes <= 25 && highScore) {
          fragmentEarned = true // Condition 3
        } else if (totalMinutes >= 20 && totalMinutes <= 25 && lowScore) {
          fragmentEarned = false // Condition 4
        }
      }

      // Update Firebase with final score and finished_at timestamp
      if (currentUser) {
        finishRound1(currentUser.uid, s.score).catch(error => {
          console.error('Error finishing round1 in Firebase:', error)
        })
      }

      return {
        ...s,
        endTime,
        hasFragment: reason === 'completed',
        fragmentEarned,
        gameStatus: reason,
      }
    })
  }, [currentUser]);

  const answerDoor: GameContextValue["answerDoor"] = useCallback(({ room, door, doorGlobalIndex, selectedIndex }) => {
    if (!questions.length) return
    if (state.answeredDoorIds.includes(doorGlobalIndex)) return;
    const q = questions[doorGlobalIndex]
    if (!q) return
    const correct = selectedIndex === q.correctIndex
    const isTrap = q.isTrap
    const delta = correct ? 5 : isTrap ? -5 : 0

    const log: AnswerLog = {
      room,
      door,
      doorGlobalIndex,
      questionId: q.id,
      prompt: q.prompt,
      options: q.options,
      correctIndex: q.correctIndex,
      selectedIndex,
      correct,
      doorType: isTrap ? "trap" : "normal",
      deltaScore: delta,
      answeredAt: new Date().toISOString(),
    }

    setState((s) => {
      const nextAnswered = [...s.answeredDoorIds, doorGlobalIndex]
      const roomStart = (room - 1) * 5
      const completedInRoom = nextAnswered.filter((id) => id >= roomStart && id < roomStart + 5).length === 5
      const nextUnlocked = completedInRoom ? Math.max(s.maxRoomUnlocked, Math.min(10, room + 1)) : s.maxRoomUnlocked
      const newScore = s.score + delta

      // Update Firebase score in real-time
      if (currentUser) {
        updateRound1Score(currentUser.uid, newScore).catch(error => {
          console.error('Error updating score in Firebase:', error)
        })
      }

      return {
        ...s,
        score: newScore,
        answers: [...s.answers, log],
        answeredDoorIds: nextAnswered,
        maxRoomUnlocked: nextUnlocked,
      }
    })
  }, [questions, state.answeredDoorIds, currentUser]);

  const isDoorAnswered = useCallback((doorGlobalIndex: number) => state.answeredDoorIds.includes(doorGlobalIndex), [state.answeredDoorIds]);

  const resetGame = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    setState(defaultState)
  }, []);

  const formatTime = useCallback((seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }, []);

  const sessionJson = useCallback(() => ({
    gameName: "Fragment Forge",
    tagline: "Where the first piece of the ultimate code is shaped.",
    teamName: state.teamName,
    startTime: state.startTime,
    endTime: state.endTime,
    totalScore: state.score,
    answers: state.answers,
    hasFragment: state.hasFragment,
    fragmentEarned: state.fragmentEarned,
  }), [state]);

  const value: GameContextValue = useMemo(
    () => ({
      gameName: "Fragment Forge",
      tagline: "Where the first piece of the ultimate code is shaped.",
      state,
      questions,
      currentUser,
      setTeamName,
      startGame,
      finishGame,
      answerDoor,
      isDoorAnswered,
      resetGame,
      sessionJson,
      maxRoomUnlocked: state.maxRoomUnlocked,
      timeRemaining: state.timeRemaining,
      formatTime,
    }), // eslint-disable-next-line react-hooks/exhaustive-deps
    [state, questions, currentUser, setTeamName, startGame, finishGame, answerDoor, isDoorAnswered, resetGame, sessionJson, formatTime]
  )

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error("useGame must be used within GameProvider")
  return ctx
}
