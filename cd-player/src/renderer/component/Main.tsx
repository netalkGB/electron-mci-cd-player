import { TitleBar } from './TitleBar/TitleBar.tsx'
import styles from './main.module.css'
import { Content } from './Content/Content.tsx'

function Main () {
  return (
    <div className={styles.container}>
      <div className={`${styles.titleBar}`}>
        <TitleBar />
      </div>
      <div className={`${styles.content}`}>
        <Content />
      </div>
    </div>
  )
}

export default Main
