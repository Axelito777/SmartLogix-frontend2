import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import Login from '../pages/Login/Login'

vi.mock('axios')

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

const renderLogin = () =>
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  )

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('renderiza el formulario de login', () => {
    renderLogin()
    expect(screen.getByText('SMARTLOGIX')).toBeInTheDocument()
    expect(screen.getByText('INICIO DE SESIÓN')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Correo electrónico')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Contraseña')).toBeInTheDocument()
    expect(screen.getByText('Ingresar')).toBeInTheDocument()
  })

  it('muestra error cuando los campos están vacíos', async () => {
    renderLogin()
    fireEvent.click(screen.getByText('Ingresar'))
    expect(await screen.findByText('Por favor completa todos los campos')).toBeInTheDocument()
  })

  it('muestra error cuando solo se ingresa email', async () => {
    renderLogin()
    fireEvent.change(screen.getByPlaceholderText('Correo electrónico'), { target: { value: 'test@test.com' } })
    fireEvent.click(screen.getByText('Ingresar'))
    expect(await screen.findByText('Por favor completa todos los campos')).toBeInTheDocument()
  })

  it('llama a axios y redirige al dashboard en login exitoso', async () => {
    axios.post.mockResolvedValueOnce({ data: { token: 'fake-token-123' } })
    renderLogin()

    fireEvent.change(screen.getByPlaceholderText('Correo electrónico'), { target: { value: 'admin@test.com' } })
    fireEvent.change(screen.getByPlaceholderText('Contraseña'), { target: { value: 'password123' } })
    fireEvent.click(screen.getByText('Ingresar'))

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe('fake-token-123')
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('muestra error de credenciales cuando el login falla', async () => {
    axios.post.mockRejectedValueOnce(new Error('Unauthorized'))
    renderLogin()

    fireEvent.change(screen.getByPlaceholderText('Correo electrónico'), { target: { value: 'wrong@test.com' } })
    fireEvent.change(screen.getByPlaceholderText('Contraseña'), { target: { value: 'wrongpass' } })
    fireEvent.click(screen.getByText('Ingresar'))

    expect(await screen.findByText('Correo o contraseña incorrectos')).toBeInTheDocument()
  })
})
