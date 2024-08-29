/* eslint-disable */
// @ts-nocheck
import {useContext, useEffect, useState} from 'react'

import './App.css'
import {PlayerContext} from "./context/PlayerContext.tsx";

const formatMilliseconds = (ms) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const milliseconds = ms % 1000;

  const formattedSeconds = seconds.toString().padStart(2, '0');
  const formattedMilliseconds = Math.floor(milliseconds / 10).toString().padStart(2, '0');

  return `${minutes}:${formattedSeconds}.${formattedMilliseconds}`;
}

function App() {
  const { state, dispatch } = useContext(PlayerContext);
  let first = true
  useEffect(() => {
    if (!first) {
      return
    }

    const initialize = async () => {
      console.log(await window.mci.getDriveLetters())
      await window.mci.openCd()

      const trackCount = await window.mci.getTrackCount()
      let trackList: CdTrackp[] = [];
      for (let i = 0; i < trackCount; i++) {
        trackList = [...trackList, {number: i + 1, length: await mci.getTrackLength(i + 1)}]
      }
      dispatch({type: 'SET_TRACK_LIST', payload: trackList})

      setInterval(async () => {
        try {
          dispatch({type: 'SET_CURRENT_POSITION', payload: await window.mci.getCurrentPosition()})
          dispatch({type: 'SET_CURRENT_DURATION', payload: await window.mci.getTrackLength(await window.mci.getCurrentTrackNumber())})
          dispatch({type: 'SET_CURRENT_TRACK_NUMBER', payload: await window.mci.getCurrentTrackNumber()})
          dispatch({type: 'SET_TOTAL_TRACK_COUNT', payload: await window.mci.getTrackCount()})
        } catch (e) {
          console.error(e)
        }
      }, 10)
    }
    initialize()
    first = false
  }, []);



  return (
    <>
      <button onClick={async () => {
        await window.mci.play(state.currentTrackNumber)
        dispatch({type: 'SET_PLAY_STATE', payload: 'playing'})
      }}>Play
      </button>
      <button onClick={async () => {
        if (state.playState === 'paused') {
          await window.mci.resume()
          dispatch({type: 'SET_PLAY_STATE', payload: 'playing'})
          return
        }
        await window.mci.pause()
        dispatch({type: 'SET_PLAY_STATE', payload: 'paused'})
      }}>Pause
      </button>
      <button onClick={async () => {
        await window.mci.stop()
        dispatch({type: 'SET_PLAY_STATE', payload: 'stopped'})
      }}>Stop
      </button>
      <button onClick={async () => {
        const currentTrackNumber = state.currentTrackNumber
        if (currentTrackNumber === 1) {
          return
        }
        await window.mci.play(currentTrackNumber - 1)
      }}>Previous
      </button>
      <button onClick={async () => {
          const currentTrackNumber = state.currentTrackNumber
          if (currentTrackNumber === state.totalTrackCount) {
            return
          }
          await window.mci.play(currentTrackNumber + 1)
        }}>Next
      </button>
      <div>{state.currentTrackNumber}/{state.totalTrackCount}</div>

      {
        state.playState !== 'stopped'
          ? <div>{formatMilliseconds(state.currentTrackPosition)}/{formatMilliseconds(state.currentTrackDuration)}</div>
          : <></>
      }

      <br />
      {
        state.trackList.map((track, idx) => (
          <div key={idx}>
            {state.currentTrackNumber == track.number && state.playState !== 'stopped' ? '→ ' : '　'}
            {track.number}. {formatMilliseconds(track.length)}
          </div>
        ))
      }
    </>
  )
}

export default App
