import { useState } from 'react'

import PlanForm from './components/PlanForm'
import HamburgerMenu from './components/HamburgerMenu'
import ErasForm from './components/ErasForm'
import VarietiesForm from './components/VarietiesForm'
import floritaIcon from './assets/floritaIcon.png'

import './styles/App.css'

function App() {
  const [activeView, setActiveView] = useState('main')

  const handleMenuItemClick = (action) => {
    if (action === 'edit-eras') {
      setActiveView('eras')
    } else if (action === 'edit-varieties') {
      setActiveView('varieties')
    }
  }

  return (
    <>
    <div className='appContainer'>
      <header>
        <img src={floritaIcon} alt="Florita Logo" />  
        <h1>Flores Llanogrande Florita S.A.S</h1>
        <HamburgerMenu onMenuItemClick={handleMenuItemClick} />
      </header>
      <div className='formContainer'>
        {activeView === 'main' && <PlanForm />}
        {activeView === 'eras' && <ErasForm onClose={() => setActiveView('main')} />}
        {activeView === 'varieties' && <VarietiesForm onClose={() => setActiveView('main')} />}
      </div>
    </div>
    </>
  )
}

export default App
