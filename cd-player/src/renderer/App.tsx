import './App.css'
import Main from './component/Main.tsx'
import { Suspense } from 'react'

export default function App () {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Main />
    </Suspense>
  )
}
