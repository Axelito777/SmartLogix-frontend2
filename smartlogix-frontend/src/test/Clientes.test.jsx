import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import Clientes from '../pages/Clientes/Clientes'

vi.mock('axios')

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

const clientesMock = [
  { id: '1', nombre: 'Juan Pérez', rut: '12.345.678-9', email: 'juan@test.com', telefono: '+56912345678', direccion: 'Av. Siempreviva 742' },
  { id: '2', nombre: 'María García', rut: '98.765.432-1', email: 'maria@test.com', telefono: '+56987654321', direccion: 'Calle Falsa 123' },
]

const renderClientes = () =>
  render(
    <MemoryRouter initialEntries={['/clientes']}>
      <Clientes />
    </MemoryRouter>
  )

describe('Clientes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.setItem('token', 'fake-token')
  })

  it('redirige a login si no hay token', () => {
    localStorage.clear()
    axios.get.mockResolvedValue({ data: [] })
    renderClientes()
    expect(mockNavigate).toHaveBeenCalledWith('/login')
  })

  it('renderiza el título de la página', async () => {
    axios.get.mockResolvedValue({ data: [] })
    renderClientes()
    const titulo = await screen.findByRole('heading', { name: 'Clientes' })
    expect(titulo).toBeInTheDocument()
  })

  it('muestra mensaje cuando no hay clientes', async () => {
    axios.get.mockResolvedValue({ data: [] })
    renderClientes()
    expect(await screen.findByText('No hay clientes registrados')).toBeInTheDocument()
  })

  it('muestra la lista de clientes cargados', async () => {
    axios.get.mockResolvedValue({ data: clientesMock })
    renderClientes()

    await waitFor(() => {
      expect(screen.getByText('Juan Pérez')).toBeInTheDocument()
      expect(screen.getByText('María García')).toBeInTheDocument()
      expect(screen.getByText('12.345.678-9')).toBeInTheDocument()
      expect(screen.getByText('juan@test.com')).toBeInTheDocument()
    })
  })

  it('activa el modo edición al hacer click en Editar', async () => {
    axios.get.mockResolvedValue({ data: clientesMock })
    renderClientes()

    const botones = await screen.findAllByText('Editar')
    fireEvent.click(botones[0])

    await waitFor(() => {
      expect(screen.getByText('Guardar')).toBeInTheDocument()
      expect(screen.getByText('Cancelar')).toBeInTheDocument()
    })
  })

  it('cancela la edición al hacer click en Cancelar', async () => {
    axios.get.mockResolvedValue({ data: clientesMock })
    renderClientes()

    const botones = await screen.findAllByText('Editar')
    fireEvent.click(botones[0])
    fireEvent.click(await screen.findByText('Cancelar'))

    await waitFor(() => {
      expect(screen.queryByText('Guardar')).not.toBeInTheDocument()
    })
  })

  it('guarda los cambios al editar un cliente', async () => {
    axios.get.mockResolvedValue({ data: clientesMock })
    axios.put.mockResolvedValueOnce({ data: {} })
    renderClientes()

    const botones = await screen.findAllByText('Editar')
    fireEvent.click(botones[0])

    const inputs = screen.getAllByRole('textbox')
    fireEvent.change(inputs[0], { target: { value: 'Juan Actualizado' } })
    fireEvent.click(screen.getByText('Guardar'))

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        'http://localhost:8080/api/clientes/1',
        expect.objectContaining({ nombre: 'Juan Actualizado' }),
        expect.any(Object)
      )
    })
  })
})
