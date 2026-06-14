React frontend (Vite) for URL Shortener

Commands:

```powershell
cd Frontend
npm install
npm run dev
```

- The app reads backend base URL from `VITE_BASE_URL` env; default is `http://localhost:5000`.
- To set it temporarily on Windows PowerShell:

```powershell
$env:VITE_BASE_URL = 'http://localhost:5000'
npm run dev
```

If you want the backend to serve the built frontend, run `npm run build` and copy `dist` to your server static folder or configure Express to serve it.
