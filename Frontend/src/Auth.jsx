import React, { useState } from 'react'

const BASE = import.meta.env.VITE_BASE_URL || 'http://localhost:5000'

export default function Auth({ onLogin }){
  const [mode,setMode]=useState('login') // 'login' or 'register'
  const [username,setUsername]=useState('')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [loading,setLoading]=useState(false)
  const [message,setMessage]=useState(null)

  const submit = async (e)=>{
    e.preventDefault()
    setMessage(null)
    setLoading(true)
    try{
      const url = mode==='login' ? `${BASE}/users/login` : `${BASE}/users/register`
      const payload = mode==='login' ? { email, password } : { username, email, password }
      const res = await fetch(url,{
        method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload)
      })
      const data = await res.json()
      if(!res.ok){
        setMessage(data.message || (data.errors && data.errors.map(e=>e.msg).join(', ')) || 'Auth failed')
      } else {
        if(data.token){
          onLogin(data.token)
        } else {
          setMessage('No token returned')
        }
      }
    } catch(err){
      setMessage('Network: '+err.message)
    } finally { setLoading(false) }
  }

  return (
    <div style={{display:'inline-block'}}>
      <button className="btn" onClick={()=>setMode('login')}>Login</button>
      <button className="btn" onClick={()=>setMode('register')}>Register</button>

      <div style={{marginTop:8, minWidth:320}} className="card">
        <form onSubmit={submit}>
          {mode==='register' && (
            <label>Username
              <input value={username} onChange={e=>setUsername(e.target.value)} required={mode==='register'} />
            </label>
          )}
          <label>Email
            <input value={email} onChange={e=>setEmail(e.target.value)} type="email" required />
          </label>
          <label>Password
            <input value={password} onChange={e=>setPassword(e.target.value)} type="password" required />
          </label>
          <div className="actions">
            <button className="btn primary">{loading? 'Please wait': (mode==='login'?'Login':'Register')}</button>
          </div>
        </form>
        {message && <div className="message error">{message}</div>}
      </div>
    </div>
  )
}
