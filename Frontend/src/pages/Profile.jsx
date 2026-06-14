import React, { useEffect, useState } from 'react'
import apiFetch from '../api'

export default function Profile(){
  const [urls,setUrls]=useState([])
  const [loading,setLoading]=useState(true)
  const [error,setError]=useState(null)

  useEffect(()=>{
    let mounted = true
    ;(async ()=>{
      try{
        const res = await apiFetch('/users/urls')
        const data = await res.json()
        if(!res.ok) throw new Error(data.message||'Failed')
        if(mounted) setUrls(data.urls||[])
      }catch(err){ setError(err.message) }
      finally{ if(mounted) setLoading(false) }
    })()
    return ()=> mounted = false
  },[])

  if(loading) return <div className="card">Loading...</div>
  if(error) return <div className="card message error">{error}</div>

  const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:5000'

  return (
    <div>
      <h2>Your URLs</h2>
      {urls.length===0 && <div className="card">No URLs yet</div>}
      {urls.map(u=> (
        <div key={u._id} className="card">
          <div className="short">{baseUrl}/shortner/{u.shortId}</div>
          <div>Original: {u.originalUrl}</div>
          <div>Clicks: {u.clicks}</div>
          <div>Created: {new Date(u.createdAt).toLocaleString()}</div>
          {u.expireAt && <div>Expires: {new Date(u.expireAt).toLocaleString()}</div>}
        </div>
      ))}
    </div>
  )
}
