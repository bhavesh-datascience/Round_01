import { signInWithEmailAndPassword, User } from 'firebase/auth'
import { auth } from './firebase'

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResult {
  success: boolean
  user?: User
  error?: string
}

export const loginWithEmailPassword = async (credentials: LoginCredentials): Promise<AuthResult> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password)
    return {
      success: true,
      user: userCredential.user
    }
  } catch (error: any) {
    let errorMessage = 'An error occurred during login'
    
    // Handle specific Firebase auth errors
    switch (error.code) {
      case 'auth/user-not-found':
        errorMessage = 'No account found with this email address'
        break
      case 'auth/wrong-password':
        errorMessage = 'Incorrect password'
        break
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address'
        break
      case 'auth/user-disabled':
        errorMessage = 'This account has been disabled'
        break
      case 'auth/too-many-requests':
        errorMessage = 'Too many failed attempts. Please try again later'
        break
      case 'auth/network-request-failed':
        errorMessage = 'Network error. Please check your connection'
        break
      default:
        errorMessage = error.message || errorMessage
    }
    
    return {
      success: false,
      error: errorMessage
    }
  }
}

export const getCurrentUser = (): User | null => {
  return auth.currentUser
}
