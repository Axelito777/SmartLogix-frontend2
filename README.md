# SmartLogix Frontend

Panel de administración para la plataforma logística SmartLogix. Desarrollado con React + Vite.

## Requisitos previos

- Node.js 18 o superior
- npm 9 o superior
- Backend SmartLogix corriendo (Docker)

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/Axelito777/smartlogix-frontend.git

# Entrar a la carpeta
cd smartlogix-frontend

# Instalar dependencias
npm install
```

## Configuración

El frontend se conecta al Gateway en `http://localhost:8080`. Asegúrate de tener el backend corriendo antes de iniciar el frontend.

Para levantar el backend:
```bash
cd SmartLogix-backend
docker-compose up
```

## Ejecutar en desarrollo

```bash
npm run dev
```

Abre `http://localhost:5173` en tu navegador.

## Credenciales de prueba

Email: admin@smartlogix.com
Password: 123456

## Estructura del proyecto

src/
├── components/       # Componentes reutilizables (Sidebar)
├── pages/            # Páginas de la aplicación
│   ├── Login/        # Inicio de sesión
│   ├── Dashboard/    # Resumen general
│   ├── Clientes/     # Gestión de clientes
│   ├── Inventario/   # Gestión de productos y stock
│   ├── Pedidos/      # Gestión de pedidos
│   ├── Envios/       # Seguimiento de envíos
│   ├── Pagos/        # Historial de pagos
│   ├── Proveedores/  # Gestión de proveedores
│   ├── Notificaciones/ # Notificaciones del sistema
│   └── Reportes/     # Reportes de ventas e inventario
├── services/         # Configuración de axios
└── context/          # Contexto de autenticación

## Tecnologías

- React 18
- Vite
- React Router DOM
- Axios