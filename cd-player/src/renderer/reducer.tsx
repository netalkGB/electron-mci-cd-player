export interface PlayerState {
  totalTrackCount: number;
  currentTrackNumber: number;
  currentTrackPosition: number;
  currentTrackDuration: number;
  playState: 'playing' | 'paused' | 'stopped';
  trackList: CdTrack[];
  availableDriveLetters: string[];
  activeDriveLetter: string | null;
  timerId: NodeJS.Timeout | null;
}

export const initialState: PlayerState = {
  totalTrackCount: 0,
  currentTrackNumber: 0,
  currentTrackPosition: 0,
  currentTrackDuration: 0,
  playState: 'stopped',
  trackList: [],
  availableDriveLetters: ['--'],
  activeDriveLetter: null,
  timerId: null,
}

export type Action =
  | { type: 'SET_TOTAL_TRACK_COUNT'; payload: number }
  | { type: 'SET_CURRENT_TRACK_NUMBER'; payload: number }
  | { type: 'SET_CURRENT_POSITION'; payload: number }
  | { type: 'SET_CURRENT_DURATION'; payload: number }
  | { type: 'SET_TOTAL_TRACK_LENGTH'; payload: number }
  | { type: 'SET_PLAY_STATE'; payload: 'playing' | 'paused' | 'stopped' }
  | { type: 'SET_TRACK_LIST'; payload: CdTrack[] }
  | { type: 'SET_AVAILABLE_DRIVE_LETTERS'; payload: string[] }
  | { type: 'SET_ACTIVE_DRIVE_LETTER'; payload: string }
  | { type: 'SET_TIMER_ID'; payload: NodeJS.Timeout | null }

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
  case 'SET_AVAILABLE_DRIVE_LETTERS':
    return { ...state, availableDriveLetters: action.payload }
  case 'SET_ACTIVE_DRIVE_LETTER':
    return { ...state, activeDriveLetter: action.payload }
  case 'SET_TIMER_ID':
    return { ...state, timerId: action.payload }
  default:
    return state
  }
}

export interface CdTrack {
  number: number;
  length: number;
}