import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Tablero from './components/tablero/Tablero.jsx';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <main className="zona-tablero">
        <Tablero />
      </main>
      
    </>
  )
}

export default App