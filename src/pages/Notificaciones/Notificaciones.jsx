import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Sidebar from '../../components/Sidebar'

const API = 'http://localhost:8080'

const card = { background: '#1e2d42', border: '1px solid rgba(0,200,255,0.15)', borderRadius: '12px', overflow: 'hidden' }

function Notificaciones() {
  const [notificaciones, setNotificaciones] = useState([])
  const navigate = useNavigate()

  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    axios.get(`${API}/api/notificaciones`, { headers }).then(r => setNotificaciones(r.data)).catch(() => {})
  }, [])

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#1a2332', overflow: 'hidden' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '2rem', boxSizing: 'border-box', overflowY: 'auto' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#7ef0ff', margin: '0 0 0.25rem' }}>Notificaciones</h1>
        <p style={{ fontSize: '13px', color: 'rgba(150,220,255,0.7)', margin: '0 0 1.5rem' }}>Historial de notificaciones del sistema</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {notificaciones.length === 0 ? (
            <div style={{ ...card, padding: '2rem', textAlign: 'center', color: 'rgba(150,220,255,0.4)' }}>
              No hay notificaciones
            </div>
          ) : (
            notificaciones.map(n => (
              <div key={n.id} style={{ ...card, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '20px' }}>🔔</span>
                  <div>
                    <p style={{ margin: 0, fontSize: '14px', color: 'rgba(200,240,255,0.9)', fontWeight: '500' }}>{n.mensaje}</p>
                    <p style={{ margin: 0, fontSize: '12px', color: 'rgba(150,220,255,0.5)' }}>Usuario: {n.usuarioId}</p>
                  </div>
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: 'rgba(150,220,255,0.4)' }}>{n.fechaEnvio?.slice(0, 10)}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Notificaciones