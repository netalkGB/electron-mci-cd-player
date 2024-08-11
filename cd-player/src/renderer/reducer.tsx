export interface PlayerState {
  totalTrackCount: number;
  currentTrackNumber: number;
  currentTrackPosition: number;
  currentTrackDuration: number;
  playState: 'playing' | 'paused' | 'stopped';
  trackList: CdTrack[];
}

export const initialState: PlayerState = {
  totalTrackCount: 0,
  currentTrackNumber: 0,
  currentTrackPosition: 0,
  currentTrackDuration: 0,
  playState: 'stopped',
  trackList: [],
}

export type Action =
  | { type: 'SET_TOTAL_TRACK_COUNT'; payload: number }
  | { type: 'SET_CURRENT_TRACK_NUMBER'; payload: number }
  | { type: 'SET_CURRENT_POSITION'; payload: number }
  | { type: 'SET_CURRENT_DURATION'; payload: number }
  | { type: 'SET_TOTAL_TRACK_LENGTH'; payload: number }
  | { type: 'SET_PLAY_STATE'; payload: 'playing' | 'paused' | 'stopped' }
  | { type: 'SET_TRACK_LIST'; payload: CdTrack[] }

export const playerReducer = (state: PlayerState, action: Action): PlayerState => {
  switch (action.type) {
  case 'SET_TOTAL_TRACK_COUNT':
    return { ...state, totalTrackCount: action.payload }
  case 'SET_CURRENT_TRACK_NUMBER':
    return { ...state, currentTrackNumber: action.payload }
  case 'SET_CURRENT_POSITION':
    return { ...state, currentTrackPosition: action.payload }
  case 'SET_CURRENT_DURATION':
    return { ...state, currentTrackDuration: action.payload }
  case 'SET_PLAY_STATE':
    return { ...state, playState: action.payload }
  case 'SET_TRACK_LIST':
    return { ...state, trackList: action.payload }
  default:
    return state
  }
}

export interface CdTrack {
  number: number;
  length: number;
}