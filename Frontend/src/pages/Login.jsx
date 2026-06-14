import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const BASE = import.meta.env.VITE_BASE_URL

export default function Login({ onLogin }){
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [loading,setLoading]=useState(false)
  const [message,setMessage]=useState(null)
  const [messageType,setMessageType]=useState('error')

  const submit = async (e)=>{
    e.preventDefault()
    setMessage(null)
    setMessageType('error')
    setLoading(true)
    try{
      const res = await fetch(`${BASE}/users/login`,{
        method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})
      })
      const contentType = res.headers.get('content-type') || ''
      const data = contentType.includes('application/json') ? await res.json() : null
      if(!res.ok){
        const errorMessage = data?.message || data?.errors?.map(e=>e.msg).join(', ') || `Login failed (${res.status})`
        setMessage(errorMessage)
      } else {
        if(data.token){
          localStorage.setItem('refreshToken', data.refreshToken || '')
          setMessageType('success')
          setMessage('Login successful!')
          onLogin(data.token)
        }
        else setMessage('No token received')
      }
    } catch(err){ setMessage('Network: '+err.message) }
    finally{ setLoading(false) }
  }

  return (
    <div className="card">
      <h3>Login</h3>
      <form onSubmit={submit} className="auth-form">
        <label>Email
          <input
            value={email}
            onChange={e=>setEmail(e.target.value)}
            required
            type="email"
            placeholder="you@example.com"
          />
        </label>
        <label>Password
          <input
            value={password}
            onChange={e=>setPassword(e.target.value)}
            required
            type="password"
            placeholder="••••••••"
          />
        </label>
        <div className="actions">
          <button className="btn primary">{loading? 'Logging in...':'Login'}</button>
        </div>
      </form>
      <p className="hint">Don't have an account? <Link to="/register">Register here</Link>.</p>
      {message && <div className={`message ${messageType}`}>{message}</div>}
    </div>
  )
}
