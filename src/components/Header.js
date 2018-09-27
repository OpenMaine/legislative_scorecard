import React from 'react'
import { Link, NavLink } from 'react-router-dom'

export default function Header(props) {
  return (
    
    <div className="afl_header">
      <img src="/theme/header.png" />
      
      <nav className="afl_menu">
        <NavLink to="/legislators" activeClassName="active">Legislators</NavLink>
        <NavLink to="/bills" activeClassName="active">Bills</NavLink>
        <NavLink to="/all-scores" activeClassName="active">All Scores</NavLink>
        <NavLink to="/about" activeClassName="active">About</NavLink>
      </nav>
    </div>
  )
}
