import { useNavigate, useLocation } from 'react-router-dom'

const items = [
  { label: 'Dashboard',      path: '/dashboard' },
  { label: 'Clientes',       path: '/clientes' },
  { label: 'Inventario',     path: '/inventario' },
  { label: 'Pedidos',        path: '/pedidos' },
  { label: 'Envíos',         path: '/envios' },
  { label: 'Pagos',          path: '/pagos' },
  { label: 'Proveedores',    path: '/proveedores' },
  { label: 'Notificaciones', path: '/notificaciones' },
  { label: 'Reportes',       path: '/reportes' },
]

function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div
      style={{
        width: '230px',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.75rem 0',
        boxSizing: 'border-box',
        flexShrink: 0,
        position: 'relative',
        overflow: 'hidden',
        background: 'rgba(15,5,35,0.7)',
        backdropFilter: 'blur(18px)',
        borderRight: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '4px 0 24px rgba(0,0,0,0.45)',
      }}
    >
      {/* Glow orbs */}
      <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '180px', height: '180px', background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '180px', height: '180px', background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

      {/* Logo */}
      <div style={{ padding: '0 1.5rem', marginBottom: '2rem', position: 'relative' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(124,58,237,0.28), rgba(6,182,212,0.18))',
            border: '1px solid rgba(124,58,237,0.4)',
            borderRadius: '8px',
            padding: '10px 16px',
            textAlign: 'center',
          }}
        >
          <span style={{ color: '#06b6d4', fontSize: '14px', fontWeight: '800', letterSpacing: '0.12em', textShadow: '0 0 12px rgba(6,182,212,0.5)' }}>SMART</span>
          <span style={{ color: '#7c3aed', fontSize: '14px', fontWeight: '800', letterSpacing: '0.12em', textShadow: '0 0 12px rgba(124,58,237,0.5)' }}>LOGIX</span>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1, position: 'relative', padding: '0 0.75rem' }}>
        {items.map(item => {
          const active = location.pathname === item.path
          return (
            <span
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                color: active ? '#06b6d4' : 'rgba(200,220,255,0.52)',
                fontSize: '13px',
                padding: '11px 14px',
                cursor: 'pointer',
                background: active
                  ? 'linear-gradient(135deg, rgba(124,58,237,0.22), rgba(6,182,212,0.13))'
                  : 'transparent',
                borderRadius: '6px',
                fontWeight: active ? '600' : '400',
                border: active ? '1px solid rgba(124,58,237,0.32)' : '1px solid transparent',
                textShadow: active ? '0 0 10px rgba(6,182,212,0.38)' : 'none',
                transition: 'all 0.18s ease',
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
