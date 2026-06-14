const BASE = import.meta.env.VITE_BASE_URL

async function apiFetch(path, options = {}){
  const token = localStorage.getItem('token')
  const refreshToken = localStorage.getItem('refreshToken')
  options.headers = options.headers || {}
  options.headers['Content-Type'] = options.headers['Content-Type'] || 'application/json'
  if(token) options.headers['Authorization'] = `Bearer ${token}`

  let res = await fetch(BASE + path, options)
  if(res.status === 401 && refreshToken){
    // try refresh
    const r = await fetch(BASE + '/users/refresh', {
      method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ refreshToken })
    })
    if(r.ok){
      const d = await r.json()
      if(d.token){
        localStorage.setItem('token', d.token)
        options.headers['Authorization'] = `Bearer ${d.token}`
        res = await fetch(BASE + path, options)
      }
    }
  }
  return res
}

export default apiFetch
