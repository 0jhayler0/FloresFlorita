import { useState } from 'react'
import '../styles/HamburgerMenu.css'

function HamburgerMenu({ onMenuItemClick }) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const handleMenuItemClick = (action) => {
    if (onMenuItemClick) {
      onMenuItemClick(action)
    }
    setIsOpen(false)
  }

  return (
    <div className="hamburger-container">
      <button 
        className={`hamburger-btn ${isOpen ? 'active' : ''}`}
        onClick={toggleMenu}
        aria-label="Menu"
      >
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
      </button>
      
      {isOpen && (
        <nav className="hamburger-menu">
          <ul>
            <li>
              <button 
                className="menu-item"
                onClick={() => handleMenuItemClick('edit-varieties')}
              >
                Editar Variedades
              </button>
            </li>
            <li>
              <button 
                className="menu-item"
                onClick={() => handleMenuItemClick('edit-eras')}
              >
                Editar Eras
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  )
}

export default HamburgerMenu
