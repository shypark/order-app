import { NavLink } from 'react-router-dom'
import './Header.css'

export default function Header() {
  return (
    <header className="header">
      <div className="header-brand">COZY</div>
      <nav className="header-nav">
        <NavLink
          to="/"
          className={({ isActive }) => `header-tab ${isActive ? 'header-tab--active' : ''}`}
          end
        >
          주문하기
        </NavLink>
        <NavLink
          to="/admin"
          className={({ isActive }) => `header-tab ${isActive ? 'header-tab--active' : ''}`}
        >
          관리자
        </NavLink>
      </nav>
    </header>
  )
}
