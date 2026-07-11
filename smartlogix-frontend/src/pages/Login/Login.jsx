import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = ''

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
    } catch {
      setError('Correo o contraseña incorrectos')
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    background: 'rgba(124,58,237,0.1)',
    border: '1px solid rgba(124,58,237,0.25)',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#e2e8f0',
    outline: 'none',
    boxSizing: 'border-box',
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Glow orbs */}
      <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div
          style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(6,182,212,0.2))',
            border: '1px solid rgba(124,58,237,0.45)',
            borderRadius: '8px',
            padding: '10px 28px',
            marginBottom: '0.75rem',
          }}
        >
          <span style={{ color: '#06b6d4', fontSize: '22px', fontWeight: '800', letterSpacing: '0.12em', textShadow: '0 0 18px rgba(6,182,212,0.5)' }}>SMART</span>
          <span style={{ color: '#7c3aed', fontSize: '22px', fontWeight: '800', letterSpacing: '0.12em', textShadow: '0 0 18px rgba(124,58,237,0.5)' }}>LOGIX</span>
        </div>
        <p style={{ color: 'rgba(200,220,255,0.45)', fontSize: '13px', margin: 0 }}>Sistema de gestión logística</p>
      </div>

      {/* Card */}
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '10px',
          padding: '2.5rem',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
      >
        <h2 style={{ color: 'rgba(200,220,255,0.85)', fontSize: '14px', fontWeight: '600', letterSpacing: '0.08em', margin: '0 0 1.75rem', textAlign: 'center' }}>INICIO DE SESIÓN</h2>

        <div style={{ marginBottom: '14px' }}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={inputStyle}
          />
        </div>

        {error && <p style={{ color: '#ef4444', fontSize: '13px', margin: '0 0 1rem', textAlign: 'center' }}>{error}</p>}

        <button
          onClick={handleLogin}
          style={{
            width: '100%',
            padding: '13px',
            background: 'linear-gradient(135deg, rgba(124,58,237,0.6), rgba(6,182,212,0.45))',
            border: '1px solid rgba(124,58,237,0.45)',
            borderRadius: '6px',
            color: '#e2e8f0',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(124,58,237,0.3)',
          }}
        >
          Ingresar
        </button>
      </div>
    </div>
  )
}

export default Login
