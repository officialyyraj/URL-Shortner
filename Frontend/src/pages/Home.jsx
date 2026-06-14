import React from 'react'
import { Link } from 'react-router-dom'

export default function Home(){
  return (
    <div className="page-hero">
      <div>
        <h2>Fast, secure URL shortening for your links.</h2>
        <p className="page-subtitle">Protect your links behind an account, create custom short IDs, and monitor clicks from your profile.</p>
        <div className="actions">
          <Link to="/create" className="btn primary">Create a Short URL</Link>
          <Link to="/register" className="btn outline">Register</Link>
        </div>
      </div>
      <div className="feature-grid">
        <div className="feature-card">
          <h3>Private creation</h3>
          <p>Log in before shortening links so your URLs are tied to your profile.</p>
        </div>
        <div className="feature-card">
          <h3>Track links</h3>
          <p>See your created URLs, click counts, and expiration dates in one place.</p>
        </div>
        <div className="feature-card">
          <h3>Public redirects</h3>
          <p>Anyone can open shortened links without logging in.</p>
        </div>
      </div>
    </div>
  )
}
