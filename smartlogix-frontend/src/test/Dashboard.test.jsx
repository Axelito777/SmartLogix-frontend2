import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import Dashboard from '../pages/Dashboard/Dashboard'

vi.mock('axios')

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

const renderDashboard = () =>
  render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <Dashboard />
    </MemoryRouter>
  )

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.setItem('token', 'fake-token')
    axios.get.mockResolvedValue({ data: [] })
  })

  it('redirige a login si no hay token', () => {
    localStorage.clear()
    renderDashboard()
    expect(mockNavigate).toHaveBeenCalledWith('/login')
  })

  it('renderiza el título de bienvenida', async () => {
    renderDashboard()
    expect(await screen.findByText('Bienvenido')).toBeInTheDocument()
  })

  it('renderiza las tarjetas de métricas', async () => {
    renderDashboard()
    await waitFor(() => {
      expect(screen.getByText('Total pedidos')).toBeInTheDocument()
      expect(screen.getByText('Envíos en camino')).toBeInTheDocument()
      expect(screen.getByText('Stock bajo')).toBeInTheDocument()
    })
    expect(screen.getAllByText('Clientes').length).toBeGreaterThanOrEqual(1)
  })

  it('muestra "Sin pedidos" cuando no hay datos', async () => {
    axios.get.mockResolvedValue({ data: [] })
    renderDashboard()
    expect(await screen.findByText('Sin pedidos')).toBeInTheDocument()
  })

  it('muestra "Sin productos bajo stock" cuando no hay stock bajo', async () => {
    axios.get.mockResolvedValue({ data: [] })
    renderDashboard()
    expect(await screen.findByText('Sin productos bajo stock')).toBeInTheDocument()
  })

  it('muestra los pedidos recientes con datos', async () => {
    const pedidosMock = [
      { id: '1', clienteId: 'cliente-abc-123', estado: 'EN_CAMINO', total: 5000 },
      { id: '2', clienteId: 'cliente-xyz-456', estado: 'ENTREGADO', total: 3000 },
    ]
    axios.get
      .mockResolvedValueOnce({ data: pedidosMock })
      .mockResolvedValueOnce({ data: [] })
      .mockResolvedValueOnce({ data: [] })

    renderDashboard()

    await waitFor(() => {
      expect(screen.getByText('EN_CAMINO')).toBeInTheDocument()
      expect(screen.getByText('ENTREGADO')).toBeInTheDocument()
    })
  })
})
