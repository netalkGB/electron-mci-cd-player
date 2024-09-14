import React, { createContext, useReducer, ReactNode } from 'react'
import { controlReducer, initialState, ControlState, Action } from '../reducer/ControlReducer.tsx'

interface PlayerContextProps {
  state: ControlState
  dispatch: React.Dispatch<Action>
}

export const PlayerControlContext = createContext<PlayerContextProps | undefined>(undefined)

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(controlReducer, initialState)

  return (
    <PlayerControlContext.Provider value={{ state, dispatch }}>
      {children}
    </PlayerControlContext.Provider>
  )
}
