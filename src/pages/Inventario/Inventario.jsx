import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Sidebar from '../../components/Sidebar'

const API = 'http://localhost:8080'
const card = { background: '#1e2d42', border: '1px solid rgba(0,200,255,0.15)', borderRadius: '12px', overflow: 'hidden' }
const th = { textAlign: 'left', padding: '12px 16px', color: 'rgba(150,220,255,0.6)', fontWeight: '500', borderBottom: '1px solid rgba(0,200,255,0.12)' }
const td = { padding: '12px 16px', color: 'rgba(200,240,255,0.9)', borderBottom: '1px solid rgba(0,200,255,0.06)' }
const input = { padding: '9px 12px', background: 'rgba(0,150,220,0.15)', border: '1px solid rgba(0,200,255,0.25)', borderRadius: '8px', fontSize: '13px', color: '#fff', outline: 'none', width: '100%', boxSizing: 'border-box' }

function Inventario() {
  const [productos, setProductos] = useState([])
  const [mostrarForm, setMostrarForm] = useState(false)
  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState({ nombre: '', descripcion: '', precio: '', stock: '', stockMinimo: '', bodegaId: '', proveedorId: '' })
  const navigate = useNavigate()

  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    cargarProductos()
  }, [])

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
    } catch (err) {
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
    } catch (err) {
      alert('Error al eliminar producto')
    }
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#1a2332', overflow: 'hidden' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '2rem', boxSizing: 'border-box', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#7ef0ff', margin: '0 0 0.25rem' }}>Inventario</h1>
            <p style={{ fontSize: '13px', color: 'rgba(150,220,255,0.7)', margin: 0 }}>Gestión de productos y stock</p>
          </div>
          <button
            onClick={() => { setMostrarForm(!mostrarForm); setEditando(null); setForm({ nombre: '', descripcion: '', precio: '', stock: '', stockMinimo: '', bodegaId: '', proveedorId: '' }) }}
            style={{ padding: '10px 20px', background: 'rgba(0,160,220,0.3)', border: '1px solid rgba(0,200,255,0.4)', borderRadius: '10px', color: '#7ef0ff', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
          >
            {mostrarForm ? 'Cancelar' : '+ Nuevo producto'}
          </button>
        </div>

        {mostrarForm && (
          <div style={{ background: '#1e2d42', border: '1px solid rgba(0,200,255,0.2)', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#7ef0ff', margin: '0 0 1rem' }}>{editando ? 'Editar producto' : 'Nuevo producto'}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <input placeholder="Nombre" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} style={input} />
              <input placeholder="Descripción" value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} style={input} />
              <input placeholder="Precio" type="number" value={form.precio} onChange={e => setForm({...form, precio: e.target.value})} style={input} />
              <input placeholder="Stock actual" type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} style={input} />
              <input placeholder="Stock mínimo" type="number" value={form.stockMinimo} onChange={e => setForm({...form, stockMinimo: e.target.value})} style={input} />
              <input placeholder="ID Proveedor (opcional)" value={form.proveedorId} onChange={e => setForm({...form, proveedorId: e.target.value})} style={input} />
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '1rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setMostrarForm(false)} style={{ padding: '9px 18px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: 'rgba(200,240,255,0.8)', fontSize: '14px', cursor: 'pointer' }}>Cancelar</button>
              <button onClick={handleGuardar} style={{ padding: '9px 18px', background: 'rgba(0,160,220,0.4)', border: '1px solid rgba(0,200,255,0.4)', borderRadius: '8px', color: '#7ef0ff', fontSize: '14px', cursor: 'pointer' }}>Guardar</button>
            </div>
          </div>
        )}

        <div style={card}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ background: 'rgba(0,150,220,0.1)' }}>
                <th style={th}>Nombre</th>
                <th style={th}>Descripción</th>
                <th style={th}>Precio</th>
                <th style={th}>Stock</th>
                <th style={th}>Stock mín.</th>
                <th style={th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.length === 0 ? (
                <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'rgba(150,220,255,0.4)' }}>No hay productos registrados</td></tr>
              ) : (
                productos.map(p => (
                  <tr key={p.id}>
                    <td style={td}>{p.nombre}</td>
                    <td style={td}>{p.descripcion}</td>
                    <td style={td}>${p.precio}</td>
                    <td style={td}>
                      <span style={{ color: p.stock <= p.stockMinimo ? '#ff9999' : '#7effc0', fontWeight: '600' }}>{p.stock}</span>
                    </td>
                    <td style={td}>{p.stockMinimo}</td>
                    <td style={td}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleEditar(p)} style={{ padding: '6px 12px', background: 'rgba(0,150,220,0.2)', border: '1px solid rgba(0,200,255,0.3)', borderRadius: '8px', color: '#7ef0ff', fontSize: '12px', cursor: 'pointer' }}>Editar</button>
                        <button onClick={() => handleEliminar(p.id)} style={{ padding: '6px 12px', background: 'rgba(255,80,80,0.2)', border: '1px solid rgba(255,100,100,0.3)', borderRadius: '8px', color: '#ffbbbb', fontSize: '12px', cursor: 'pointer' }}>Eliminar</button>
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

export default Inventario