import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import TopBar from '../../components/TopBar'

const API = 'http://localhost:8080'

/* ── Icons ── */
const IconPackage = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
)
const IconCheck = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)
const IconClock = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
)
const IconLoader = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/>
    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
    <line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/>
    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
  </svg>
)
const IconXMark = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)
const IconChevron = ({ up }) => (
  <svg
    width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
    style={{ transform: up ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.15s ease' }}
  >
    <polyline points="6 9 12 15 18 9"/>
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
const IconPlus = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)
const IconSend = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
)

function Pedidos() {
  const [pedidos, setPedidos]     = useState([])
  const [expandido, setExpandido] = useState(null)
  const [busqueda, setBusqueda]   = useState('')
  const navigate = useNavigate()

  const token   = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    cargarPedidos()
  }, [])

  const cargarPedidos = () => {
    axios.get(`${API}/api/pedidos`, { headers }).then(r => setPedidos(r.data)).catch(() => {})
  }

  const handleDespachar = async (id) => {
    try {
      await axios.put(`${API}/api/pedidos/${id}/estado`, { estado: 'ENTREGADO' }, { headers })
      cargarPedidos()
    } catch {
      alert('Error al actualizar estado')
    }
  }

  const estadoBadge = (estado) => {
    if (estado === 'ENTREGADO')  return { bg: 'rgba(16,185,129,0.15)',  color: '#34d399', icon: <IconCheck />,  texto: 'Entregado'  }
    if (estado === 'EN_PROCESO') return { bg: 'rgba(99,102,241,0.15)',  color: '#a78bfa', icon: <IconLoader />, texto: 'Procesando' }
    if (estado === 'CANCELADO')  return { bg: 'rgba(239,68,68,0.15)',   color: '#f87171', icon: <IconXMark />,  texto: 'Cancelado'  }
    return                              { bg: 'rgba(245,158,11,0.15)',   color: '#fbbf24', icon: <IconClock />,  texto: 'Pendiente'  }
  }

  const term = busqueda.toLowerCase()
  const pedidosFiltrados = pedidos.filter(p =>
    (p.id?.toLowerCase().includes(term)) ||
    (p.clienteId?.toLowerCase().includes(term))
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#0f172a', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <TopBar />

      <main style={{ flex: 1, padding: '2rem 2.5rem', overflowY: 'auto' }}>

        {/* ── Page header ── */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '22px', fontWeight: '500', color: '#f1f5f9', margin: 0 }}>Pedidos</h1>
          <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0' }}>Gestión de pedidos del sistema</p>
        </div>

        {/* ── Toolbar ── */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '1.25rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#475569', display: 'flex' }}>
              <IconSearch />
            </span>
            <input
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              placeholder="Buscar pedido..."
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

        {/* ── List ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {pedidosFiltrados.length === 0 ? (
            <div style={{
              background: '#1e293b',
              border: '0.5px solid rgba(255,255,255,0.06)',
              borderRadius: '10px',
              padding: '3rem',
              textAlign: 'center',
              color: '#475569',
              fontSize: '13px',
            }}>
              {busqueda ? 'Sin resultados para tu búsqueda' : 'No hay pedidos registrados'}
            </div>
          ) : (
            pedidosFiltrados.map(p => {
              const badge  = estadoBadge(p.estado)
              const abierto = expandido === p.id
              return (
                <div
                  key={p.id}
                  style={{
                    background: '#1e293b',
                    borderRadius: '10px',
                    border: abierto
                      ? '0.5px solid rgba(99,102,241,0.3)'
                      : '0.5px solid rgba(255,255,255,0.06)',
                    overflow: 'hidden',
                    transition: 'border-color 0.15s ease',
                  }}
                >
                  {/* ── Card row ── */}
                  <div
                    onClick={() => setExpandido(abierto ? null : p.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '14px 18px',
                      cursor: 'pointer',
                    }}
                  >
                    {/* Icon square */}
                    <div style={{
                      width: '36px', height: '36px',
                      borderRadius: '8px',
                      background: 'rgba(99,102,241,0.15)',
                      color: '#a78bfa',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <IconPackage />
                    </div>

                    {/* Title + client */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: '13px', fontWeight: '500', color: '#f1f5f9' }}>
                        Pedido #{p.id?.slice(0, 8)}
                      </p>
                      <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>
                        {p.clienteId}
                      </p>
                    </div>

                    {/* Badge + chevron */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '5px',
                        background: badge.bg,
                        color: badge.color,
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '500',
                      }}>
                        {badge.icon}
                        {badge.texto}
                      </span>
                      <button
                        onClick={e => { e.stopPropagation(); setExpandido(abierto ? null : p.id) }}
                        style={{
                          width: '26px', height: '26px',
                          borderRadius: '6px',
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.06)',
                          color: '#64748b',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer',
                          flexShrink: 0,
                        }}
                      >
                        <IconChevron up={abierto} />
                      </button>
                    </div>
                  </div>

                  {/* ── Expanded detail ── */}
                  {abierto && (
                    <div>
                      <div style={{ height: '0.5px', background: 'rgba(255,255,255,0.06)', margin: '0 18px' }} />
                      <div style={{ padding: '14px 18px 16px 68px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px 16px', marginBottom: p.estado === 'PENDIENTE' ? '14px' : 0 }}>
                          <div>
                            <p style={{ margin: '0 0 3px', fontSize: '11px', color: '#64748b' }}>Total</p>
                            <p style={{ margin: 0, fontSize: '13px', fontWeight: '500', color: '#34d399' }}>
                              ${p.total?.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p style={{ margin: '0 0 3px', fontSize: '11px', color: '#64748b' }}>Tipo</p>
                            <p style={{ margin: 0, fontSize: '13px', fontWeight: '500', color: '#e2e8f0' }}>
                              {p.tipo}
                            </p>
                          </div>
                          <div>
                            <p style={{ margin: '0 0 3px', fontSize: '11px', color: '#64748b' }}>Fecha</p>
                            <p style={{ margin: 0, fontSize: '13px', fontWeight: '500', color: '#e2e8f0' }}>
                              {p.createdAt?.slice(0, 10)}
                            </p>
                          </div>
                        </div>
                        {p.estado === 'PENDIENTE' && (
                          <button
                            onClick={() => handleDespachar(p.id)}
                            style={{
                              display: 'inline-flex', alignItems: 'center', gap: '6px',
                              padding: '7px 14px',
                              background: '#4f46e5',
                              border: 'none',
                              borderRadius: '7px',
                              color: '#fff',
                              fontSize: '12px',
                              fontWeight: '500',
                              cursor: 'pointer',
                            }}
                          >
                            <IconSend />
                            Despachar
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </main>
    </div>
  )
}

export default Pedidos
