# Backend NestJS Hexagonal API

## Descripción
API REST construida con NestJS siguiendo una arquitectura Hexagonal (Ports & Adapters).
Permite gestionar empresas y consultar información sobre adhesiones y transferencias.

## Requisitos
- Node.js (v18 o superior recomendado)
- NPM

## Instalación
```bash
npm install
```

## Ejecución
Para levantar el servidor localmente:
```bash
npm run start
```
- Servidor: `http://localhost:3000`
- Swagger Docs: `http://localhost:3000/docs`

## Endpoints

### 1. Registrar una nueva empresa
**POST** `/companies`
```json
{
  "name": "Nombre Empresa",
  "type": "Pyme",
  "joinedAt": "2025-12-01T10:00:00Z"
}
```
- `type`: `"Pyme"` o `"Corporativa"`
- `joinedAt`: Opcional, por defecto fecha actual

### 2. Obtener empresas adheridas en el último mes
**GET** `/companies/joined-last-month`

Retorna las empresas que se registraron el mes pasado.

### 3. Obtener empresas con transferencias en el último mes
**GET** `/companies/transfers-last-month`

Retorna las empresas que tienen transferencias en el mes pasado, junto con el detalle de cada transferencia:
```json
[
  {
    "company": {
      "id": "uuid",
      "name": "Empresa",
      "type": "Pyme",
      "joinedAt": "2025-11-15T10:00:00.000Z"
    },
    "transfers": [
      {
        "id": "uuid",
        "companyId": "uuid",
        "amount": 5000,
        "date": "2025-11-20T10:00:00.000Z"
      }
    ]
  }
]
```

### 4. Registrar una transferencia
**POST** `/companies/transfers`
```json
{
  "companyId": "uuid-de-la-empresa",
  "amount": 1000.50,
  "date": "2025-11-20T15:00:00Z"
}
```
- `companyId`: Requerido. Debe ser un ID de empresa existente.
- `amount`: Monto de la transferencia (mínimo 0.01)
- `date`: Opcional, por defecto fecha actual

## Documentación Swagger
Disponible en `/docs` con documentación interactiva de todos los endpoints.

## Arquitectura
El proyecto sigue los principios de Clean Architecture / Hexagonal:
- **Domain**: Entidades y Puertos (Interfaces de Repositorios). Independiente de frameworks.
- **Application**: Casos de Uso. Contiene la lógica de negocio.
- **Infrastructure**: Adaptadores (Controladores, Repositorios TypeORM, Entidades ORM).

## Base de Datos
Utiliza SQLite (`database.sqlite`). El archivo se crea automáticamente en la raíz del proyecto.
TypeORM está configurado con `synchronize: true` para desarrollo local.
