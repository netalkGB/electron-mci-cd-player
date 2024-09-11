import { Track } from '../component/TrackList/TrackList.tsx'

export interface ControlState {
  totalTrackCount: number;
  currentTrackNumber: number;
  currentTrackPosition: number;
  currentTrackDuration: number;
  playState: 'playing' | 'paused' | 'stopped';
  availableDriveLetters: string[];
  activeDriveLetter: string | null;
  // eslint-disable-next-line no-undef
  timerId: NodeJS.Timeout | null;
  trackList: Track[];
}

export const initialState: ControlState = {
  totalTrackCount: 0,
  currentTrackNumber: 1,
  currentTrackPosition: 0,
  currentTrackDuration: 0,
  playState: 'stopped',
  availableDriveLetters: ['--'],
  activeDriveLetter: null,
  timerId: null,
  trackList: [],
}

export type Action =
  | { type: 'SET_TOTAL_TRACK_COUNT'; payload: number }
  | { type: 'SET_CURRENT_TRACK_NUMBER'; payload: number }
  | { type: 'SET_CURRENT_POSITION'; payload: number }
  | { type: 'SET_CURRENT_DURATION'; payload: number }
  | { type: 'SET_TOTAL_TRACK_LENGTH'; payload: number }
  | { type: 'SET_PLAY_STATE'; payload: 'playing' | 'paused' | 'stopped' }
  | { type: 'SET_AVAILABLE_DRIVE_LETTERS'; payload: string[] }
  | { type: 'SET_ACTIVE_DRIVE_LETTER'; payload: string }
  // eslint-disable-next-line no-undef
  | { type: 'SET_TIMER_ID'; payload: NodeJS.Timeout | null }
  | { type: 'SET_TRACK_LIST'; payload: Track[] }

export const controlReducer = (state: ControlState, action: Action): ControlState => {
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
    case 'SET_AVAILABLE_DRIVE_LETTERS':
      return { ...state, availableDriveLetters: action.payload }
    case 'SET_ACTIVE_DRIVE_LETTER':
      return { ...state, activeDriveLetter: action.payload }
    case 'SET_TIMER_ID':
      return { ...state, timerId: action.payload }
    case 'SET_TRACK_LIST':
      return { ...state, trackList: action.payload }
    default:
      return state
  }
}
