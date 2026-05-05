import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Sidebar from '../../components/Sidebar'

const API = 'http://localhost:8080'

const card = { background: '#1e2d42', border: '1px solid rgba(0,200,255,0.15)', borderRadius: '12px', overflow: 'hidden' }
const th = { textAlign: 'left', padding: '12px 16px', color: 'rgba(150,220,255,0.6)', fontWeight: '500', borderBottom: '1px solid rgba(0,200,255,0.12)' }
const td = { padding: '12px 16px', color: 'rgba(200,240,255,0.9)', borderBottom: '1px solid rgba(0,200,255,0.06)' }

function Pagos() {
  const [pagos, setPagos] = useState([])
  const navigate = useNavigate()

  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    axios.get(`${API}/api/pagos`, { headers }).then(r => setPagos(r.data)).catch(() => {})
  }, [])

  const totalRecaudado = pagos.reduce((acc, p) => acc + (p.monto || 0), 0)
  const pagoMasAlto = pagos.length > 0 ? Math.max(...pagos.map(p => p.monto || 0)) : 0
  const ultimoPago = pagos.length > 0 ? pagos[pagos.length - 1]?.createdAt?.slice(0, 10) : '-'

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#1a2332', overflow: 'hidden' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '2rem', boxSizing: 'border-box', overflowY: 'auto' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#7ef0ff', margin: '0 0 0.25rem' }}>Pagos</h1>
        <p style={{ fontSize: '13px', color: 'rgba(150,220,255,0.7)', margin: '0 0 1.5rem' }}>Historial de pagos recibidos</p>

        {/* Tarjetas de resumen */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '2rem' }}>
          <div style={{ ...card, padding: '1.25rem' }}>
            <p style={{ fontSize: '12px', color: 'rgba(150,220,255,0.6)', margin: '0 0 8px' }}>Total recaudado</p>
            <p style={{ fontSize: '24px', fontWeight: '700', color: '#2ecc71', margin: 0 }}>${totalRecaudado.toLocaleString()}</p>
          </div>
          <div style={{ ...card, padding: '1.25rem' }}>
            <p style={{ fontSize: '12px', color: 'rgba(150,220,255,0.6)', margin: '0 0 8px' }}>Total de pagos</p>
            <p style={{ fontSize: '24px', fontWeight: '700', color: '#7ef0ff', margin: 0 }}>{pagos.length}</p>
          </div>
          <div style={{ ...card, padding: '1.25rem' }}>
            <p style={{ fontSize: '12px', color: 'rgba(150,220,255,0.6)', margin: '0 0 8px' }}>Pago más alto</p>
            <p style={{ fontSize: '24px', fontWeight: '700', color: '#7ef0ff', margin: 0 }}>${pagoMasAlto.toLocaleString()}</p>
          </div>
          <div style={{ ...card, padding: '1.25rem' }}>
            <p style={{ fontSize: '12px', color: 'rgba(150,220,255,0.6)', margin: '0 0 8px' }}>Último pago</p>
            <p style={{ fontSize: '20px', fontWeight: '700', color: '#7ef0ff', margin: 0 }}>{ultimoPago}</p>
          </div>
        </div>

        {/* Tabla */}
        <div style={card}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ background: 'rgba(0,150,220,0.1)' }}>
                <th style={th}>ID Pago</th>
                <th style={th}>Pedido</th>
                <th style={th}>Monto</th>
                <th style={th}>Método</th>
                <th style={th}>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {pagos.length === 0 ? (
                <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'rgba(150,220,255,0.4)' }}>No hay pagos registrados</td></tr>
              ) : (
                pagos.map(p => (
                  <tr key={p.id}>
                    <td style={td}>#{p.id}</td>
                    <td style={td}>{p.pedidoId}</td>
                    <td style={{ ...td, color: '#2ecc71', fontWeight: '600' }}>${p.monto?.toLocaleString()}</td>
                    <td style={td}>{p.metodoPago}</td>
                    <td style={td}>{p.createdAt?.slice(0, 10)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Pagos