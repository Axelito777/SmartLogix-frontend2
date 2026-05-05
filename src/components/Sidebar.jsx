import { useNavigate, useLocation } from 'react-router-dom'

const items = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Clientes', path: '/clientes' },
  { label: 'Inventario', path: '/inventario' },
  { label: 'Pedidos', path: '/pedidos' },
  { label: 'Envíos', path: '/envios' },
  { label: 'Pagos', path: '/pagos' },
  { label: 'Proveedores', path: '/proveedores' },
  { label: 'Notificaciones', path: '/notificaciones' },
  { label: 'Reportes', path: '/reportes' },
]

function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div style={{
      width: '220px',
      background: 'linear-gradient(180deg, #0a1628 0%, #0d2d4a 50%, #0a3d3a 100%)',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      padding: '1.5rem 0',
      boxSizing: 'border-box',
      flexShrink: 0,
      position: 'relative',
      overflow: 'hidden',
      borderRight: '1px solid rgba(0,200,255,0.15)',
      boxShadow: '4px 0 20px rgba(0,0,0,0.4)'
    }}>
      <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(0,180,220,0.15) 0%, transparent 70%)', borderRadius: '50%' }} />
      <div style={{ position: 'absolute', bottom: '-40px', left: '-40px', width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(0,220,150,0.1) 0%, transparent 70%)', borderRadius: '50%' }} />

      <div style={{ padding: '0 1.5rem', marginBottom: '2rem', position: 'relative' }}>
        <div style={{ background: 'linear-gradient(135deg, rgba(0,180,220,0.3), rgba(0,100,180,0.2))', border: '1px solid rgba(0,200,255,0.4)', borderRadius: '12px', padding: '8px 12px', textAlign: 'center' }}>
          <p style={{ color: '#7ef0ff', fontSize: '15px', fontWeight: '700', letterSpacing: '0.1em', margin: 0, textShadow: '0 0 15px rgba(0,200,255,0.4)' }}>SMARTLOGIX</p>
        </div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, position: 'relative' }}>
        {items.map(item => {
          const activo = location.pathname === item.path
          return (
            <span
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                color: activo ? '#7ef0ff' : 'rgba(150,220,255,0.65)',
                fontSize: '14px',
                padding: '11px 1.5rem',
                cursor: 'pointer',
                background: activo ? 'linear-gradient(135deg, rgba(0,150,220,0.3), rgba(0,100,180,0.2))' : 'transparent',
                borderRadius: '10px',
                margin: '0 8px',
                fontWeight: activo ? '600' : '400',
                border: activo ? '1px solid rgba(0,200,255,0.3)' : '1px solid transparent',
                textShadow: activo ? '0 0 10px rgba(0,200,255,0.4)' : 'none',
                transition: 'all 0.2s ease',
                boxShadow: activo ? 'inset 0 1px 0 rgba(0,200,255,0.2)' : 'none'
              }}
            >
              {item.label}
            </span>
          )
        })}
      </nav>
    </div>
  )
}

export default Sidebar