import { useContext } from 'react'
import { PlayerControlContext } from '../../context/PlayerControlContext.tsx'
import { formatMilliseconds } from '../../util/CdPlayerUtil.ts'

export const TrackInfoArea = () => {
  const playerContext = useContext(PlayerControlContext)
  if (!playerContext) {
    return
  }
  const { state } = playerContext
  const playable = state.trackList.length > 0

  const formattedCurrentTrackPosition = formatMilliseconds(state.currentTrackPosition)
  const formattedCurrentTrackDuration = formatMilliseconds(state.currentTrackDuration)

  if (!playable || state.playState === 'stopped') {
    return (
      <>
        <div>Track: {state.trackList.length <= 0 ? '--' : state.currentTrackNumber}/{state.trackList.length <= 0 ? '--' : state.totalTrackCount}</div>
        <div>--:-- / --:--</div>
      </>
    )
  } else {
    return (
      <>
        <div>Track: {state.currentTrackNumber}/{state.totalTrackCount}</div>
        <div>{formattedCurrentTrackPosition} / {formattedCurrentTrackDuration}</div>
      </>
    )
  }
}
