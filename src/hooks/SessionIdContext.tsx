import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useQueryParams } from './useQueryParams'

type SessionIdContextType = {
  sessionId: string | null
}

export const SessionIdContext = createContext<SessionIdContextType | undefined>(undefined)

export const useSessionIdContext = () => {
  const context = useContext(SessionIdContext)
  if (!context) {
    throw new Error('useSessionId must be used within a SessionIdProvider')
  }
  return context
}

export const SessionIdProvider = ({ children }: { children: JSX.Element }) => {
  const params = useQueryParams()
  const hasInitialized = useRef(false)
  const [sessionId, setSessionId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const sessionExpiry = localStorage.getItem('sessionExpiry')
      const now = new Date().getTime()

      if (sessionExpiry && now > parseInt(sessionExpiry)) {
        return null
      }
      return localStorage.getItem('sessionId')
    }
    return null
  })

  useEffect(() => {
    if (hasInitialized.current) return
    hasInitialized.current = true
    
    if (!sessionId) {
      const now = new Date().getTime()
      const array = new Uint32Array(4)
      window.crypto.getRandomValues(array)
      const newSessionId = array.join('-')
      console.log('New session ID:', newSessionId)

      localStorage.setItem('sessionId', newSessionId)
      localStorage.setItem('sessionExpiry', (now + 30 * 24 * 60 * 60 * 1000).toString())
      setSessionId(newSessionId)
    }
  }, [sessionId])

  useEffect(() => { 
    const id = params.get('id');
    console.log('Setting session ID from param:', id)

    if (id) {
      localStorage.setItem('sessionId', id)
      localStorage.setItem('sessionExpiry', (new Date().getTime() + 30 * 24 * 60 * 60 * 1000).toString())
    }
  }, [params])

  return (
    <SessionIdContext.Provider value={{ sessionId }}>
      {children}
    </SessionIdContext.Provider>
  )
}
