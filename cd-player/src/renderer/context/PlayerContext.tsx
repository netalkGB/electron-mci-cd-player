import React, { createContext, useReducer, ReactNode } from 'react'
import { playerReducer, initialState, PlayerState, Action } from '../reducer'

interface PlayerContextProps {
  state: PlayerState
  dispatch: React.Dispatch<Action>
}

export const PlayerContext = createContext<PlayerContextProps | undefined>(undefined)

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(playerReducer, initialState)

  return (
    <PlayerContext.Provider value={{ state, dispatch }}>
      {children}
    </PlayerContext.Provider>
  )
}