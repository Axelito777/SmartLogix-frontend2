import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Sidebar from '../../components/Sidebar'

const API = 'http://localhost:8080'
const card = { background: '#1e2d42', border: '1px solid rgba(0,200,255,0.15)', borderRadius: '12px', overflow: 'hidden' }
const th = { textAlign: 'left', padding: '12px 16px', color: 'rgba(150,220,255,0.6)', fontWeight: '500', borderBottom: '1px solid rgba(0,200,255,0.12)' }
const td = { padding: '12px 16px', color: 'rgba(200,240,255,0.9)', borderBottom: '1px solid rgba(0,200,255,0.06)' }
const input = { padding: '9px 12px', background: 'rgba(0,150,220,0.15)', border: '1px solid rgba(0,200,255,0.25)', borderRadius: '8px', fontSize: '13px', color: '#fff', outline: 'none', width: '100%', boxSizing: 'border-box' }

function Clientes() {
  const [clientes, setClientes] = useState([])
  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState({})
  const navigate = useNavigate()

  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    cargarClientes()
  }, [])

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
    } catch (err) {
      alert('Error al actualizar cliente')
    }
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#1a2332', overflow: 'hidden' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '2rem', boxSizing: 'border-box', overflowY: 'auto' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#7ef0ff', margin: '0 0 0.25rem' }}>Clientes</h1>
        <p style={{ fontSize: '13px', color: 'rgba(150,220,255,0.7)', margin: '0 0 1.5rem' }}>Listado de clientes registrados</p>

        <div style={card}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ background: 'rgba(0,150,220,0.1)' }}>
                <th style={th}>Nombre</th>
                <th style={th}>RUT</th>
                <th style={th}>Email</th>
                <th style={th}>Teléfono</th>
                <th style={th}>Dirección</th>
                <th style={th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientes.length === 0 ? (
                <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'rgba(150,220,255,0.4)' }}>No hay clientes registrados</td></tr>
              ) : (
                clientes.map(c => (
                  <tr key={c.id}>
                    {editando === c.id ? (
                      <>
                        <td style={td}><input value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} style={input} /></td>
                        <td style={td}><input value={form.rut} onChange={e => setForm({...form, rut: e.target.value})} style={input} /></td>
                        <td style={td}><input value={form.email} onChange={e => setForm({...form, email: e.target.value})} style={input} /></td>
                        <td style={td}><input value={form.telefono} onChange={e => setForm({...form, telefono: e.target.value})} style={input} /></td>
                        <td style={td}><input value={form.direccion} onChange={e => setForm({...form, direccion: e.target.value})} style={input} /></td>
                        <td style={td}>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={() => handleGuardar(c.id)} style={{ padding: '6px 12px', background: 'rgba(0,160,220,0.4)', border: '1px solid rgba(0,200,255,0.4)', borderRadius: '8px', color: '#7ef0ff', fontSize: '12px', cursor: 'pointer' }}>Guardar</button>
                            <button onClick={() => setEditando(null)} style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: 'rgba(200,240,255,0.8)', fontSize: '12px', cursor: 'pointer' }}>Cancelar</button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td style={td}>{c.nombre}</td>
                        <td style={td}>{c.rut}</td>
                        <td style={td}>{c.email}</td>
                        <td style={td}>{c.telefono}</td>
                        <td style={td}>{c.direccion}</td>
                        <td style={td}>
                          <button onClick={() => handleEditar(c)} style={{ padding: '6px 12px', background: 'rgba(0,150,220,0.2)', border: '1px solid rgba(0,200,255,0.3)', borderRadius: '8px', color: '#7ef0ff', fontSize: '12px', cursor: 'pointer' }}>Editar</button>
                        </td>
                      </>
                    )}
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

export default Clientes