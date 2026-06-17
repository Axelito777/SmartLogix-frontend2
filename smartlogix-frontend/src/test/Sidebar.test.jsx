import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import Sidebar from '../components/Sidebar'

const renderSidebar = (initialPath = '/dashboard') =>
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Sidebar />
    </MemoryRouter>
  )

describe('Sidebar', () => {
  it('muestra el nombre de la aplicación', () => {
    renderSidebar()
    expect(screen.getByText('SMARTLOGIX')).toBeInTheDocument()
  })

  it('renderiza todos los items de navegación', () => {
    renderSidebar()
    const items = ['Dashboard', 'Clientes', 'Inventario', 'Pedidos', 'Envíos', 'Pagos', 'Proveedores', 'Notificaciones', 'Reportes']
    items.forEach(label => {
      expect(screen.getByText(label)).toBeInTheDocument()
    })
  })

  it('marca el item activo según la ruta actual', () => {
    renderSidebar('/clientes')
    const clientesItem = screen.getByText('Clientes')
    expect(clientesItem).toHaveStyle({ fontWeight: '600' })
  })

  it('los items inactivos tienen menor peso de fuente', () => {
    renderSidebar('/dashboard')
    const clientesItem = screen.getByText('Clientes')
    expect(clientesItem).toHaveStyle({ fontWeight: '400' })
  })
})
