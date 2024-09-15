import { ChangeEvent, useContext, useEffect, useRef, useState } from 'react'
import { PlayerControlContext } from '../../context/PlayerControlContext.tsx'
import { Track } from '../TrackList/TrackList.tsx'
import { formatMilliseconds } from '../../util/CdPlayerUtil.ts'
import styles from './controlarea.module.css'
import { List, Pause, Play, SkipBack, SkipForward, Square } from 'lucide-react'

export const ControlArea = () => {
  const hasInitialized = useRef(false)
  useEffect(() => {
    if (!hasInitialized.current) {
      onInit()
      hasInitialized.current = true
    }
  }, [])

  const playerContext = useContext(PlayerControlContext)
  if (!playerContext) {
    return
  }
  const { state, dispatch } = playerContext

  function onInit () {
    f().catch(() => {
    })

    async function f () {
      const availableDriveLetters = await window.mci.getDriveLetters()
      dispatch({ type: 'SET_AVAILABLE_DRIVE_LETTERS', payload: ['--', ...availableDriveLetters] })
    }
  }

  const [isBusy, setIsBusy] = useState(false)
  const playable = state.trackList.length > 0
  const handleSelectDriveLetter = async (driveLetter: string) => {
    setIsBusy(true)
    try {
      if (state.timerId) {
        clearInterval(state.timerId)
        dispatch({ type: 'SET_TIMER_ID', payload: null })
        await window.mci.closeCd()
        dispatch({ type: 'SET_PLAY_STATE', payload: 'stopped' })
      }

      dispatch({ type: 'SET_ACTIVE_DRIVE_LETTER', payload: driveLetter })

      if (!driveLetter || driveLetter === '--') {
        dispatch({ type: 'SET_TRACK_LIST', payload: [] })
        setIsBusy(false)
        return
      }
      if (!(await window.mci.isCdInserted(driveLetter))) {
        dispatch({ type: 'SET_TRACK_LIST', payload: [] })
        setIsBusy(false)
        return
      }

      await window.mci.openCd(driveLetter)

      const trackCount = await window.mci.getTrackCount()

      let trackLengthList: number[] = []
      for (let i = 0; i < trackCount; i++) {
        trackLengthList = [...trackLengthList, await window.mci.getTrackLength(i + 1)]
      }

      let trackList: Track[] = []
      trackList = trackLengthList.map((length, i) => {
        return {
          id: i + 1,
          name: `Track ${i + 1}`,
          duration: formatMilliseconds(length),
          isPlaying: false,
        }
      })
      dispatch({ type: 'SET_TRACK_LIST', payload: trackList })

      const lastTrackDuration = trackLengthList[trackLengthList.length - 1]
      const timerId = setInterval(async () => {
        try {
          if (driveLetter != null && driveLetter !== '--' && !await window.mci.isCdInserted(driveLetter)) {
            return
          }
          const currentPosition = await window.mci.getCurrentPosition()
          const currentTrackNumber = await window.mci.getCurrentTrackNumber()
          const totalTrackCount = await window.mci.getTrackCount()
          const currentTrackDuration = await window.mci.getTrackLength(currentTrackNumber)

          if (currentTrackNumber === totalTrackCount && formatMilliseconds(lastTrackDuration) === formatMilliseconds(currentPosition)) {
            dispatch({ type: 'SET_PLAY_STATE', payload: 'stopped' })
          }

          dispatch({ type: 'SET_CURRENT_POSITION', payload: currentPosition })
          dispatch({ type: 'SET_CURRENT_DURATION', payload: currentTrackDuration })
          dispatch({ type: 'SET_CURRENT_TRACK_NUMBER', payload: currentTrackNumber })
          dispatch({ type: 'SET_TOTAL_TRACK_COUNT', payload: totalTrackCount })
        } catch (e) {
          console.error(e)
        }
      }, 16)
      dispatch({ type: 'SET_TIMER_ID', payload: timerId })
      setIsBusy(false)
    } catch (e) {
      console.error(e)
      dispatch({ type: 'SET_TRACK_LIST', payload: [] })
      setIsBusy(false)
    }
  }

  return (
    <div className={styles.controlAreaInner}>
      <div className={styles.selectDriveArea}>
        <select
          disabled={isBusy} className={styles.driveLetter} onChange={(event: ChangeEvent<HTMLSelectElement>) => {
            handleSelectDriveLetter(event.target.value).catch((e => console.error(e)))
          }}
        >
          {
            state.availableDriveLetters.map((letter) => (<option key={letter} value={letter}>{letter}</option>))
          }
        </select>
      </div>

      <div className={styles.buttonArea}>
        <button
          className={styles.controlButton} onClick={() => {
            const position = state.currentTrackPosition
            const currentTrackNumber = state.currentTrackNumber

            if (currentTrackNumber === 1) {
              window.mci.play(currentTrackNumber).catch((e => console.error(e)))
              return
            }

            if (position >= 2000) {
              window.mci.play(currentTrackNumber).catch((e => console.error(e)))
            } else {
              window.mci.play(currentTrackNumber - 1).catch((e => console.error(e)))
            }
          }}
          disabled={state.playState === 'stopped' || !playable}
        ><SkipBack size={10} />
        </button>
        <button
          disabled={!playable} className={styles.controlButton} onClick={() => {
            switch (state.playState) {
              case 'playing':
                dispatch({ type: 'SET_PLAY_STATE', payload: 'paused' })
                window.mci.pause().catch(() => {
                // rollback
                  dispatch({ type: 'SET_PLAY_STATE', payload: 'playing' })
                })
                break
              case 'stopped':
                dispatch({ type: 'SET_PLAY_STATE', payload: 'playing' })
                window.mci.play(state.currentTrackNumber).catch(() => {
                // rollback
                  dispatch({ type: 'SET_PLAY_STATE', payload: 'stopped' })
                })
                break
              case 'paused':
                dispatch({ type: 'SET_PLAY_STATE', payload: 'playing' })
                window.mci.resume().catch(() => {
                // rollback
                  dispatch({ type: 'SET_PLAY_STATE', payload: 'paused' })
                })
                break
            }
          }}
        > {state.playState === 'playing' ? <Pause size={10} /> : <Play size={10} />}
        </button>
        <button
          className={styles.controlButton} onClick={() => {
            const currentTrackNumber = state.currentTrackNumber
            if (currentTrackNumber === state.totalTrackCount) {
              return
            }
            window.mci.play(currentTrackNumber + 1).catch((e => console.error(e)))
          }}
          disabled={state.playState === 'stopped' || !playable}
        ><SkipForward size={10} />
        </button>
        <button
          className={styles.controlButton} onClick={() => {
            window.mci.stop().catch(() => {
            })
            dispatch({ type: 'SET_PLAY_STATE', payload: 'stopped' })
          }}
          disabled={state.playState === 'stopped' || !playable}
        >
          <Square size={10} />
        </button>
        <button
          className={styles.controlButton} onClick={() => {
            if (state.activeDriveLetter) {
              window.mci.ejectCd(state.activeDriveLetter).catch(() => {
              })
              dispatch({ type: 'SET_PLAY_STATE', payload: 'stopped' })
            }
          }}
        >⏏
        </button>
        <button
          className={styles.controlButton} onClick={() => {
            window.electron.toggleCompactMode()
          }}
        ><List size={10} />
        </button>
      </div>
    </div>
  )
}
