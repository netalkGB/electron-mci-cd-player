import { useState, KeyboardEvent, useRef, useEffect, useImperativeHandle, forwardRef } from 'react'
import { Play } from 'lucide-react'
import styles from './tracklist.module.css'

export type Track = {
  id: number;
  name: string;
  duration: string;
  isPlaying: boolean;
}

type TrackListProps = {
  onTrackSelect: (track: Track) => void;
  trackList: Track[];
}

export const TrackList = forwardRef(({ onTrackSelect, trackList }: TrackListProps, ref) => {
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null)
  const [isKeyboardScrolling, setIsKeyboardScrolling] = useState(false)

  const trackRefs = useRef<(HTMLDivElement | null)[]>([])
  const listRef = useRef<HTMLDivElement | null>(null)

  useImperativeHandle(ref, () => ({
    setSelectedTrack: (track: Track | null) => {
      setSelectedTrack(track)

      if (track) {
        const currentIndex = trackList.findIndex((t) => t.id === track.id)
        if (currentIndex !== -1 && trackRefs.current[currentIndex]) {
          trackRefs.current[currentIndex]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
        }
      }
    },
  }))

  useEffect(() => {
    if (selectedTrack && isKeyboardScrolling) {
      const currentIndex = trackList.findIndex((track) => track.id === selectedTrack.id)
      if (currentIndex !== -1 && trackRefs.current[currentIndex]) {
        trackRefs.current[currentIndex]?.scrollIntoView({ behavior: 'instant', block: 'nearest' })
      }
    }
  }, [selectedTrack, trackList, isKeyboardScrolling])

  const handleTrackClick = (track: Track) => {
    setSelectedTrack(track)
  }

  const handleTrackDoubleClick = (track: Track) => {
    onTrackSelect(track)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setIsKeyboardScrolling(true)

    if (!selectedTrack) return

    const currentIndex = trackList.findIndex((track) => track.id === selectedTrack.id)
    if (event.key === 'ArrowDown' && currentIndex < trackList.length - 1) {
      setSelectedTrack(trackList[currentIndex + 1])
    } else if (event.key === 'ArrowUp' && currentIndex > 0) {
      setSelectedTrack(trackList[currentIndex - 1])
    } else if (event.key === 'Enter') {
      onTrackSelect(selectedTrack)
    }
  }

  const handleWheel = () => {
    setIsKeyboardScrolling(false)
  }

  return (
    <div
      className={styles.trackList}
      onKeyDown={handleKeyDown}
      onWheel={handleWheel}
      tabIndex={0}
      ref={listRef}
    >
      {trackList.map((track, index) => (
        <div
          key={track.id}
          ref={(el) => (trackRefs.current[index] = el)}
          className={`${styles.track} ${selectedTrack?.id === track.id ? styles.selected : ''}`}
          onClick={() => handleTrackClick(track)}
          onDoubleClick={() => handleTrackDoubleClick(track)}
        >
          <div className={styles.trackNumber}>
            <div>{track.isPlaying && <Play size={8} className={styles.playIcon} />}</div>
            <div>{index + 1}</div>
          </div>
          <div className={styles.trackName}>{track.name}</div>
          <div className={styles.trackDuration}>{track.duration}</div>
        </div>
      ))}
    </div>
  )
})

TrackList.displayName = 'TrackList'
