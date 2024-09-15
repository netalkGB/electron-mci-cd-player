import styles from './titlebar.module.css'
import { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface TitleBarProps {
  className?: string
}

export const TitleBar = ({ className }: TitleBarProps) => {
  const [focused, setFocused] = useState(true)

  let isFirst = true
  useEffect(() => {
    if (!isFirst) {
      return
    }
    window.electronHandler.onWindowBlur((): void => {
      setFocused(false)
    })

    window.electronHandler.onWindowFocus((): void => {
      setFocused(true)
    })

    isFirst = false
  }, [])
  return (
    <div className={`${className} ${styles.container} ${focused ? styles.focused : styles.unfocused}`}>
      <div className={styles.controlArea}>
        <div>
          <button className={styles.button} onClick={() => window.electron.showMenu()}><ChevronDown size={8} /></button>
          <span>Electron MCI CD Player</span>
        </div>
        <div>
          <button className={styles.button} onClick={() => window.electron.minimize()}>-</button>
          <button className={styles.button} onClick={() => window.electron.close()}>x</button>
        </div>
      </div>
    </div>
  )
}
