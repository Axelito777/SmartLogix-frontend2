import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Sidebar from '../../components/Sidebar'

const API = 'http://localhost:8080'

const card = { background: '#1e2d42', border: '1px solid rgba(0,200,255,0.15)', borderRadius: '12px', overflow: 'hidden' }
const th = { textAlign: 'left', padding: '12px 16px', color: 'rgba(150,220,255,0.6)', fontWeight: '500', borderBottom: '1px solid rgba(0,200,255,0.12)' }
const td = { padding: '12px 16px', color: 'rgba(200,240,255,0.9)', borderBottom: '1px solid rgba(0,200,255,0.06)' }
const inputStyle = { padding: '9px 12px', background: 'rgba(0,150,220,0.15)', border: '1px solid rgba(0,200,255,0.25)', borderRadius: '8px', fontSize: '13px', color: '#fff', outline: 'none', width: '100%', boxSizing: 'border-box' }

function Proveedores() {
  const [proveedores, setProveedores] = useState([])
  const [mostrarForm, setMostrarForm] = useState(false)
  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', direccion: '' })
  const navigate = useNavigate()

  const token = localStorage.getItem('token')
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
    } catch (err) {
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
    } catch (err) {
      alert('Error al eliminar proveedor')
    }
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#1a2332', overflow: 'hidden' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '2rem', boxSizing: 'border-box', overflowY: 'auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#7ef0ff', margin: '0 0 0.25rem' }}>Proveedores</h1>
            <p style={{ fontSize: '13px', color: 'rgba(150,220,255,0.7)', margin: 0 }}>Gestión de proveedores</p>
          </div>
          <button
            onClick={() => { setMostrarForm(!mostrarForm); setEditando(null); setForm({ nombre: '', email: '', telefono: '', direccion: '' }) }}
            style={{ padding: '10px 20px', background: mostrarForm ? 'rgba(255,255,255,0.08)' : 'rgba(0,160,220,0.35)', color: '#7ef0ff', border: '1px solid rgba(0,200,255,0.35)', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
            {mostrarForm ? 'Cancelar' : '+ Nuevo proveedor'}
          </button>
        </div>

        {/* Formulario */}
        {mostrarForm && (
          <div style={{ ...card, padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#7ef0ff', margin: '0 0 1rem' }}>
              {editando ? 'Editar proveedor' : 'Nuevo proveedor'}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <input placeholder="Nombre" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} style={inputStyle} />
              <input placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} style={inputStyle} />
              <input placeholder="Teléfono" value={form.telefono} onChange={e => setForm({...form, telefono: e.target.value})} style={inputStyle} />
              <input placeholder="Dirección" value={form.direccion} onChange={e => setForm({...form, direccion: e.target.value})} style={inputStyle} />
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '1rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setMostrarForm(false)} style={{ padding: '9px 18px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: 'rgba(200,240,255,0.8)', fontSize: '13px', cursor: 'pointer' }}>Cancelar</button>
              <button onClick={handleGuardar} style={{ padding: '9px 18px', background: 'rgba(0,160,220,0.4)', border: '1px solid rgba(0,200,255,0.4)', borderRadius: '8px', color: '#7ef0ff', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>Guardar</button>
            </div>
          </div>
        )}

        {/* Tabla */}
        <div style={card}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ background: 'rgba(0,150,220,0.1)' }}>
                <th style={th}>Nombre</th>
                <th style={th}>Email</th>
                <th style={th}>Teléfono</th>
                <th style={th}>Dirección</th>
                <th style={th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {proveedores.length === 0 ? (
                <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'rgba(150,220,255,0.4)' }}>No hay proveedores registrados</td></tr>
              ) : (
                proveedores.map(p => (
                  <tr key={p.id}>
                    <td style={td}>{p.nombre}</td>
                    <td style={td}>{p.email}</td>
                    <td style={td}>{p.telefono}</td>
                    <td style={td}>{p.direccion}</td>
                    <td style={td}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleEditar(p)} style={{ padding: '6px 12px', background: 'rgba(0,150,220,0.2)', border: '1px solid rgba(0,200,255,0.3)', borderRadius: '8px', color: '#7ef0ff', fontSize: '12px', cursor: 'pointer' }}>Editar</button>
                        <button onClick={() => handleEliminar(p.id)} style={{ padding: '6px 12px', background: 'rgba(192,57,43,0.2)', border: '1px solid rgba(231,76,60,0.3)', borderRadius: '8px', color: '#e74c3c', fontSize: '12px', cursor: 'pointer' }}>Eliminar</button>
                      </div>
                    </td>
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

export default Proveedores