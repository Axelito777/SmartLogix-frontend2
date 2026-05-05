import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Sidebar from '../../components/Sidebar'

const API = 'http://localhost:8080'

const card = { background: '#1e2d42', border: '1px solid rgba(0,200,255,0.15)', borderRadius: '12px', overflow: 'hidden' }

function Reportes() {
  const [reporteVentas, setReporteVentas] = useState(null)
  const [reporteInventario, setReporteInventario] = useState(null)
  const [loadingVentas, setLoadingVentas] = useState(false)
  const [loadingInventario, setLoadingInventario] = useState(false)
  const navigate = useNavigate()

  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    if (!token) { navigate('/login'); return }
  }, [])

  const generarVentas = async () => {
    setLoadingVentas(true)
    try {
      const pedidos = await axios.get(`${API}/api/pedidos`, { headers })
      const lista = pedidos.data
      const completados = lista.filter(p => p.estado === 'ENTREGADO')
      const pendientes = lista.filter(p => p.estado === 'PENDIENTE')
      const total = completados.reduce((acc, p) => acc + (p.total || 0), 0)
      const promedio = completados.length > 0 ? total / completados.length : 0
      setReporteVentas({ total, completados: completados.length, pendientes: pendientes.length, promedio })
    } catch {
      alert('Error al generar reporte de ventas')
    }
    setLoadingVentas(false)
  }

  const generarInventario = async () => {
    setLoadingInventario(true)
    try {
      const productos = await axios.get(`${API}/api/inventario/productos`, { headers })
      const lista = productos.data
      const bajoStock = lista.filter(p => p.stock <= p.stockMinimo)
      const valorTotal = lista.reduce((acc, p) => acc + (p.precio * p.stock), 0)
      setReporteInventario({ total: lista.length, bajoStock: bajoStock.length, valorTotal })
    } catch {
      alert('Error al generar reporte de inventario')
    }
    setLoadingInventario(false)
  }

  const fila = (label, valor, color = 'rgba(200,240,255,0.9)') => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: 'rgba(0,150,220,0.08)', borderRadius: '8px', border: '1px solid rgba(0,200,255,0.08)' }}>
      <span style={{ fontSize: '13px', color: 'rgba(150,220,255,0.6)' }}>{label}</span>
      <span style={{ fontSize: '13px', fontWeight: '600', color }}>{valor}</span>
    </div>
  )

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#1a2332', overflow: 'hidden' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '2rem', boxSizing: 'border-box', overflowY: 'auto' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#7ef0ff', margin: '0 0 0.25rem' }}>Reportes</h1>
        <p style={{ fontSize: '13px', color: 'rgba(150,220,255,0.7)', margin: '0 0 1.5rem' }}>Resumen de ventas e inventario</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

          {/* Reporte Ventas */}
          <div style={{ ...card, padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#7ef0ff', margin: 0 }}>📊 Reporte de Ventas</h2>
              <button onClick={generarVentas} style={{ padding: '7px 14px', background: 'rgba(0,160,220,0.35)', border: '1px solid rgba(0,200,255,0.35)', borderRadius: '8px', color: '#7ef0ff', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>
                {loadingVentas ? 'Generando...' : 'Generar'}
              </button>
            </div>
            {reporteVentas ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {fila('Total ventas', `$${reporteVentas.total.toLocaleString()}`, '#2ecc71')}
                {fila('Pedidos completados', reporteVentas.completados)}
                {fila('Ticket promedio', `$${Math.round(reporteVentas.promedio).toLocaleString()}`)}
                {fila('Pedidos pendientes', reporteVentas.pendientes, '#e74c3c')}
              </div>
            ) : (
              <p style={{ color: 'rgba(150,220,255,0.35)', fontSize: '13px', textAlign: 'center', marginTop: '2rem' }}>Presiona Generar para ver el reporte</p>
            )}
          </div>

          {/* Reporte Inventario */}
          <div style={{ ...card, padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#7ef0ff', margin: 0 }}>📦 Reporte de Inventario</h2>
              <button onClick={generarInventario} style={{ padding: '7px 14px', background: 'rgba(0,160,220,0.35)', border: '1px solid rgba(0,200,255,0.35)', borderRadius: '8px', color: '#7ef0ff', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>
                {loadingInventario ? 'Generando...' : 'Generar'}
              </button>
            </div>
            {reporteInventario ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {fila('Total productos', reporteInventario.total)}
                {fila('Productos bajo stock', reporteInventario.bajoStock, '#e74c3c')}
                {fila('Valor total inventario', `$${reporteInventario.valorTotal.toLocaleString()}`)}
              </div>
            ) : (
              <p style={{ color: 'rgba(150,220,255,0.35)', fontSize: '13px', textAlign: 'center', marginTop: '2rem' }}>Presiona Generar para ver el reporte</p>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

export default Reportes