import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import TopBar from '../../components/TopBar'

const API = 'http://localhost:8080'

/* ── Icons ── */
const IconPlus = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)
const IconSearch = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)
const IconFilter = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="6" x2="20" y2="6"/>
    <line x1="8" y1="12" x2="16" y2="12"/>
    <line x1="11" y1="18" x2="13" y2="18"/>
  </svg>
)
const IconEdit = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
)
const IconTrash = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
)
const IconStore = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l1-4h16l1 4"/>
    <path d="M3 9a2 2 0 0 0 2 2 2 2 0 0 0 2-2 2 2 0 0 0 2 2 2 2 0 0 0 2-2 2 2 0 0 0 2 2 2 2 0 0 0 2-2"/>
    <path d="M5 11v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8"/>
    <rect x="9" y="14" width="6" height="5" rx="1"/>
  </svg>
)
const IconX = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

const getInitials = (nombre) => {
  if (!nombre) return '?'
  const parts = nombre.trim().split(' ')
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : nombre.slice(0, 2).toUpperCase()
}

const inputStyle = {
  padding: '9px 12px',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '7px',
  color: '#e2e8f0',
  fontSize: '13px',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
}

function Proveedores() {
  const [proveedores, setProveedores] = useState([])
  const [mostrarForm, setMostrarForm] = useState(false)
  const [editando, setEditando]       = useState(null)
  const [form, setForm]               = useState({ nombre: '', email: '', telefono: '', direccion: '' })
  const [busqueda, setBusqueda]       = useState('')
  const navigate = useNavigate()

  const token   = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    cargarProveedores()
  }, [])

  const cargarProveedores = () => {
    axios.get(`${API}/api/proveedores`, { headers }).then(r => setProveedores(r.data)).catch(() => {})
  }

  const handleGuardar = async () => {
    try {
      if (editando) {
        await axios.put(`${API}/api/proveedores/${editando}`, form, { headers })
        setEditando(null)
      } else {
        await axios.post(`${API}/api/proveedores`, form, { headers })
      }
      setForm({ nombre: '', email: '', telefono: '', direccion: '' })
      setMostrarForm(false)
      cargarProveedores()
    } catch {
      alert('Error al guardar proveedor')
    }
  }

  const handleEditar = (p) => {
    setEditando(p.id)
    setForm({ nombre: p.nombre, email: p.email, telefono: p.telefono, direccion: p.direccion })
    setMostrarForm(true)
  }

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Eliminar este proveedor?')) return
    try {
      await axios.delete(`${API}/api/proveedores/${id}`, { headers })
      cargarProveedores()
    } catch {
      alert('Error al eliminar proveedor')
    }
  }

  const term = busqueda.toLowerCase()
  const filtrados = proveedores.filter(p =>
    (p.nombre?.toLowerCase().includes(term)) ||
    (p.email?.toLowerCase().includes(term)) ||
    (p.telefono?.toLowerCase().includes(term))
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#0f172a', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <TopBar />

      <main style={{ flex: 1, padding: '2rem 2.5rem', overflowY: 'auto' }}>

        {/* ── Page header ── */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: '500', color: '#f1f5f9', margin: 0 }}>Proveedores</h1>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0' }}>Gestión de proveedores</p>
          </div>
          <button
            onClick={() => { setMostrarForm(!mostrarForm); setEditando(null); setForm({ nombre: '', email: '', telefono: '', direccion: '' }) }}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '9px 16px',
              background: mostrarForm ? 'rgba(255,255,255,0.06)' : '#4f46e5',
              border: mostrarForm ? '1px solid rgba(255,255,255,0.08)' : 'none',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            {mostrarForm ? <IconX /> : <IconPlus />}
            {mostrarForm ? 'Cancelar' : 'Nuevo proveedor'}
          </button>
        </div>

        {/* ── Form panel ── */}
        {mostrarForm && (
          <div style={{
            background: '#1e293b',
            border: '0.5px solid rgba(255,255,255,0.08)',
            borderRadius: '10px',
            padding: '20px',
            marginBottom: '1.25rem',
          }}>
            <h3 style={{ fontSize: '13px', fontWeight: '600', color: '#a78bfa', margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {editando ? 'Editar proveedor' : 'Nuevo proveedor'}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <input placeholder="Nombre"    value={form.nombre}    onChange={e => setForm({ ...form, nombre:    e.target.value })} style={inputStyle} />
              <input placeholder="Email"     value={form.email}     onChange={e => setForm({ ...form, email:     e.target.value })} style={inputStyle} />
              <input placeholder="Teléfono"  value={form.telefono}  onChange={e => setForm({ ...form, telefono:  e.target.value })} style={inputStyle} />
              <input placeholder="Dirección" value={form.direccion} onChange={e => setForm({ ...form, direccion: e.target.value })} style={inputStyle} />
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '14px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setMostrarForm(false)}
                style={{
                  padding: '8px 16px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '7px',
                  color: '#94a3b8',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleGuardar}
                style={{
                  padding: '8px 20px',
                  background: '#4f46e5',
                  border: 'none',
                  borderRadius: '7px',
                  color: '#fff',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: 'pointer',
                }}
              >
                Guardar
              </button>
            </div>
          </div>
        )}

        {/* ── Toolbar ── */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#475569', display: 'flex' }}>
              <IconSearch />
            </span>
            <input
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              placeholder="Buscar proveedor..."
              style={{
                width: '100%',
                padding: '9px 12px 9px 36px',
                background: '#1e293b',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '8px',
                color: '#e2e8f0',
                fontSize: '13px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <button
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '9px 14px',
              background: '#1e293b',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '8px',
              color: '#94a3b8',
              fontSize: '13px',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <IconFilter />
            Filtros
          </button>
        </div>

        {/* ── Table ── */}
        <div style={{
          background: '#1e293b',
          borderRadius: '10px',
          border: '0.5px solid rgba(255,255,255,0.06)',
          overflow: 'hidden',
        }}>
          {filtrados.length === 0 ? (
            <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
              <div style={{
                width: '56px', height: '56px',
                borderRadius: '14px',
                background: 'rgba(99,102,241,0.12)',
                color: '#6366f1',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px',
              }}>
                <IconStore />
              </div>
              <p style={{ fontSize: '14px', fontWeight: '500', color: '#94a3b8', margin: '0 0 6px' }}>
                {busqueda ? 'Sin resultados para tu búsqueda' : 'No hay proveedores registrados'}
              </p>
              <p style={{ fontSize: '13px', color: '#475569', margin: 0 }}>
                {busqueda ? 'Intenta con otro término' : 'Agrega tu primer proveedor con el botón de arriba'}
              </p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Nombre', 'Email', 'Teléfono', 'Dirección', 'Acciones'].map(col => (
                    <th
                      key={col}
                      style={{
                        textAlign: 'left',
                        padding: '12px 20px',
                        fontSize: '11px',
                        fontWeight: '500',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        color: '#64748b',
                        borderBottom: '0.5px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtrados.map((p, idx) => {
                  const sep = { borderBottom: idx < filtrados.length - 1 ? '0.5px solid rgba(255,255,255,0.04)' : 'none' }
                  const cell = { padding: '14px 20px', fontSize: '13px', color: '#94a3b8', ...sep }
                  return (
                    <tr key={p.id}>
                      <td style={{ ...cell }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '30px', height: '30px',
                            borderRadius: '6px',
                            background: 'rgba(99,102,241,0.2)',
                            color: '#a78bfa',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '11px',
                            fontWeight: '600',
                            flexShrink: 0,
                          }}>
                            {getInitials(p.nombre)}
                          </div>
                          <span style={{ fontWeight: '500', color: '#f1f5f9', fontSize: '13px' }}>{p.nombre}</span>
                        </div>
                      </td>
                      <td style={cell}>{p.email}</td>
                      <td style={cell}>{p.telefono}</td>
                      <td style={cell}>{p.direccion}</td>
                      <td style={{ ...cell }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            onClick={() => handleEditar(p)}
                            title="Editar"
                            style={{
                              width: '28px', height: '28px',
                              borderRadius: '6px',
                              background: 'rgba(255,255,255,0.04)',
                              border: '0.5px solid rgba(255,255,255,0.08)',
                              color: '#94a3b8',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              cursor: 'pointer',
                            }}
                          >
                            <IconEdit />
                          </button>
                          <button
                            onClick={() => handleEliminar(p.id)}
                            title="Eliminar"
                            style={{
                              width: '28px', height: '28px',
                              borderRadius: '6px',
                              background: 'rgba(255,255,255,0.04)',
                              border: '0.5px solid rgba(255,255,255,0.08)',
                              color: '#f87171',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              cursor: 'pointer',
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
          )}
        </div>
      </main>
    </div>
  )
}

export default Proveedores
