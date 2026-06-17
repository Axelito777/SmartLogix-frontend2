import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import TopBar from '../../components/TopBar'

const API = 'http://localhost:8080'

/* ── inline SVG icons ── */
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
const IconEdit = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
)
const IconDelete = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
)
const IconUsers = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
)

function getInitials(nombre) {
  if (!nombre) return '?'
  const parts = nombre.trim().split(' ')
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : nombre.slice(0, 2).toUpperCase()
}

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

function Clientes() {
  const [clientes, setClientes]   = useState([])
  const [editando, setEditando]   = useState(null)
  const [form, setForm]           = useState({})
  const [busqueda, setBusqueda]   = useState('')
  const navigate = useNavigate()

  const token   = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    cargarClientes()
  }, [])

  /* ── lógica existente sin cambios ── */
  const cargarClientes = () => {
    axios.get(`${API}/api/clientes`, { headers }).then(r => setClientes(r.data)).catch(() => {})
  }

  const handleEditar = (cliente) => {
    setEditando(cliente.id)
    setForm({ nombre: cliente.nombre, rut: cliente.rut, email: cliente.email, telefono: cliente.telefono, direccion: cliente.direccion })
  }

  const handleGuardar = async (id) => {
    try {
      await axios.put(`${API}/api/clientes/${id}`, form, { headers })
      setEditando(null)
      cargarClientes()
    } catch {
      alert('Error al actualizar cliente')
    }
  }
  /* ─────────────────────────────────── */

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Eliminar este cliente?')) return
    try {
      await axios.delete(`${API}/api/clientes/${id}`, { headers })
      cargarClientes()
    } catch {
      alert('Error al eliminar cliente')
    }
  }

  const clientesFiltrados = clientes.filter(c =>
    !busqueda ||
    c.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.rut?.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.email?.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#0f172a', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <TopBar />

      <main style={{ flex: 1, padding: '2rem 2.5rem', overflowY: 'auto' }}>

        {/* ── Page header ── */}
        <div style={{ marginBottom: '1.75rem' }}>
          <h1 style={{ fontSize: '22px', fontWeight: '500', color: '#f1f5f9', margin: 0 }}>Clientes</h1>
          <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0' }}>Listado de clientes registrados</p>
        </div>

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
              placeholder="Buscar cliente..."
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
          {clientes.length === 0 ? (
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
                <IconUsers />
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '14px', fontWeight: '500', color: '#94a3b8', margin: 0 }}>
                  No hay clientes registrados
                </p>
                <p style={{ fontSize: '13px', color: '#475569', margin: '5px 0 0' }}>
                  Agrega tu primer cliente con el botón de arriba
                </p>
              </div>
            </div>
          ) : (
            <>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={TH}>Nombre</th>
                    <th style={TH}>Email</th>
                    <th style={TH}>Teléfono</th>
                    <th style={TH}>Dirección</th>
                    <th style={{ ...TH, textAlign: 'right' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {clientesFiltrados.map(c => (
                    <tr
                      key={c.id}
                      onMouseEnter={e => { if (editando !== c.id) e.currentTarget.style.background = 'rgba(255,255,255,0.018)' }}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      {editando === c.id ? (
                        <>
                          <td style={TD}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              <input value={form.nombre}   onChange={e => setForm({...form, nombre: e.target.value})}   placeholder="Nombre" style={INPUT} />
                              <input value={form.rut}      onChange={e => setForm({...form, rut: e.target.value})}      placeholder="RUT"    style={{ ...INPUT, fontSize: '12px' }} />
                            </div>
                          </td>
                          <td style={TD}><input value={form.email}     onChange={e => setForm({...form, email: e.target.value})}     placeholder="Email"     style={INPUT} /></td>
                          <td style={TD}><input value={form.telefono}  onChange={e => setForm({...form, telefono: e.target.value})}  placeholder="Teléfono"  style={INPUT} /></td>
                          <td style={TD}><input value={form.direccion} onChange={e => setForm({...form, direccion: e.target.value})} placeholder="Dirección" style={INPUT} /></td>
                          <td style={{ ...TD, textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                              <button
                                onClick={() => handleGuardar(c.id)}
                                style={{ padding: '6px 16px', background: '#4f46e5', border: 'none', borderRadius: '6px', color: '#fff', fontSize: '12px', fontWeight: '500', cursor: 'pointer' }}
                              >
                                Guardar
                              </button>
                              <button
                                onClick={() => setEditando(null)}
                                style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#64748b', fontSize: '12px', cursor: 'pointer' }}
                              >
                                Cancelar
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td style={TD}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div
                                style={{
                                  width: '30px', height: '30px',
                                  borderRadius: '6px',
                                  background: 'rgba(99,102,241,0.2)',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  fontSize: '10px', fontWeight: '700',
                                  color: '#a78bfa',
                                  flexShrink: 0,
                                  letterSpacing: '0.03em',
                                }}
                              >
                                {getInitials(c.nombre)}
                              </div>
                              <div>
                                <p style={{ margin: 0, fontSize: '13px', fontWeight: '500', color: '#f1f5f9', lineHeight: 1.3 }}>{c.nombre}</p>
                                <p style={{ margin: 0, fontSize: '11px', color: '#475569', lineHeight: 1.3 }}>{c.rut}</p>
                              </div>
                            </div>
                          </td>
                          <td style={TD}>{c.email}</td>
                          <td style={TD}>{c.telefono}</td>
                          <td style={TD}>{c.direccion}</td>
                          <td style={{ ...TD, textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: '6px' }}>
                              <button
                                onClick={() => handleEditar(c)}
                                title="Editar"
                                style={{
                                  width: '30px', height: '30px',
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
                                onClick={() => handleEliminar(c.id)}
                                title="Eliminar"
                                style={{
                                  width: '30px', height: '30px',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  background: 'rgba(248,113,113,0.1)',
                                  border: '1px solid rgba(248,113,113,0.18)',
                                  borderRadius: '6px',
                                  color: '#f87171',
                                  cursor: 'pointer',
                                  padding: 0,
                                }}
                              >
                                <IconDelete />
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Search no results */}
              {busqueda && clientesFiltrados.length === 0 && (
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

export default Clientes
