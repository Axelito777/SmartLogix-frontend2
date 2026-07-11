import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import TopBar from '../../components/TopBar'

const API = ''

const DIAS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
const VENTAS_MOCK = [42, 67, 55, 89, 73, 94, 61]

const ORDER_STATUS = [
  { label: 'Entregados',  key: 'ENTREGADO',  color: '#34d399' },
  { label: 'En tránsito', key: 'EN_CAMINO',   color: '#06b6d4' },
  { label: 'Procesando',  key: 'PROCESANDO',  color: '#f59e0b' },
  { label: 'Cancelados',  key: 'CANCELADO',   color: '#ef4444' },
]

function KPICard({ label, value, pct, icon, accent }) {
  return (
    <div
      style={{
        borderRadius: '10px',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        background: '#1e293b',
        border: '0.5px solid rgba(255,255,255,0.06)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.07em', color: '#64748b' }}>
          {label}
        </span>
        <span style={{ fontSize: '18px' }}>{icon}</span>
      </div>
      <div>
        <p style={{ fontSize: '28px', fontWeight: '700', color: '#f1f5f9', margin: 0, lineHeight: 1 }}>{value}</p>
        <p style={{ fontSize: '12px', fontWeight: '500', color: '#34d399', margin: '6px 0 0' }}>
          ↑ {pct}% vs. mes anterior
        </p>
      </div>
      <div style={{ height: '2px', width: '100%', background: `linear-gradient(90deg, ${accent}, transparent)`, borderRadius: '1px' }} />
    </div>
  )
}

function BarChart({ data, labels }) {
  const max = Math.max(...data)
  return (
    <div style={{ borderRadius: '10px', padding: '1.5rem', background: '#1e293b', border: '0.5px solid rgba(255,255,255,0.06)' }}>
      <p style={{ fontSize: '13px', fontWeight: '600', marginBottom: '1.25rem', color: '#94a3b8' }}>
        Ventas por día de la semana
      </p>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '130px' }}>
        {data.map((v, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flex: 1 }}>
            <span style={{ fontSize: '11px', fontWeight: '600', color: '#6366f1' }}>{v}</span>
            <div
              style={{
                width: '100%',
                borderRadius: '4px 4px 0 0',
                height: `${(v / max) * 90}px`,
                minHeight: '4px',
                background: 'linear-gradient(180deg, #6366f1, #a78bfa)',
              }}
            />
            <span style={{ fontSize: '11px', color: '#475569' }}>{labels[i]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function OrderStatusTable({ pedidos }) {
  const total = pedidos.length || 1
  return (
    <div style={{ borderRadius: '10px', padding: '1.5rem', background: '#1e293b', border: '0.5px solid rgba(255,255,255,0.06)' }}>
      <p style={{ fontSize: '13px', fontWeight: '600', marginBottom: '1.25rem', color: '#94a3b8' }}>
        Estado de pedidos
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {ORDER_STATUS.map(({ label, key, color }) => {
          const count = pedidos.filter(p => p.estado === key).length
          const pct = Math.round((count / total) * 100)
          return (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', flexShrink: 0, background: color }} />
              <span style={{ fontSize: '13px', flex: 1, color: '#94a3b8' }}>{label}</span>
              <span style={{ fontSize: '13px', fontWeight: '600', color, minWidth: '20px', textAlign: 'right' }}>{count}</span>
              <div style={{ width: '80px', height: '5px', borderRadius: '3px', overflow: 'hidden', background: 'rgba(255,255,255,0.08)' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: color }} />
              </div>
              <span style={{ fontSize: '11px', minWidth: '32px', textAlign: 'right', color: '#475569' }}>{pct}%</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function RecentOrdersTable({ pedidos }) {
  const estadoBadge = (estado) => {
    if (estado === 'ENTREGADO')  return { bg: 'rgba(52,211,153,0.12)',  color: '#34d399', border: 'rgba(52,211,153,0.25)' }
    if (estado === 'EN_CAMINO')  return { bg: 'rgba(6,182,212,0.12)',   color: '#06b6d4', border: 'rgba(6,182,212,0.25)' }
    if (estado === 'PROCESANDO') return { bg: 'rgba(245,158,11,0.12)',  color: '#f59e0b', border: 'rgba(245,158,11,0.25)' }
    return { bg: 'rgba(239,68,68,0.12)', color: '#ef4444', border: 'rgba(239,68,68,0.25)' }
  }

  return (
    <div style={{ borderRadius: '10px', padding: '1.5rem', background: '#1e293b', border: '0.5px solid rgba(255,255,255,0.06)' }}>
      <p style={{ fontSize: '13px', fontWeight: '600', marginBottom: '1.25rem', color: '#94a3b8' }}>
        Pedidos recientes
      </p>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
        <thead>
          <tr style={{ borderBottom: '0.5px solid rgba(255,255,255,0.07)' }}>
            {['Cliente', 'Estado', 'Total'].map(h => (
              <th key={h} style={{ textAlign: 'left', paddingBottom: '10px', fontWeight: '600', color: '#64748b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pedidos.slice(0, 5).map(p => {
            const badge = estadoBadge(p.estado)
            return (
              <tr key={p.id} style={{ borderBottom: '0.5px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '12px 0', color: '#cbd5e1' }}>{p.clienteId?.slice(0, 8) ?? '—'}</td>
                <td style={{ padding: '12px 0' }}>
                  <span style={{ padding: '3px 10px', borderRadius: '4px', fontSize: '11px', background: badge.bg, color: badge.color, border: `1px solid ${badge.border}` }}>
                    {p.estado}
                  </span>
                </td>
                <td style={{ padding: '12px 0', fontWeight: '600', color: '#6366f1' }}>${p.total}</td>
              </tr>
            )
          })}
          {pedidos.length === 0 && (
            <tr>
              <td colSpan="3" style={{ padding: '1.5rem 0', textAlign: 'center', color: '#475569', fontSize: '13px' }}>
                Sin pedidos
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
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

  const entregasATiempo = pedidos.length
    ? Math.round((pedidos.filter(p => p.estado === 'ENTREGADO').length / pedidos.length) * 100)
    : 0

  const ingresos = pedidos.reduce((acc, p) => acc + (p.total || 0), 0)

  const kpis = [
    { label: 'Pedidos totales',   value: pedidos.length,  pct: 12, icon: '📦', accent: '#6366f1' },
    { label: 'Clientes activos',  value: clientes.length, pct: 8,  icon: '👥', accent: '#06b6d4' },
    { label: 'Ingresos',          value: `$${ingresos.toLocaleString()}`, pct: 15, icon: '💰', accent: '#f59e0b' },
    { label: 'Entregas a tiempo', value: `${entregasATiempo}%`,           pct: 3,  icon: '🚚', accent: '#34d399' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <TopBar />

      <main style={{ flex: 1, padding: '2rem 2.5rem', overflowY: 'auto' }}>
        <div style={{ marginBottom: '1.75rem' }}>
          <h1 style={{ fontSize: '22px', fontWeight: '500', color: '#f1f5f9', margin: 0 }}>Dashboard</h1>
          <p style={{ fontSize: '13px', marginTop: '4px', color: '#64748b' }}>Resumen general del sistema</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '1.5rem' }}>
          {kpis.map((kpi, i) => <KPICard key={i} {...kpi} />)}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <BarChart data={VENTAS_MOCK} labels={DIAS} />
          <OrderStatusTable pedidos={pedidos} />
        </div>

        <RecentOrdersTable pedidos={pedidos} />
      </main>
    </div>
  )
}

export default Dashboard
