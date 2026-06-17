import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import TopBar from '../../components/TopBar'

const API = 'http://localhost:8080'

const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12l5 5L20 7"/>
  </svg>
)
const IconTruck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" rx="1"/>
    <path d="M16 8h4l3 3v5h-7V8z"/>
    <circle cx="5.5" cy="18.5" r="2.5"/>
    <circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
)
const IconAlert = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
)
const IconX = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)
const IconChecks = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 12 6 17 17 6"/>
    <polyline points="8 12 13 17 22 8"/>
  </svg>
)

const TIPO_CONFIG = {
  creado:  { icon: <IconCheck />, bg: 'rgba(52,211,153,0.12)',  color: '#34d399' },
  entrega: { icon: <IconTruck />, bg: 'rgba(99,102,241,0.15)',  color: '#a78bfa' },
  alerta:  { icon: <IconAlert />, bg: 'rgba(245,158,11,0.12)',  color: '#fbbf24' },
  error:   { icon: <IconX />,     bg: 'rgba(239,68,68,0.12)',   color: '#f87171' },
}

function getTipo(mensaje) {
  const m = (mensaje || '').toLowerCase()
  if (m.includes('entregado') || m.includes('enviado') || m.includes('en camino') || m.includes('despachado')) return 'entrega'
  if (m.includes('alerta') || m.includes('advertencia') || m.includes('stock') || m.includes('bajo')) return 'alerta'
  if (m.includes('error') || m.includes('cancelado') || m.includes('fallo')) return 'error'
  return 'creado'
}

function NotifCard({ n, leida }) {
  const cfg = TIPO_CONFIG[getTipo(n.mensaje)]

  return (
    <div
      style={{
        background: '#1e293b',
        borderRadius: '10px',
        border: '0.5px solid rgba(255,255,255,0.06)',
        padding: '14px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        ...(leida ? {} : { borderLeft: '2px solid #6366f1' }),
      }}
    >
      <div
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          background: cfg.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: cfg.color,
          flexShrink: 0,
        }}
      >
        {cfg.icon}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: '13px', fontWeight: '500', color: '#e2e8f0' }}>
          {n.mensaje}
        </p>
        <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#64748b' }}>
          Usuario: {n.usuarioId}
        </p>
      </div>

      <div
        style={{
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '6px',
        }}
      >
        <span style={{ fontSize: '11px', color: '#475569' }}>
          {n.fechaEnvio?.slice(0, 10)}
        </span>
        {!leida && (
          <span
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: '#6366f1',
            }}
          />
        )}
      </div>
    </div>
  )
}

function Notificaciones() {
  const [notificaciones, setNotificaciones] = useState([])
  const [leidasSet, setLeidasSet]           = useState(new Set())
  const navigate = useNavigate()

  const token   = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    axios.get(`${API}/api/notificaciones`, { headers }).then(r => setNotificaciones(r.data)).catch(() => {})
  }, [])

  const marcarTodasLeidas = () => {
    setLeidasSet(new Set(notificaciones.map(n => n.id)))
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: '#0f172a',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <TopBar />

      <main style={{ flex: 1, padding: '2rem 2.5rem', overflowY: 'auto' }}>

        {/* Cabecera */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: '1.75rem',
          }}
        >
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: '500', color: '#f1f5f9', margin: 0 }}>
              Notificaciones
            </h1>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0' }}>
              Historial de notificaciones del sistema
            </p>
          </div>

          <button
            onClick={marcarTodasLeidas}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              padding: '8px 14px',
              background: '#1e293b',
              border: '0.5px solid rgba(255,255,255,0.08)',
              borderRadius: '8px',
              color: '#94a3b8',
              fontSize: '13px',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <IconChecks />
            Marcar todas como leídas
          </button>
        </div>

        {/* Lista */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {notificaciones.length === 0 ? (
            <div
              style={{
                background: '#1e293b',
                border: '0.5px solid rgba(255,255,255,0.06)',
                borderRadius: '10px',
                padding: '2.5rem',
                textAlign: 'center',
                color: '#475569',
                fontSize: '13px',
              }}
            >
              No hay notificaciones
            </div>
          ) : (
            notificaciones.map(n => (
              <NotifCard key={n.id} n={n} leida={leidasSet.has(n.id)} />
            ))
          )}
        </div>

      </main>
    </div>
  )
}

export default Notificaciones
