import styles from './content.module.css'
// import { Play, Pause, SkipBack, SkipForward, Disc, List } from 'lucide-react';
import { List, Play, SkipBack, SkipForward } from 'lucide-react'
import { Track, TrackList } from '../TrackList/TrackList.tsx'
import { forwardRef, useRef } from 'react'

export const Content = () => {
  const trackListRef = useRef<{ setSelectedTrack: (track: Track) => void }>(null)

  const selectTrack = (track: Track) => {
    if (trackListRef.current) {
      trackListRef.current.setSelectedTrack(track)
    }
  }

  // @ts-expect-error Property 'selectTrack' does not exist on type 'Window & typeof globalThis'.
  window.selectFirstTrack = () => { selectTrack(getList()[0]) }

  const TrackListArea = createTrackListArea()
  return (
    <div className={styles.content}>
      <div className={styles.container}>
        <div className={styles.trackInfoArea}>
          <TrackInfoArea />
        </div>
        <div className={styles.controlArea}>
          <ControlArea />
        </div>
        <div className={styles.trackListArea}>
          <TrackListArea ref={trackListRef} />
        </div>
      </div>
    </div>
  )
}

function TrackInfoArea () {
  return (
    <>
      <div>Track: 1/10</div>
      <div>2:10 / 3:35</div>
    </>
  )
}

function ControlArea () {
  return (

    <div className={styles.controlAreaInner}>
      <div className={styles.selectDriveArea}>
        <select className={styles.driveLetter}>
          <option value='D:'>D:</option>
          <option value='D:'>E:</option>
          <option value='D:'>F:</option>
          <option value='D:'>G:</option>
        </select>
      </div>

      <div className={styles.buttonArea}>
        <button
          className={styles.controlButton} onClick={() => {
          }}
        ><SkipBack size={10} />
        </button>
        <button
          className={styles.controlButton} onClick={() => {
          }}
        ><Play size={10} />
        </button>
        <button
          className={styles.controlButton} onClick={() => {
          }}
        ><SkipForward size={10} />
        </button>
        <button
          className={styles.controlButton} onClick={() => {
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

function createTrackListArea () {
  const TrackListArea = forwardRef((_props, trackListRef) => {
    return (
      <>
        <TrackList ref={trackListRef} trackList={getList()} onTrackSelect={(d) => { console.log(d) }} />
      </>
    )
  })
  TrackListArea.displayName = 'TrackListArea'
  return TrackListArea
}

function getList (): Track[] {
  return [
    { id: 1, name: 'Track 1', duration: '3:35', isPlaying: true },
    { id: 2, name: 'Track 2', duration: '3:33', isPlaying: false },
    { id: 3, name: 'Track 3', duration: '4:26', isPlaying: false },
    { id: 4, name: 'Track 4', duration: '3:37', isPlaying: false },
    { id: 5, name: 'Track 5', duration: '4:00', isPlaying: false },
    { id: 6, name: 'Track 6', duration: '3:49', isPlaying: false },
    { id: 7, name: 'Track 7', duration: '3:15', isPlaying: false },
    { id: 8, name: 'Track 8', duration: '3:55', isPlaying: false },
    { id: 9, name: 'Track 9', duration: '1:33', isPlaying: false },
    { id: 10, name: 'Track 10', duration: '3:21', isPlaying: false },
  ]
}
