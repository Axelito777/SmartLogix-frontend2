import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import TopBar from '../../components/TopBar'

const API = 'http://localhost:8080'

/* ── Icons ── */
const IconDollar = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"/>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
)
const IconReceipt = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z"/>
    <line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="14" y2="14"/>
  </svg>
)
const IconArrowUp = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="19" x2="12" y2="5"/>
    <polyline points="5 12 12 5 19 12"/>
  </svg>
)
const IconClock = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
)
const IconSearch = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)
const IconFilter = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="6" x2="20" y2="6"/>
    <line x1="8" y1="12" x2="16" y2="12"/>
    <line x1="11" y1="18" x2="13" y2="18"/>
  </svg>
)
const IconCreditCard = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
    <line x1="1" y1="10" x2="23" y2="10"/>
  </svg>
)

function Pagos() {
  const [pagos, setPagos]       = useState([])
  const [busqueda, setBusqueda] = useState('')
  const navigate = useNavigate()

  const token   = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    axios.get(`${API}/api/pagos`, { headers }).then(r => setPagos(r.data)).catch(() => {})
  }, [])

  /* ── lógica existente ── */
  const totalRecaudado = pagos.reduce((acc, p) => acc + (p.monto || 0), 0)
  const pagoMasAlto    = pagos.length > 0 ? Math.max(...pagos.map(p => p.monto || 0)) : 0
  const ultimoPago     = pagos.length > 0 ? pagos[pagos.length - 1]?.createdAt?.slice(0, 10) : '-'

  const summaryCards = [
    { label: 'Total recaudado', value: `$${totalRecaudado.toLocaleString()}`, valueColor: '#34d399', iconBg: 'rgba(52,211,153,0.12)',   iconColor: '#34d399', icon: <IconDollar />  },
    { label: 'Total de pagos',  value: pagos.length,                          valueColor: '#22d3ee', iconBg: 'rgba(34,211,238,0.12)',   iconColor: '#22d3ee', icon: <IconReceipt /> },
    { label: 'Pago más alto',   value: `$${pagoMasAlto.toLocaleString()}`,    valueColor: '#fbbf24', iconBg: 'rgba(251,191,36,0.12)',   iconColor: '#fbbf24', icon: <IconArrowUp /> },
    { label: 'Último pago',     value: ultimoPago,                             valueColor: '#a78bfa', iconBg: 'rgba(167,139,250,0.12)',  iconColor: '#a78bfa', icon: <IconClock />   },
  ]
  /* ──────────────────────── */

  const term = busqueda.toLowerCase()
  const pagosFiltrados = pagos.filter(p =>
    (p.id?.toString().toLowerCase().includes(term)) ||
    (p.pedidoId?.toLowerCase().includes(term)) ||
    (p.metodoPago?.toLowerCase().includes(term))
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#0f172a', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <TopBar />

      <main style={{ flex: 1, padding: '2rem 2.5rem', overflowY: 'auto' }}>

        {/* ── Page header ── */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '22px', fontWeight: '500', color: '#f1f5f9', margin: 0 }}>Pagos</h1>
          <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0' }}>Historial de pagos recibidos</p>
        </div>

        {/* ── Metric cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '1.5rem' }}>
          {summaryCards.map((s, i) => (
            <div
              key={i}
              style={{
                background: '#1e293b',
                borderRadius: '10px',
                border: '0.5px solid rgba(255,255,255,0.06)',
                padding: '18px 20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748b', margin: 0 }}>
                  {s.label}
                </p>
                <div style={{
                  width: '32px', height: '32px',
                  borderRadius: '8px',
                  background: s.iconBg,
                  color: s.iconColor,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {s.icon}
                </div>
              </div>
              <p style={{ fontSize: '26px', fontWeight: '500', color: s.valueColor, margin: 0, lineHeight: 1 }}>
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* ── Toolbar ── */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#475569', display: 'flex' }}>
              <IconSearch />
            </span>
            <input
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              placeholder="Buscar pago..."
              style={{
                width: '100%',
                padding: '9px 12px 9px 36px',
                background: '#1e293b',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '8px',
                color: '#e2e8f0',
                fontSize: '13px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <button
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '9px 14px',
              background: '#1e293b',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '8px',
              color: '#94a3b8',
              fontSize: '13px',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <IconFilter />
            Filtros
          </button>
        </div>

        {/* ── Table ── */}
        <div style={{
          background: '#1e293b',
          borderRadius: '10px',
          border: '0.5px solid rgba(255,255,255,0.06)',
          overflow: 'hidden',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['ID Pago', 'Pedido', 'Monto', 'Método', 'Fecha'].map(col => (
                  <th
                    key={col}
                    style={{
                      textAlign: 'left',
                      padding: '12px 20px',
                      fontSize: '11px',
                      fontWeight: '500',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      color: '#64748b',
                      borderBottom: '0.5px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pagosFiltrados.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    style={{ padding: '3rem', textAlign: 'center', color: '#475569', fontSize: '13px' }}
                  >
                    {busqueda ? 'Sin resultados para tu búsqueda' : 'No hay pagos registrados'}
                  </td>
                </tr>
              ) : (
                pagosFiltrados.map((p, idx) => (
                  <tr key={p.id}>
                    <td style={{
                      padding: '13px 20px',
                      fontSize: '13px',
                      fontWeight: '500',
                      color: '#e2e8f0',
                      borderBottom: idx < pagosFiltrados.length - 1 ? '0.5px solid rgba(255,255,255,0.04)' : 'none',
                    }}>
                      #{p.id?.toString().slice(0, 8)}
                    </td>
                    <td style={{
                      padding: '13px 20px',
                      fontSize: '13px',
                      color: '#94a3b8',
                      borderBottom: idx < pagosFiltrados.length - 1 ? '0.5px solid rgba(255,255,255,0.04)' : 'none',
                    }}>
                      {p.pedidoId}
                    </td>
                    <td style={{
                      padding: '13px 20px',
                      fontSize: '13px',
                      fontWeight: '500',
                      color: '#34d399',
                      borderBottom: idx < pagosFiltrados.length - 1 ? '0.5px solid rgba(255,255,255,0.04)' : 'none',
                    }}>
                      ${p.monto?.toLocaleString()}
                    </td>
                    <td style={{
                      padding: '13px 20px',
                      borderBottom: idx < pagosFiltrados.length - 1 ? '0.5px solid rgba(255,255,255,0.04)' : 'none',
                    }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '5px',
                        background: 'rgba(99,102,241,0.12)',
                        color: '#a78bfa',
                        borderRadius: '5px',
                        padding: '3px 9px',
                        fontSize: '11px',
                        fontWeight: '500',
                      }}>
                        <IconCreditCard />
                        {p.metodoPago}
                      </span>
                    </td>
                    <td style={{
                      padding: '13px 20px',
                      fontSize: '13px',
                      color: '#64748b',
                      borderBottom: idx < pagosFiltrados.length - 1 ? '0.5px solid rgba(255,255,255,0.04)' : 'none',
                    }}>
                      {p.createdAt?.slice(0, 10)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}

export default Pagos
