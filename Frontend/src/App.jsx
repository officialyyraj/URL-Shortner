import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Create from './pages/Create'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import ProtectedRoute from './components/ProtectedRoute'

export default function App(){
  const [token, setToken] = useState(null)

  useEffect(()=>{
    const t = localStorage.getItem('token')
    if(t) setToken(t)
  },[])

  const onLogin = (t)=>{
    localStorage.setItem('token', t)
    setToken(t)
  }
  const onLogout = ()=>{
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    setToken(null)
  }

  return (
    <BrowserRouter>
      <div className="app">
        <header className="header">
          <h1>URL Shortener</h1>
          <p className="muted">Create short, memorable links in seconds</p>
          <nav className="nav-bar">
            <Link to="/" className="btn nav-btn">Home</Link>
            <Link to="/create" className="btn nav-btn">Create</Link>
            {token ? (
              <>
                <Link to="/profile" className="btn nav-btn">Profile</Link>
                <button className="btn nav-btn" onClick={onLogout}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn nav-btn">Login</Link>
                <Link to="/register" className="btn nav-btn outline">Register</Link>
              </>
            )}
          </nav>
        </header>

        <main className="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<ProtectedRoute><Create token={token} /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/login" element={<Login onLogin={onLogin} />} />
            <Route path="/register" element={<Register onLogin={onLogin} />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
