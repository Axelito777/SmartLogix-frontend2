import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import TopBar from '../../components/TopBar'

const API = ''

const IconChart = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
  </svg>
)
const IconBox = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
)
const IconDownload = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
)

function MetricRow({ dot, label, value, valueColor = '#f1f5f9', last = false }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '13px 20px',
        borderBottom: last ? 'none' : '0.5px solid rgba(255,255,255,0.06)',
      }}
    >
      <span
        style={{
          width: '7px',
          height: '7px',
          borderRadius: '50%',
          flexShrink: 0,
          background: dot,
        }}
      />
      <span style={{ flex: 1, fontSize: '13px', color: '#94a3b8' }}>{label}</span>
      <span style={{ fontSize: '14px', fontWeight: '500', color: valueColor }}>{value}</span>
    </div>
  )
}

function EmptyState() {
  return (
    <div style={{ padding: '2.5rem 20px', textAlign: 'center' }}>
      <p style={{ fontSize: '13px', color: '#475569', margin: 0 }}>
        Presiona <strong style={{ color: '#6366f1' }}>Generar</strong> para ver el reporte
      </p>
    </div>
  )
}

function CardHeader({ icon, iconBg, iconColor, title, onGenerar, loading }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '18px 20px',
        borderBottom: '0.5px solid rgba(255,255,255,0.06)',
      }}
    >
      <div
        style={{
          width: '34px',
          height: '34px',
          borderRadius: '8px',
          background: iconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: iconColor,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>

      <span style={{ flex: 1, fontSize: '14px', fontWeight: '500', color: '#f1f5f9' }}>
        {title}
      </span>

      <button
        onClick={onGenerar}
        disabled={loading}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '7px 14px',
          background: loading ? 'rgba(79,70,229,0.5)' : '#4f46e5',
          border: 'none',
          borderRadius: '7px',
          color: '#fff',
          fontSize: '12px',
          fontWeight: '500',
          cursor: loading ? 'default' : 'pointer',
          flexShrink: 0,
        }}
      >
        <IconDownload />
        {loading ? 'Generando…' : 'Generar'}
      </button>
    </div>
  )
}

function Reportes() {
  const [reporteVentas, setReporteVentas]         = useState(null)
  const [reporteInventario, setReporteInventario] = useState(null)
  const [loadingVentas, setLoadingVentas]         = useState(false)
  const [loadingInventario, setLoadingInventario] = useState(false)
  const navigate = useNavigate()

  const token   = localStorage.getItem('token')
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
      const pendientes  = lista.filter(p => p.estado === 'PENDIENTE')
      const total    = completados.reduce((acc, p) => acc + (p.total || 0), 0)
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
      const bajoStock  = lista.filter(p => p.stock <= p.stockMinimo)
      const valorTotal = lista.reduce((acc, p) => acc + (p.precio * p.stock), 0)
      setReporteInventario({ total: lista.length, bajoStock: bajoStock.length, valorTotal })
    } catch {
      alert('Error al generar reporte de inventario')
    }
    setLoadingInventario(false)
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
        <div style={{ marginBottom: '1.75rem' }}>
          <h1 style={{ fontSize: '22px', fontWeight: '500', color: '#f1f5f9', margin: 0 }}>
            Reportes
          </h1>
          <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0' }}>
            Resumen de ventas e inventario
          </p>
        </div>

        {/* Grid de tarjetas */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

          {/* Reporte de Ventas */}
          <div
            style={{
              background: '#1e293b',
              borderRadius: '10px',
              border: '0.5px solid rgba(255,255,255,0.06)',
              overflow: 'hidden',
            }}
          >
            <CardHeader
              icon={<IconChart />}
              iconBg="rgba(99,102,241,0.15)"
              iconColor="#a78bfa"
              title="Reporte de Ventas"
              onGenerar={generarVentas}
              loading={loadingVentas}
            />

            {reporteVentas ? (
              <>
                <MetricRow
                  dot="#34d399"
                  label="Total ventas"
                  value={`$${reporteVentas.total.toLocaleString()}`}
                  valueColor="#34d399"
                />
                <MetricRow
                  dot="#818cf8"
                  label="Pedidos completados"
                  value={reporteVentas.completados}
                />
                <MetricRow
                  dot="#818cf8"
                  label="Ticket promedio"
                  value={`$${Math.round(reporteVentas.promedio).toLocaleString()}`}
                />
                <MetricRow
                  dot="#f87171"
                  label="Pedidos pendientes"
                  value={reporteVentas.pendientes}
                  valueColor="#f87171"
                  last
                />
              </>
            ) : (
              <EmptyState />
            )}
          </div>

          {/* Reporte de Inventario */}
          <div
            style={{
              background: '#1e293b',
              borderRadius: '10px',
              border: '0.5px solid rgba(255,255,255,0.06)',
              overflow: 'hidden',
            }}
          >
            <CardHeader
              icon={<IconBox />}
              iconBg="rgba(245,158,11,0.12)"
              iconColor="#fbbf24"
              title="Reporte de Inventario"
              onGenerar={generarInventario}
              loading={loadingInventario}
            />

            {reporteInventario ? (
              <>
                <MetricRow
                  dot="#818cf8"
                  label="Total productos"
                  value={reporteInventario.total}
                />
                <MetricRow
                  dot="#f87171"
                  label="Productos bajo stock"
                  value={reporteInventario.bajoStock}
                  valueColor="#f87171"
                />
                <MetricRow
                  dot="#fbbf24"
                  label="Valor total inventario"
                  value={`$${reporteInventario.valorTotal.toLocaleString()}`}
                  valueColor="#fbbf24"
                  last
                />
              </>
            ) : (
              <EmptyState />
            )}
          </div>

        </div>
      </main>
    </div>
  )
}

export default Reportes
