import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login/Login'
import Dashboard from './pages/Dashboard/Dashboard'
import Clientes from './pages/Clientes/Clientes'
import Inventario from './pages/Inventario/Inventario'
import Pedidos from './pages/Pedidos/Pedidos'
import Envios from './pages/Envios/Envios'
import Pagos from './pages/Pagos/Pagos'
import Proveedores from './pages/Proveedores/Proveedores'
import Notificaciones from './pages/Notificaciones/Notificaciones'
import Reportes from './pages/Reportes/Reportes'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/inventario" element={<Inventario />} />
        <Route path="/pedidos" element={<Pedidos />} />
        <Route path="/envios" element={<Envios />} />
        <Route path="/pagos" element={<Pagos />} />
        <Route path="/proveedores" element={<Proveedores />} />
        <Route path="/notificaciones" element={<Notificaciones />} />
        <Route path="/reportes" element={<Reportes />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App