import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = 'http://localhost:8080'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Por favor completa todos los campos')
      return
    }
    try {
      const res = await axios.post(`${API}/api/auth/login`, { email, password })
      localStorage.setItem('token', res.data.token)
      navigate('/dashboard')
    } catch (err) {
      setError('Correo o contraseña incorrectos')
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a1628 0%, #0d2d4a 30%, #0a3d3a 60%, #0d2d1e 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(0,180,220,0.15) 0%, transparent 70%)', borderRadius: '50%' }} />
      <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(0,220,150,0.1) 0%, transparent 70%)', borderRadius: '50%' }} />

      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'inline-block', background: 'linear-gradient(135deg, rgba(0,180,220,0.3), rgba(0,100,180,0.2))', border: '1px solid rgba(0,200,255,0.4)', borderRadius: '16px', padding: '8px 24px', marginBottom: '0.5rem' }}>
          <span style={{ color: '#7ef0ff', fontSize: '22px', fontWeight: '700', letterSpacing: '0.15em', textShadow: '0 0 20px rgba(0,200,255,0.5)' }}>SMARTLOGIX</span>
        </div>
        <p style={{ color: 'rgba(150,220,255,0.7)', fontSize: '13px', margin: 0 }}>Sistema de gestión logística</p>
      </div>

      <div style={{
        width: '100%',
        maxWidth: '380px',
        background: 'linear-gradient(135deg, rgba(0,40,80,0.7) 0%, rgba(0,60,60,0.6) 100%)',
        border: '1px solid rgba(0,200,255,0.25)',
        borderRadius: '20px',
        padding: '2rem',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(0,200,255,0.2)'
      }}>
        <h2 style={{ color: '#7ef0ff', fontSize: '15px', fontWeight: '600', letterSpacing: '0.1em', margin: '0 0 1.5rem', textAlign: 'center' }}>INICIO DE SESIÓN</h2>

        <div style={{ marginBottom: '1rem' }}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ width: '100%', padding: '12px 14px', background: 'rgba(0,150,220,0.15)', border: '1px solid rgba(0,200,255,0.3)', borderRadius: '10px', fontSize: '14px', color: '#fff', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ width: '100%', padding: '12px 14px', background: 'rgba(0,150,220,0.15)', border: '1px solid rgba(0,200,255,0.3)', borderRadius: '10px', fontSize: '14px', color: '#fff', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        {error && <p style={{ color: '#ff9999', fontSize: '13px', margin: '0 0 1rem', textAlign: 'center' }}>{error}</p>}

        <button
          onClick={handleLogin}
          style={{ width: '100%', padding: '13px', background: 'linear-gradient(135deg, rgba(0,160,220,0.7), rgba(0,80,180,0.8))', border: '1px solid rgba(0,200,255,0.4)', borderRadius: '10px', color: '#7ef0ff', fontSize: '14px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,150,255,0.3)' }}
        >
          Ingresar
        </button>
      </div>
    </div>
  )
}

export default Login