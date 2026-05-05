import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Sidebar from '../../components/Sidebar'

const API = 'http://localhost:8080'

const glassCard = {
  background: '#1e2d42',
  border: '1px solid rgba(0,200,255,0.15)',
  borderRadius: '12px',
  padding: '1.25rem',
}

function Dashboard() {
  const [pedidos, setPedidos] = useState([])
  const [clientes, setClientes] = useState([])
  const [stockBajo, setStockBajo] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { navigate('/login'); return }
    const headers = { Authorization: `Bearer ${token}` }

    const fetchConReintentos = async (url, intentos = 3) => {
      for (let i = 0; i < intentos; i++) {
        try {
          const res = await axios.get(url, { headers })
          return res.data
        } catch {
          if (i === intentos - 1) return []
          await new Promise(r => setTimeout(r, 1000))
        }
      }
      return []
    }

    Promise.all([
      fetchConReintentos(`${API}/api/pedidos`),
      fetchConReintentos(`${API}/api/clientes`),
      fetchConReintentos(`${API}/api/inventario/productos/bajo-stock`)
    ]).then(([p, c, s]) => {
      setPedidos(p)
      setClientes(c)
      setStockBajo(s)
    })
  }, [])

  const estadoBadge = (estado) => {
    if (estado === 'ENTREGADO') return { bg: 'rgba(0,200,100,0.2)', color: '#7effc0', border: 'rgba(0,200,100,0.3)' }
    if (estado === 'EN_CAMINO') return { bg: 'rgba(255,200,0,0.2)', color: '#ffe999', border: 'rgba(255,200,0,0.3)' }
    return { bg: 'rgba(255,80,80,0.2)', color: '#ffbbbb', border: 'rgba(255,80,80,0.3)' }
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#1a2332', overflow: 'hidden' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '2rem', boxSizing: 'border-box', overflowY: 'auto' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#7ef0ff', margin: '0 0 0.25rem' }}>Bienvenido</h1>
        <p style={{ fontSize: '13px', color: 'rgba(150,220,255,0.7)', margin: '0 0 2rem' }}>Resumen general del sistema</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '1.5rem' }}>
          {[
            { label: 'Total pedidos', valor: pedidos.length, color: '#7ef0ff' },
            { label: 'Clientes', valor: clientes.length, color: '#7ef0ff' },
            { label: 'Envíos en camino', valor: pedidos.filter(p => p.estado === 'EN_CAMINO').length, color: '#7ef0ff' },
            { label: 'Stock bajo', valor: stockBajo.length, color: '#ffdd77' },
          ].map((item, i) => (
            <div key={i} style={glassCard}>
              <p style={{ fontSize: '11px', color: 'rgba(150,220,255,0.6)', margin: '0 0 6px' }}>{item.label}</p>
              <p style={{ fontSize: '26px', fontWeight: '700', color: item.color, margin: 0 }}>{item.valor}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div style={glassCard}>
            <p style={{ fontSize: '14px', fontWeight: '600', color: '#7ef0ff', margin: '0 0 1rem' }}>Pedidos recientes</p>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(0,200,255,0.12)' }}>
                  <th style={{ textAlign: 'left', padding: '8px 0', color: 'rgba(150,220,255,0.6)', fontWeight: '500' }}>Cliente</th>
                  <th style={{ textAlign: 'left', padding: '8px 0', color: 'rgba(150,220,255,0.6)', fontWeight: '500' }}>Estado</th>
                  <th style={{ textAlign: 'left', padding: '8px 0', color: 'rgba(150,220,255,0.6)', fontWeight: '500' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.slice(0, 5).map(p => {
                  const badge = estadoBadge(p.estado)
                  return (
                    <tr key={p.id} style={{ borderBottom: '1px solid rgba(0,200,255,0.06)' }}>
                      <td style={{ padding: '8px 0', color: 'rgba(200,240,255,0.9)' }}>{p.clienteId?.slice(0, 8)}</td>
                      <td style={{ padding: '8px 0' }}>
                        <span style={{ background: badge.bg, color: badge.color, border: `1px solid ${badge.border}`, padding: '2px 8px', borderRadius: '20px', fontSize: '11px' }}>{p.estado}</span>
                      </td>
                      <td style={{ padding: '8px 0', color: 'rgba(200,240,255,0.9)' }}>${p.total}</td>
                    </tr>
                  )
                })}
                {pedidos.length === 0 && <tr><td colSpan="3" style={{ padding: '1rem 0', color: 'rgba(150,220,255,0.4)', textAlign: 'center' }}>Sin pedidos</td></tr>}
              </tbody>
            </table>
          </div>

          <div style={glassCard}>
            <p style={{ fontSize: '14px', fontWeight: '600', color: '#ffdd77', margin: '0 0 1rem' }}>Productos con stock bajo</p>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(0,200,255,0.12)' }}>
                  <th style={{ textAlign: 'left', padding: '8px 0', color: 'rgba(150,220,255,0.6)', fontWeight: '500' }}>Producto</th>
                  <th style={{ textAlign: 'left', padding: '8px 0', color: 'rgba(150,220,255,0.6)', fontWeight: '500' }}>Stock</th>
                  <th style={{ textAlign: 'left', padding: '8px 0', color: 'rgba(150,220,255,0.6)', fontWeight: '500' }}>Mínimo</th>
                </tr>
              </thead>
              <tbody>
                {stockBajo.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid rgba(0,200,255,0.06)' }}>
                    <td style={{ padding: '8px 0', color: 'rgba(200,240,255,0.9)' }}>{p.nombre}</td>
                    <td style={{ padding: '8px 0', color: '#ff9999', fontWeight: '600' }}>{p.stock}</td>
                    <td style={{ padding: '8px 0', color: 'rgba(200,240,255,0.9)' }}>{p.stockMinimo}</td>
                  </tr>
                ))}
                {stockBajo.length === 0 && <tr><td colSpan="3" style={{ padding: '1rem 0', color: 'rgba(150,220,255,0.4)', textAlign: 'center' }}>Sin productos bajo stock</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard