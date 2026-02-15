# Task Manager

Gestor de tareas para cuentas individuales con registro público. Permite crear proyectos, gestionar tareas, aplicar filtros, ver reportes y exportar a CSV.

## Features v1

- **Autenticación**: Signup, Login, Logout con sesiones HttpOnly (cookies firmadas)
- **Dashboard**: Estadísticas básicas (total, completadas, pendientes, vencidas)
- **Proyectos**: CRUD completo
- **Tareas**: CRUD con título, descripción, estado, prioridad, proyecto opcional, fecha vencimiento, horas estimadas/reales
- **Búsqueda y filtros**: Por texto, estado, prioridad y proyecto
- **Reportes**: Conteo por estado y tareas por proyecto
- **Export CSV**: Descarga de tareas en formato CSV

> Fuera de alcance v1: notificaciones, comentarios, auditoría detallada (diseñado para agregar en v1.1).

## Stack

- **Frontend/Backend**: Next.js 14 (App Router) + TypeScript
- **Estilos**: Tailwind CSS
- **Base de datos**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Validación**: Zod
- **Utilidades**: clsx, tailwind-merge
- **Autenticación**: iron-session (cookies firmadas), Argon2id para hashing de passwords

## Setup local

### 1. Clonar e instalar dependencias

```bash
cd TaskManager
npm install
```

### 2. Configurar variables de entorno

Copia el archivo de ejemplo y configura tus variables:

```bash
cp .env.example .env
```

Edita `.env` con:

- **DATABASE_URL**: URL de conexión a PostgreSQL (Neon). Formato:  
  `postgresql://user:password@host.neon.tech/dbname?sslmode=require`
- **SESSION_SECRET**: Clave secreta de al menos 32 caracteres para firmar las sesiones. Generar con:

```bash
openssl rand -base64 32
```

### 3. Configurar base de datos y Prisma

```bash
npm run prisma:generate
npm run prisma:migrate
```

Si es la primera vez, Prisma te pedirá un nombre para la migración (ej: `init`).

### 4. Iniciar servidor de desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

### Comandos útiles

| Comando            | Descripción                    |
| ------------------ | ------------------------------ |
| `npm run dev`      | Servidor de desarrollo         |
| `npm run build`    | Build de producción            |
| `npm run start`    | Servidor de producción         |
| `npm run lint`     | Ejecutar ESLint                |
| `npm run prisma:generate` | Generar cliente Prisma |
| `npm run prisma:migrate`  | Aplicar migraciones      |
| `npm run prisma:studio`   | Abrir Prisma Studio      |

## Variables de entorno en Vercel

1. En el proyecto de Vercel, ve a **Settings** → **Environment Variables**
2. Añade:
   - `DATABASE_URL`: URL de Neon (usar la opción "Connection pooling" de Neon para serverless)
   - `SESSION_SECRET`: Mismo valor que en local (generado con `openssl rand -base64 32`)

## Deploy a Vercel

1. Sube el repo a GitHub (o conecta tu repositorio en Vercel).
2. En [vercel.com](https://vercel.com), crea un **New Project** e importa el repositorio.
3. Configura las variables de entorno (ver sección anterior).
4. **Build Command**: `npm run build`
5. **Output Directory**: `.next` (por defecto en Next.js)
6. **Install Command**: `npm install`
7. Opcional: en **Build & Development Settings**, añade un script de postinstall para Prisma:
   - En `package.json` ya está el script `prisma:generate`; Vercel ejecuta `npm run build`, que incluye la generación si Prisma está bien configurado. Asegúrate de que `postinstall` ejecute `prisma generate` si usas un setup personalizado.

8. Haz clic en **Deploy**.

### Migraciones en producción

Las migraciones deben ejecutarse manualmente o mediante un job antes del deploy. Opciones:

- Ejecutar localmente contra la BD de producción:  
  `DATABASE_URL="tu-url-neon-produccion" npx prisma migrate deploy`
- Usar el panel de Neon o un job de CI/CD para aplicar migraciones antes del deploy.

## Estructura del proyecto

```
src/
├── app/
│   ├── (app)/           # Rutas protegidas (requieren sesión)
│   │   ├── dashboard/
│   │   ├── projects/
│   │   ├── tasks/
│   │   └── reports/
│   ├── (public)/        # Login, Signup
│   ├── api/             # Route handlers REST
│   └── globals.css
├── components/
│   ├── layout/
│   └── ui/
├── features/
│   ├── projects/
│   └── tasks/
└── lib/
    ├── auth/            # Sesiones y passwords
    ├── services/        # Lógica de negocio
    ├── validators/      # Schemas Zod
    ├── db.ts            # Cliente Prisma singleton
    └── utils.ts
```

## Licencia

MIT
