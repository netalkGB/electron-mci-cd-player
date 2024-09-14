import styles from './content.module.css'
import { PlayerProvider } from '../../context/PlayerControlContext.tsx'
import { TrackInfoArea } from '../TrackInfoArea/TrackInfoArea.tsx'
import { ControlArea } from '../ControlArea/ControlArea.tsx'
import { TrackListArea } from '../TrackListArea/TrackListArea.tsx'

export const Content = () => {
  return (
    <div className={styles.content}>
      <div className={styles.container}>
        <PlayerProvider>
          <div className={styles.trackInfoArea}>
            <TrackInfoArea />
          </div>
          <div className={styles.controlArea}>
            <ControlArea />
          </div>
          <div className={styles.trackListArea}>
            <TrackListArea />
          </div>
        </PlayerProvider>
      </div>
    </div>
  )
}
