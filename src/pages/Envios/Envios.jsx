import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Sidebar from '../../components/Sidebar'

const API = 'http://localhost:8080'

const card = { background: '#1e2d42', border: '1px solid rgba(0,200,255,0.15)', borderRadius: '12px', overflow: 'hidden' }

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
    if (estado === 'ENTREGADO') return { background: 'rgba(39,174,96,0.15)', color: '#2ecc71', border: '1px solid rgba(46,204,113,0.3)', texto: '✅ ENTREGADO' }
    if (estado === 'EN_CAMINO') return { background: 'rgba(230,126,34,0.15)', color: '#f39c12', border: '1px solid rgba(243,156,18,0.3)', texto: '🚚 EN CAMINO' }
    return { background: 'rgba(192,57,43,0.15)', color: '#e74c3c', border: '1px solid rgba(231,76,60,0.3)', texto: '⏳ PENDIENTE' }
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#1a2332', overflow: 'hidden' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '2rem', boxSizing: 'border-box', overflowY: 'auto' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#7ef0ff', margin: '0 0 0.25rem' }}>Envíos</h1>
        <p style={{ fontSize: '13px', color: 'rgba(150,220,255,0.7)', margin: '0 0 1.5rem' }}>Seguimiento de envíos despachados</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {envios.length === 0 ? (
            <div style={{ ...card, padding: '2rem', textAlign: 'center', color: 'rgba(150,220,255,0.4)' }}>
              No hay envíos registrados
            </div>
          ) : (
            envios.map(e => {
              const badge = estadoBadge(e.estado)
              const abierto = expandido === e.id
              return (
                <div key={e.id} style={{ ...card }}>
                  <div
                    onClick={() => setExpandido(abierto ? null : e.id)}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', cursor: 'pointer', background: abierto ? 'rgba(0,150,220,0.08)' : 'transparent' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '20px' }}>🚚</span>
                      <div>
                        <p style={{ margin: 0, fontWeight: '600', color: '#7ef0ff', fontSize: '14px' }}>Envío #{e.id}</p>
                        <p style={{ margin: 0, fontSize: '12px', color: 'rgba(150,220,255,0.5)' }}>Pedido: #{e.pedidoId?.substring(0, 8)}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ background: badge.background, color: badge.color, border: badge.border, padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>{badge.texto}</span>
                      <span style={{ color: 'rgba(150,220,255,0.5)', fontSize: '14px' }}>{abierto ? '▲' : '▼'}</span>
                    </div>
                  </div>

                  {abierto && (
                    <div style={{ borderTop: '1px solid rgba(0,200,255,0.1)', padding: '16px 20px', background: 'rgba(0,100,160,0.08)' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <p style={{ margin: 0, fontSize: '12px', color: 'rgba(150,220,255,0.5)' }}>Tracking: <span style={{ color: 'rgba(200,240,255,0.9)', fontWeight: '600' }}>{e.trackingNumber}</span></p>
                        <p style={{ margin: 0, fontSize: '13px', color: 'rgba(150,220,255,0.5)' }}>Estado: <span style={{ color: 'rgba(200,240,255,0.9)', fontWeight: '600' }}>{e.estado}</span></p>
                        <p style={{ margin: 0, fontSize: '13px', color: 'rgba(150,220,255,0.5)' }}>Fecha: <span style={{ color: 'rgba(200,240,255,0.9)', fontWeight: '600' }}>{e.fechaCreacion?.slice(0, 10)}</span></p>
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