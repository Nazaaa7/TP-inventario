# TP-inventario

Sistema de gestión de inventario.

## Requisitos

- Node.js
- Docker & Docker Compose

## Ejecución con Docker Compose

1. Copiar el archivo de ejemplo de variables de entorno:
   ```bash
   cp .env.example .env
   ```
2. Levantar todo el entorno (API + Base de datos):
   ```bash
   docker-compose up --build
   ```

La API estará disponible en `http://localhost:4000`.

## Desarrollo local

1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Configurar variables de entorno (ver `.env.example`).
3. Iniciar base de datos (si no usas Docker para la DB).
4. Ejecutar:
   ```bash
   npm run dev
   ```
