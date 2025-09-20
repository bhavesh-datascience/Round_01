import { ref, set, get } from 'firebase/database'
import { database } from './firebase'
import { User } from 'firebase/auth'

export interface TeamInfo {
  teamName: string
}

export interface Round1Data {
  started_at?: string
  score: number
  finished_at?: string
}

const getCurrentTimeISO = () => {
  return (
    new Date()
      .toLocaleString("sv-SE", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
      .replace(" ", "T") + "+05:30"
  )
}

export const createUserTeamData = async (user: User, teamName: string): Promise<void> => {
  try {
    // Don't alter anything inside info - it already has teamName
    // Only work with round1 data when needed
    console.log('User team data access - info already exists with teamName')
  } catch (error) {
    console.error('Error accessing user team data:', error)
    throw error
  }
}

export const createRound1Data = async (userId: string): Promise<void> => {
  try {
    // Create round1 data with Asia/Kolkata timezone when game starts
    const round1Ref = ref(database, `teams/${userId}/round1`)
    await set(round1Ref, {
      started_at: getCurrentTimeISO(),
      score: 0
    })
  } catch (error) {
    console.error('Error creating round1 data:', error)
    throw error
  }
}

export const updateRound1Score = async (userId: string, score: number): Promise<void> => {
  try {
    const round1ScoreRef = ref(database, `teams/${userId}/round1/score`)
    await set(round1ScoreRef, score)
  } catch (error) {
    console.error('Error updating round1 score:', error)
    throw error
  }
}

export const finishRound1 = async (userId: string, finalScore: number): Promise<void> => {
  try {
    // Create finished_at timestamp with Asia/Kolkata timezone
    const round1Ref = ref(database, `teams/${userId}/round1`)
    const currentData = await get(round1Ref)
    await set(round1Ref, {
      started_at: currentData.val()?.started_at,
      score: finalScore,
      finished_at: getCurrentTimeISO()
    })
  } catch (error) {
    console.error('Error finishing round1:', error)
    throw error
  }
}

export const getTeamInfo = async (userId: string): Promise<TeamInfo | null> => {
  try {
    const teamInfoRef = ref(database, `teams/${userId}/info`)
    const snapshot = await get(teamInfoRef)
    
    if (snapshot.exists()) {
      return snapshot.val() as TeamInfo
    }
    return null
  } catch (error) {
    console.error('Error getting team info:', error)
    return null
  }
}

export const getRound1Data = async (userId: string): Promise<Round1Data | null> => {
  try {
    const round1Ref = ref(database, `teams/${userId}/round1`)
    const snapshot = await get(round1Ref)
    
    if (snapshot.exists()) {
      return snapshot.val() as Round1Data
    }
    return null
  } catch (error) {
    console.error('Error getting round1 data:', error)
    return null
  }
}
