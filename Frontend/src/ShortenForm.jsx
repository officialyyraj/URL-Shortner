import React, { useState } from 'react'
import apiFetch from './api'

export default function ShortenForm({ token }){
  const [originalUrl,setOriginalUrl]=useState('')
  const [customId,setCustomId]=useState('')
  const [expireIn,setExpireIn]=useState('')
  const [result,setResult]=useState(null)
  const [message,setMessage]=useState(null)
  const [loading,setLoading]=useState(false)

  const submit = async (e)=>{
    e.preventDefault()
    setMessage(null)
    setResult(null)
    setLoading(true)
    try{
      const payload = { originalUrl: originalUrl.trim() }
      if(customId.trim()) payload.customId = customId.trim()
      if(expireIn) payload.expireIn = Number(expireIn)

      const res = await apiFetch('/shortner', {
          method: 'POST',
          body: JSON.stringify(payload)
        })
      const data = await res.json()
      if(!res.ok){
        setMessage(data.message || (data.errors && data.errors.map(e=>e.msg).join(', ')) || 'Failed')
      } else {
        setResult(data.shortUrl)
      }
    } catch(err){
      setMessage('Network error: '+err.message)
    } finally { setLoading(false) }
  }

  return (
    <div className="card">
      <form onSubmit={submit} className="form">
        <label>Original URL
          <input value={originalUrl} onChange={e=>setOriginalUrl(e.target.value)} placeholder="https://example.com" required />
        </label>

        <label>Custom ID (optional)
          <input value={customId} onChange={e=>setCustomId(e.target.value)} placeholder="my-id" />
        </label>

        <label>Expire in hours (optional)
          <input type="number" value={expireIn} onChange={e=>setExpireIn(e.target.value)} min="1" />
        </label>

        <div className="actions">
          <button className="btn primary" disabled={loading || !token}>{loading? 'Creating...':'Create Short URL'}</button>
          <button type="button" className="btn" onClick={()=>{setOriginalUrl('');setCustomId('');setExpireIn('');setResult(null);setMessage(null)}}>Clear</button>
        </div>
      </form>

      {!token && (
        <div className="card message error">You must be logged in to create short URLs.</div>
      )}

      {message && <div className="card message error">{message}</div>}
      {result && (
        <div className="card message success">
          <div className="short">{result}</div>
          <div className="actions">
            <button className="btn" onClick={()=>navigator.clipboard.writeText(result)}>Copy</button>
            <a className="btn" href={result} target="_blank" rel="noreferrer">Open</a>
          </div>
        </div>
      )}
    </div>
  )
}
