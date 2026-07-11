import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import TopBar from '../../components/TopBar'

const API = ''

/* ── icons ── */
const IconSearch = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)
const IconFilter = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
  </svg>
)
const IconBox = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
)
const IconEdit = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
)
const IconTrash = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
)

/* ── style constants ── */
const TH = {
  textAlign: 'left',
  padding: '12px 20px',
  fontSize: '11px',
  fontWeight: '600',
  textTransform: 'uppercase',
  letterSpacing: '0.07em',
  color: '#64748b',
  borderBottom: '0.5px solid rgba(255,255,255,0.06)',
  whiteSpace: 'nowrap',
}
const TD = {
  padding: '14px 20px',
  fontSize: '13px',
  color: '#94a3b8',
  borderBottom: '0.5px solid rgba(255,255,255,0.05)',
}
const INPUT = {
  padding: '8px 12px',
  background: 'rgba(99,102,241,0.08)',
  border: '1px solid rgba(99,102,241,0.22)',
  borderRadius: '6px',
  fontSize: '13px',
  color: '#e2e8f0',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
}
const BTN_PRIMARY = {
  display: 'flex', alignItems: 'center', gap: '6px',
  padding: '9px 18px',
  background: '#4f46e5',
  border: 'none',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '13px',
  fontWeight: '500',
  cursor: 'pointer',
}
const BTN_SECONDARY = {
  padding: '8px 16px',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '6px',
  color: '#64748b',
  fontSize: '13px',
  cursor: 'pointer',
}

function stockBadge(stock, minimo) {
  const s = Number(stock)
  const m = Number(minimo)
  if (s === 0)    return { bg: 'rgba(239,68,68,0.15)',    color: '#f87171' }
  if (s <= m)     return { bg: 'rgba(245,158,11,0.15)',   color: '#fbbf24' }
  return             { bg: 'rgba(16,185,129,0.15)',    color: '#34d399' }
}

function Inventario() {
  const [productos, setProductos]   = useState([])
  const [mostrarForm, setMostrarForm] = useState(false)
  const [editando, setEditando]     = useState(null)
  const [form, setForm]             = useState({ nombre: '', descripcion: '', precio: '', stock: '', stockMinimo: '', bodegaId: '', proveedorId: '' })
  const [busqueda, setBusqueda]     = useState('')
  const navigate = useNavigate()

  const token   = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    cargarProductos()
  }, [])

  /* ── lógica existente sin cambios ── */
  const cargarProductos = () => {
    axios.get(`${API}/api/inventario/productos`, { headers }).then(r => setProductos(r.data)).catch(() => {})
  }

  const handleGuardar = async () => {
    try {
      if (editando) {
        await axios.put(`${API}/api/inventario/productos/${editando}`, form, { headers })
        setEditando(null)
      } else {
        await axios.post(`${API}/api/inventario/productos`, form, { headers })
      }
      setForm({ nombre: '', descripcion: '', precio: '', stock: '', stockMinimo: '', bodegaId: '', proveedorId: '' })
      setMostrarForm(false)
      cargarProductos()
    } catch {
      alert('Error al guardar producto')
    }
  }

  const handleEditar = (p) => {
    setEditando(p.id)
    setForm({ nombre: p.nombre, descripcion: p.descripcion, precio: p.precio, stock: p.stock, stockMinimo: p.stockMinimo, bodegaId: p.bodegaId || '', proveedorId: p.proveedorId || '' })
    setMostrarForm(true)
  }

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Eliminar este producto?')) return
    try {
      await axios.delete(`${API}/api/inventario/productos/${id}`, { headers })
      cargarProductos()
    } catch {
      alert('Error al eliminar producto')
    }
  }
  /* ─────────────────────────────────── */

  const productosFiltrados = productos.filter(p =>
    !busqueda ||
    p.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.descripcion?.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#0f172a', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <TopBar />

      <main style={{ flex: 1, padding: '2rem 2.5rem', overflowY: 'auto' }}>

        {/* ── Page header ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem' }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: '500', color: '#f1f5f9', margin: 0 }}>Inventario</h1>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0' }}>Gestión de productos y stock</p>
          </div>
          <button
            onClick={() => { setMostrarForm(!mostrarForm); setEditando(null); setForm({ nombre: '', descripcion: '', precio: '', stock: '', stockMinimo: '', bodegaId: '', proveedorId: '' }) }}
            style={BTN_PRIMARY}
          >
            <span style={{ fontSize: '17px', lineHeight: 1, marginTop: '-1px' }}>+</span>
            {mostrarForm ? 'Cancelar' : 'Nuevo producto'}
          </button>
        </div>

        {/* ── Form panel ── */}
        {mostrarForm && (
          <div
            style={{
              background: '#1e293b',
              border: '0.5px solid rgba(255,255,255,0.08)',
              borderRadius: '10px',
              padding: '1.5rem',
              marginBottom: '1.5rem',
            }}
          >
            <h3 style={{ fontSize: '13px', fontWeight: '600', color: '#a78bfa', margin: '0 0 1.25rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {editando ? 'Editar producto' : 'Nuevo producto'}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <input placeholder="Nombre"                  value={form.nombre}       onChange={e => setForm({...form, nombre: e.target.value})}       style={INPUT} />
              <input placeholder="Descripción"             value={form.descripcion}  onChange={e => setForm({...form, descripcion: e.target.value})}  style={INPUT} />
              <input placeholder="Precio"       type="number" value={form.precio}    onChange={e => setForm({...form, precio: e.target.value})}       style={INPUT} />
              <input placeholder="Stock actual" type="number" value={form.stock}     onChange={e => setForm({...form, stock: e.target.value})}        style={INPUT} />
              <input placeholder="Stock mínimo" type="number" value={form.stockMinimo} onChange={e => setForm({...form, stockMinimo: e.target.value})} style={INPUT} />
              <input placeholder="ID Proveedor (opcional)" value={form.proveedorId} onChange={e => setForm({...form, proveedorId: e.target.value})} style={INPUT} />
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '1.25rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setMostrarForm(false)} style={BTN_SECONDARY}>Cancelar</button>
              <button onClick={handleGuardar} style={BTN_PRIMARY}>Guardar</button>
            </div>
          </div>
        )}

        {/* ── Toolbar ── */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '1.25rem' }}>
          <div
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              flex: 1, maxWidth: '340px',
              padding: '0 12px',
              background: '#1e293b',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '8px',
              height: '38px',
            }}
          >
            <span style={{ color: '#475569', flexShrink: 0, display: 'flex' }}><IconSearch /></span>
            <input
              placeholder="Buscar producto..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '13px', color: '#e2e8f0', width: '100%' }}
            />
          </div>
          <button
            style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              padding: '0 16px',
              height: '38px',
              background: '#1e293b',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '8px',
              color: '#64748b',
              fontSize: '13px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            <IconFilter />
            Filtros
          </button>
        </div>

        {/* ── Table container ── */}
        <div
          style={{
            background: '#1e293b',
            borderRadius: '10px',
            border: '0.5px solid rgba(255,255,255,0.06)',
            overflow: 'hidden',
          }}
        >
          {productos.length === 0 ? (
            /* ── Empty state ── */
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4.5rem 2rem', gap: '14px' }}>
              <div
                style={{
                  width: '58px', height: '58px',
                  borderRadius: '12px',
                  background: 'rgba(99,102,241,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#6366f1',
                }}
              >
                <IconBox />
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '14px', fontWeight: '500', color: '#94a3b8', margin: 0 }}>
                  No hay productos registrados
                </p>
                <p style={{ fontSize: '13px', color: '#475569', margin: '5px 0 0' }}>
                  Agrega tu primer producto con el botón de arriba
                </p>
              </div>
            </div>
          ) : (
            <>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={TH}>Producto</th>
                    <th style={TH}>Descripción</th>
                    <th style={TH}>Precio</th>
                    <th style={TH}>Stock</th>
                    <th style={TH}>Mín.</th>
                    <th style={{ ...TH, textAlign: 'right' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productosFiltrados.map(p => {
                    const badge = stockBadge(p.stock, p.stockMinimo)
                    return (
                      <tr
                        key={p.id}
                        onMouseEnter={e => { if (editando !== p.id) e.currentTarget.style.background = 'rgba(255,255,255,0.018)' }}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        {/* Producto: ícono + nombre + descripción como SKU */}
                        <td style={TD}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div
                              style={{
                                width: '30px', height: '30px',
                                borderRadius: '6px',
                                background: 'rgba(99,102,241,0.2)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: '#a78bfa',
                                flexShrink: 0,
                              }}
                            >
                              <IconBox />
                            </div>
                            <div>
                              <p style={{ margin: 0, fontSize: '13px', fontWeight: '500', color: '#f1f5f9', lineHeight: 1.3 }}>{p.nombre}</p>
                              <p style={{ margin: 0, fontSize: '11px', color: '#64748b', lineHeight: 1.3 }}>{p.descripcion || '—'}</p>
                            </div>
                          </div>
                        </td>
                        <td style={{ ...TD, color: '#64748b', fontSize: '12px' }}>{p.descripcion || '—'}</td>
                        <td style={{ ...TD, color: '#e2e8f0', fontWeight: '500' }}>${p.precio}</td>
                        {/* Stock badge */}
                        <td style={TD}>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '3px 10px',
                              borderRadius: '5px',
                              fontSize: '12px',
                              fontWeight: '600',
                              background: badge.bg,
                              color: badge.color,
                            }}
                          >
                            {p.stock}
                          </span>
                        </td>
                        <td style={{ ...TD, color: '#64748b' }}>{p.stockMinimo}</td>
                        <td style={{ ...TD, textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            <button
                              onClick={() => handleEditar(p)}
                              title="Editar"
                              style={{
                                width: '28px', height: '28px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: 'rgba(255,255,255,0.06)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '6px',
                                color: '#94a3b8',
                                cursor: 'pointer',
                                padding: 0,
                              }}
                            >
                              <IconEdit />
                            </button>
                            <button
                              onClick={() => handleEliminar(p.id)}
                              title="Eliminar"
                              style={{
                                width: '28px', height: '28px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: 'rgba(248,113,113,0.1)',
                                border: '1px solid rgba(248,113,113,0.18)',
                                borderRadius: '6px',
                                color: '#f87171',
                                cursor: 'pointer',
                                padding: 0,
                              }}
                            >
                              <IconTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>

              {busqueda && productosFiltrados.length === 0 && (
                <div style={{ padding: '2.5rem', textAlign: 'center', color: '#475569', fontSize: '13px' }}>
                  Sin resultados para &ldquo;{busqueda}&rdquo;
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default Inventario
