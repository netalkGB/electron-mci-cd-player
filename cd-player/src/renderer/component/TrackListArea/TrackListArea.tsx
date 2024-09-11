import { useContext, useEffect, useRef, useState } from 'react'
import { PlayerControlContext } from '../../context/PlayerControlContext.tsx'
import { Track, TrackList } from '../TrackList/TrackList.tsx'

export const TrackListArea = () => {
  const playerContext = useContext(PlayerControlContext)
  if (!playerContext) {
    return
  }

  const trackListRef = useRef<{ setSelectedTrack: (track: Track) => void }>(null)

  const [trackList, setTrackList] = useState<Track[]>([])
  // eslint-disable-next-line no-undef
  const timerIdRef = useRef<NodeJS.Timeout | null>(null)

  const playingTrack = trackList.find(t => t.isPlaying) ?? null

  useEffect(() => {
    const updateTrackList = async () => {
      if (playerContext.state.activeDriveLetter === null || playerContext.state.activeDriveLetter === '--' || !await window.mci.isCdInserted(playerContext.state.activeDriveLetter)) {
        setTrackList([])
        await window.mci.stop()
        return
      }
      if (playerContext.state.trackList.length <= 0) {
        setTrackList([])
        await window.mci.stop()
        return
      }
      try {
        const currentTrackNumber = await window.mci.getCurrentTrackNumber()
        setTrackList(playerContext.state.trackList.map((track) => {
          return {
            ...track,
            isPlaying: track.id === currentTrackNumber,
          }
        }))
      } catch (e) {
        console.error(e)
      }
    }
    timerIdRef.current = setInterval(updateTrackList, 20)

    return () => {
      if (timerIdRef.current) {
        clearInterval(timerIdRef.current)
      }
    }
  }, [playerContext.state.activeDriveLetter, playerContext.state.trackList])

  useEffect(() => {
    if (trackListRef && trackListRef.current) {
      trackListRef.current.setSelectedTrack(playingTrack || trackList[0])
    }
  }, [playingTrack?.id, playerContext.state.activeDriveLetter])

  return (
    <>
      <TrackList
        ref={trackListRef}
        trackList={trackList}
        onTrackSelect={(track: Track) => {
          playerContext.dispatch({ type: 'SET_PLAY_STATE', payload: 'playing' })
          window.mci.play(track.id).catch(() => { /* TODO: implements error fallback */ })
        }}
      />
    </>
  )
}
