import React from 'react'
import ShortenForm from '../ShortenForm'

export default function Create({ token }){
  return (
    <div className="page-grid">
      <div className="card">
        <h2>Create your link</h2>
        <p className="page-subtitle">Fill in the original URL and optionally add a custom ID or expiration time.</p>
      </div>
      <ShortenForm token={token} />
    </div>
  )
}
