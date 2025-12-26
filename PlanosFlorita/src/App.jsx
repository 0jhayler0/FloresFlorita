import { useState } from 'react'

import PlanForm from './components/PlanForm'
import floritaIcon from './assets/floritaIcon.png'

import './styles/App.css'

function App() {

  return (
    <>
    <div className='appContainer'>
      <header>
      <img src={floritaIcon} alt="Florita Logo" />  
      <h1>Flores Llanogrande Florita S.A.S</h1>
      </header>
      <div className='formContainer'>
        <PlanForm />
      </div>
    </div>
    </>
  )
}

export default App
