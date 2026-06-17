import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const PRIMARY_ITEMS = [
  { label: 'Dashboard',  path: '/dashboard' },
  { label: 'Clientes',   path: '/clientes' },
  { label: 'Inventario', path: '/inventario' },
  { label: 'Reportes',   path: '/reportes' },
]

const MORE_ITEMS = [
  { label: 'Pedidos',        path: '/pedidos' },
  { label: 'Envíos',         path: '/envios' },
  { label: 'Pagos',          path: '/pagos' },
  { label: 'Proveedores',    path: '/proveedores' },
  { label: 'Notificaciones', path: '/notificaciones' },
]

const ChevronDown = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
)

function TopBar() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const [open, setOpen] = useState(false)
  const dropRef   = useRef(null)

  const moreActive = MORE_ITEMS.some(i => i.path === location.pathname)

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleNav = (path) => {
    navigate(path)
    setOpen(false)
  }

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1rem',
        height: '64px',
        flexShrink: 0,
        background: 'rgba(10,8,28,0.85)',
        backdropFilter: 'blur(18px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        gap: '1.5rem',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Logo */}
      <div
        onClick={() => navigate('/dashboard')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1px',
          padding: '8px 16px',
          borderRadius: '8px',
          background: '#312e81',
          border: '1px solid rgba(167,139,250,0.2)',
          flexShrink: 0,
          cursor: 'pointer',
        }}
      >
        <span style={{ color: '#fff',     fontSize: '13px', fontWeight: '700', letterSpacing: '0.1em' }}>SMART</span>
        <span style={{ color: '#a78bfa', fontSize: '13px', fontWeight: '700', letterSpacing: '0.1em' }}>LOGIX</span>
      </div>

      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
        {/* Primary tabs */}
        {PRIMARY_ITEMS.map(item => {
          const active = location.pathname === item.path
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                padding: '7px 16px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: active ? '500' : '400',
                cursor: 'pointer',
                border:  active ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent',
                background: active ? 'rgba(99,102,241,0.25)' : 'transparent',
                color: active ? '#a78bfa' : 'rgba(148,163,184,0.6)',
                transition: 'all 0.15s ease',
              }}
            >
              {item.label}
            </button>
          )
        })}

        {/* "Más" dropdown */}
        <div ref={dropRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setOpen(v => !v)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '7px 14px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: moreActive ? '500' : '400',
              cursor: 'pointer',
              border:  moreActive ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent',
              background: moreActive ? 'rgba(99,102,241,0.25)' : 'transparent',
              color: moreActive ? '#a78bfa' : 'rgba(148,163,184,0.6)',
              transition: 'all 0.15s ease',
            }}
          >
            Más
            <span style={{ display: 'flex', transition: 'transform 0.15s ease', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              <ChevronDown />
            </span>
          </button>

          {open && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                minWidth: '176px',
                background: '#1e293b',
                border: '0.5px solid rgba(255,255,255,0.08)',
                borderRadius: '8px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                overflow: 'hidden',
                zIndex: 100,
              }}
            >
              {MORE_ITEMS.map(item => {
                const active = location.pathname === item.path
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNav(item.path)}
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      padding: '10px 16px',
                      fontSize: '13px',
                      fontWeight: active ? '500' : '400',
                      cursor: 'pointer',
                      border: 'none',
                      background: active ? 'rgba(99,102,241,0.2)' : 'transparent',
                      color: active ? '#a78bfa' : '#94a3b8',
                      transition: 'background 0.12s ease',
                    }}
                    onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(99,102,241,0.15)' }}
                    onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
                  >
                    {item.label}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </nav>

      {/* Avatar + name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '12px', fontWeight: '500', color: '#e2e8f0', margin: 0, lineHeight: 1.3 }}>Admin</p>
          <p style={{ fontSize: '11px', color: '#475569', margin: 0, lineHeight: 1.3 }}>SmartLogix</p>
        </div>
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '13px',
            fontWeight: '700',
            background: '#4f46e5',
            color: '#fff',
            flexShrink: 0,
          }}
        >
          A
        </div>
      </div>
    </header>
  )
}

export default TopBar
