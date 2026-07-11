import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import TopBar from '../../components/TopBar'
import { pageStyle, contentStyle, titleStyle, subtitleStyle } from '../../context/styles'

const API = ''

function Envios() {
  const [envios, setEnvios] = useState([])
  const [expandido, setExpandido] = useState(null)
  const navigate = useNavigate()

  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    axios.get(`${API}/api/envios`, { headers }).then(r => setEnvios(r.data)).catch(() => {})
  }, [])

  const estadoBadge = (estado) => {
    if (estado === 'ENTREGADO') return { bg: 'rgba(52,211,153,0.14)', color: '#34d399', border: 'rgba(52,211,153,0.28)', texto: '✅ ENTREGADO' }
    if (estado === 'EN_CAMINO') return { bg: 'rgba(6,182,212,0.14)', color: '#06b6d4', border: 'rgba(6,182,212,0.28)', texto: '🚚 EN CAMINO' }
    return { bg: 'rgba(124,58,237,0.14)', color: '#a78bfa', border: 'rgba(124,58,237,0.28)', texto: '⏳ PENDIENTE' }
  }

  return (
    <div style={pageStyle}>
      <TopBar />
      <div style={contentStyle}>
        <h1 style={titleStyle}>Envíos</h1>
        <p style={subtitleStyle}>Seguimiento de envíos despachados</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {envios.length === 0 ? (
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '2.5rem', textAlign: 'center', color: 'rgba(200,220,255,0.3)', fontSize: '13px' }}>
              No hay envíos registrados
            </div>
          ) : (
            envios.map(e => {
              const badge = estadoBadge(e.estado)
              const abierto = expandido === e.id
              return (
                <div key={e.id} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', overflow: 'hidden' }}>
                  <div
                    onClick={() => setExpandido(abierto ? null : e.id)}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 22px', cursor: 'pointer', background: abierto ? 'rgba(124,58,237,0.06)' : 'transparent' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <span style={{ fontSize: '20px' }}>🚚</span>
                      <div>
                        <p style={{ margin: 0, fontWeight: '600', color: '#e2e8f0', fontSize: '14px' }}>Envío #{e.id}</p>
                        <p style={{ margin: 0, fontSize: '12px', color: 'rgba(200,220,255,0.45)', marginTop: '2px' }}>Pedido: #{e.pedidoId?.substring(0, 8)}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ background: badge.bg, color: badge.color, border: `1px solid ${badge.border}`, padding: '4px 12px', borderRadius: '5px', fontSize: '12px', fontWeight: '600' }}>{badge.texto}</span>
                      <span style={{ color: 'rgba(200,220,255,0.4)', fontSize: '12px' }}>{abierto ? '▲' : '▼'}</span>
                    </div>
                  </div>

                  {abierto && (
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '16px 22px', background: 'rgba(6,182,212,0.04)' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <p style={{ margin: 0, fontSize: '13px', color: 'rgba(200,220,255,0.5)' }}>Tracking: <span style={{ color: '#e2e8f0', fontWeight: '600' }}>{e.trackingNumber}</span></p>
                        <p style={{ margin: 0, fontSize: '13px', color: 'rgba(200,220,255,0.5)' }}>Estado: <span style={{ color: '#e2e8f0', fontWeight: '600' }}>{e.estado}</span></p>
                        <p style={{ margin: 0, fontSize: '13px', color: 'rgba(200,220,255,0.5)' }}>Fecha: <span style={{ color: '#e2e8f0', fontWeight: '600' }}>{e.fechaCreacion?.slice(0, 10)}</span></p>
                      </div>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

export default Envios
