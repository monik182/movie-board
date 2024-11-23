import React from 'react'

type SessionIdContextType = {
  sessionId: string
  setSessionId: React.Dispatch<React.SetStateAction<string>>
}

export const SessionIdContext = React.createContext<SessionIdContextType | undefined>(undefined)

export const useSessionIdContext = () => {
  const context = React.useContext(SessionIdContext)
  if (!context) {
    throw new Error('useSessionId must be used within a SessionIdProvider')
  }
  return context
}

export const SessionIdProvider = ({ children }: { children: JSX.Element }) => {
  const [sessionId, setSessionId] = React.useState<string>(() => {
    const sessionId = localStorage.getItem('sessionId')
    if (sessionId) {
      return sessionId
    }
    const array = new Uint32Array(4)
    window.crypto.getRandomValues(array)
    const newSessionId = array.join('-')
    localStorage.setItem('sessionId', newSessionId)
    return newSessionId
  })

  return (
    <SessionIdContext.Provider value={{ sessionId, setSessionId }}>
      {children}
    </SessionIdContext.Provider>
  )
}

