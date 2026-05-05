import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Sidebar from '../../components/Sidebar'

const API = 'http://localhost:8080'

function Pedidos() {
  const [pedidos, setPedidos] = useState([])
  const [expandido, setExpandido] = useState(null)
  const navigate = useNavigate()

  const token = localStorage.getItem('token')
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
    } catch (err) {
      alert('Error al actualizar estado')
    }
  }

  const estadoBadge = (estado) => {
    if (estado === 'ENTREGADO') return { bg: 'rgba(0,200,100,0.2)', color: '#7effc0', border: 'rgba(0,200,100,0.3)', texto: '✅ ENTREGADO' }
    if (estado === 'EN_PROCESO') return { bg: 'rgba(255,200,0,0.2)', color: '#ffe999', border: 'rgba(255,200,0,0.3)', texto: '🔄 EN PROCESO' }
    return { bg: 'rgba(255,80,80,0.2)', color: '#ffbbbb', border: 'rgba(255,80,80,0.3)', texto: '⏳ PENDIENTE' }
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#1a2332', overflow: 'hidden' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '2rem', boxSizing: 'border-box', overflowY: 'auto' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#7ef0ff', margin: '0 0 0.25rem' }}>Pedidos</h1>
        <p style={{ fontSize: '13px', color: 'rgba(150,220,255,0.7)', margin: '0 0 1.5rem' }}>Gestión de pedidos recibidos</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {pedidos.length === 0 ? (
            <div style={{ background: '#1e2d42', border: '1px solid rgba(0,200,255,0.15)', borderRadius: '12px', padding: '2rem', textAlign: 'center', color: 'rgba(150,220,255,0.4)' }}>
              No hay pedidos registrados
            </div>
          ) : (
            pedidos.map(p => {
              const badge = estadoBadge(p.estado)
              const abierto = expandido === p.id
              return (
                <div key={p.id} style={{ background: '#1e2d42', border: '1px solid rgba(0,200,255,0.15)', borderRadius: '12px', overflow: 'hidden' }}>
                  <div
                    onClick={() => setExpandido(abierto ? null : p.id)}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', cursor: 'pointer' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '20px' }}>📦</span>
                      <div>
                        <p style={{ margin: 0, fontWeight: '600', color: '#7ef0ff', fontSize: '14px' }}>Pedido #{p.id?.slice(0, 8)}</p>
                        <p style={{ margin: 0, fontSize: '12px', color: 'rgba(150,220,255,0.6)' }}>Cliente: {p.clienteId}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ background: badge.bg, color: badge.color, border: `1px solid ${badge.border}`, padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>{badge.texto}</span>
                      <span style={{ color: 'rgba(150,220,255,0.5)', fontSize: '18px' }}>{abierto ? '▲' : '▼'}</span>
                    </div>
                  </div>

                  {abierto && (
                    <div style={{ borderTop: '1px solid rgba(0,200,255,0.1)', padding: '16px 20px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '1rem' }}>
                        <p style={{ margin: 0, fontSize: '13px', color: 'rgba(150,220,255,0.6)' }}>Total: <span style={{ color: '#7ef0ff', fontWeight: '600' }}>${p.total}</span></p>
                        <p style={{ margin: 0, fontSize: '13px', color: 'rgba(150,220,255,0.6)' }}>Tipo: <span style={{ color: '#7ef0ff', fontWeight: '600' }}>{p.tipo}</span></p>
                        <p style={{ margin: 0, fontSize: '13px', color: 'rgba(150,220,255,0.6)' }}>Fecha: <span style={{ color: '#7ef0ff', fontWeight: '600' }}>{p.createdAt?.slice(0, 10)}</span></p>
                      </div>
                      {p.estado !== 'ENTREGADO' && (
                        <button
                          onClick={() => handleDespachar(p.id)}
                          style={{ padding: '10px 24px', background: 'rgba(0,160,220,0.4)', border: '1px solid rgba(0,200,255,0.4)', borderRadius: '8px', color: '#7ef0ff', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}
                        >
                          Despachar
                        </button>
                      )}
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

export default Pedidos