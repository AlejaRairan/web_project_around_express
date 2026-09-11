# Tripleten web_project_around_express
# Around the US API

API REST para la aplicación "Alrededor de los EE. UU." — gestiona usuarios y tarjetas (cards) con foto, con autorización mediante JWT.

## Servidor

- **API desplegada en:** https://api.wtwrr.chickenkiller.com
- **Frontend:** https://wtwrr.chickenkiller.com

## Tecnologías

- Node.js / Express 5
- MongoDB / Mongoose
- JSON Web Tokens (jsonwebtoken) para autorización
- bcryptjs para hash de contraseñas
- celebrate / Joi para validación de solicitudes
- winston / express-winston para logging de requests y errores
- cors para habilitar solicitudes cross-origin
- dotenv para variables de entorno
- ESLint (airbnb-base) para linting
- PM2 para gestión del proceso en producción
- nginx como proxy inverso, con certificados SSL (Let's Encrypt / Certbot)

## Estructura del proyecto

```
├── app.js
├── controllers/
│   ├── users.js
│   └── cards.js
├── models/
│   ├── user.js
│   └── card.js
├── routes/
│   ├── users.js
│   └── cards.js
├── middlewares/
│   ├── auth.js
│   ├── errorhandler.js
│   ├── logger.js
│   └── validators.js
├── errors/
│   ├── not-found-error.js
│   ├── bad-request-error.js
│   ├── unauthorized-error.js
│   ├── forbidden-error.js
│   └── conflict-error.js
└── .env (solo en el servidor, no versionado)
```

## Rutas de la API

### Públicas (sin autorización)

| Método | Ruta       | Descripción                          |
|--------|------------|---------------------------------------|
| POST   | /signup    | Registra un nuevo usuario             |
| POST   | /signin    | Inicia sesión y devuelve un JWT       |

### Protegidas (requieren header `Authorization: Bearer <token>`)

| Método | Ruta                  | Descripción                              |
|--------|------------------------|-------------------------------------------|
| GET    | /users                | Devuelve todos los usuarios                |
| GET    | /users/me             | Devuelve el usuario autenticado            |
| GET    | /users/:id            | Devuelve un usuario por ID                 |
| PATCH  | /users/me             | Actualiza el nombre y la descripción       |
| PATCH  | /users/me/avatar      | Actualiza el avatar                        |
| GET    | /cards                | Devuelve todas las tarjetas                |
| POST   | /cards                | Crea una nueva tarjeta                     |
| DELETE | /cards/:cardId        | Elimina una tarjeta (solo si es del dueño) |
| PUT    | /cards/:cardId/likes  | Da "me gusta" a una tarjeta                |
| DELETE | /cards/:cardId/likes  | Quita el "me gusta" de una tarjeta         |

## Instalación y ejecución local

```bash
npm install
npm run dev
```

El servidor corre por defecto en el puerto `3000`.

En modo desarrollo (`NODE_ENV !== 'production'`), el proyecto funciona sin un archivo `.env`, usando valores por defecto internos.

## Variables de entorno (producción)

Crear un archivo `.env` en la raíz del proyecto **solo en el servidor** (no se sube al repositorio):

```
NODE_ENV=production
JWT_SECRET=<clave secreta larga y aleatoria>
```

## Despliegue

El proyecto corre en una VM de Google Cloud, gestionado con PM2 para reinicio automático ante caídas, y servido a través de nginx como proxy inverso con certificado SSL, permitiendo el acceso vía HTTPS por el dominio registrado.
