# Helartico — Sistema de Fidelidad y Recompensas
## Documento de Requerimientos, Especificaciones y Arquitectura Técnica

---

## 1. Visión General del Proyecto

**Helartico** es una heladería y cafetería. El objetivo de este proyecto es implementar una plataforma web progresiva (**PWA - Progressive Web App**) orientada al **programa de fidelidad y recompensas** para sus clientes, acompañada de un panel de gestión ágil para el personal (**Staff / Administradores**).

### 1.1 Objetivo del Negocio
- Fomentar la recurrencia de compra presencial premiando a los clientes con puntos por cada consumo.
- Permitir a los clientes consultar su saldo de puntos acumulados y canjearlos por productos del catálogo en tiempo real.
- Brindar un mecanismo seguro de canje presencial mediante **códigos de canje de un solo uso** con tiempo de expiración (30 minutos), validados en caja por el personal.
- Dotar al personal de herramientas para gestionar clientes (especialmente aquellos con dificultades tecnológicas, como adultos mayores), acreditar puntos manualmente y administrar productos.
- Disponer de una aplicación instalable en dispositivos móviles (Android e iOS) con soporte para **notificaciones push**.

---

## 2. Actores y Casos de Uso

### 2.1 Clientes (Customer)
- **Registro y Autenticación**:
  - Auto-registro con: Nombre completo, correo electrónico, número de documento de identidad (DNI/cédula) y contraseña (**el número de teléfono es opcional**).
  - Inicio de sesión con correo electrónico y contraseña.
  - Al ingresar, visualización de un aviso/modal informativo para la instalación de la PWA (según SO: Android / iOS).
- **Gestión de Puntos y Catálogo**:
  - Visualización del saldo actual de puntos en el perfil y encabezado.
  - Exploración del catálogo de productos disponibles para canje con su costo en puntos e imagen.
  - Solicitud de canje de un producto: confirmación obligatoria previa al descuento de puntos.
  - Generación inmediata de un código único de canje al confirmar.
- **Historial de Canjes**:
  - Consulta de los últimos códigos generados y su estado (`ACTIVE`, `CONSUMED`, `EXPIRED`).
  - **Generación de Código QR dinámico**: cada canje activo genera un código QR legible para que el cliente lo muestre directamente en el mostrador.
  - Temporizador visible de expiración (cuenta regresiva de 30 minutos).
- **Perfil de Usuario**:
  - Consulta de datos personales y saldo.
  - Historial de movimientos de puntos (puntos acumulados y canjeados).
  - Suscripción/activación de notificaciones push en el dispositivo.

### 2.2 Personal del Negocio (Staff: Administrador vs. Empleado)
El personal del comercio se divide en dos niveles jerárquicos:
1. **Administrador (`ADMIN`)**: Posee control total sobre el sistema (productos, clientes, puntos, canjes y **gestión exclusiva de miembros del staff**).
2. **Empleado (`EMPLOYEE`)**: Operador de mostrador enfocado en la atención presencial (validación de canjes, acreditación de puntos, alta y modificación de clientes, incluyendo reseteo de contraseñas olvidadas).

- **Gestión Exclusiva de Miembros del Staff (Solo Administrador)**:
  - Los empleados **no pueden** crear, listar, modificar ni eliminar otros usuarios del staff.
  - La creación, listado, cambio de rol, actualización y baja de miembros del staff está **reservada exclusivamente para el rol Administrador**.
  - **Flexibilidad en el registro de Staff**: El número de teléfono y el documento (DNI) **son opcionales** para usuarios staff. Si se ingresan se almacenan, pero no son obligatorios.
  - Protección de integridad: Un administrador no puede auto-eliminarse mientras esté en sesión.

- **Modificación y Reseteo de Contraseñas de Clientes (Administrador y Empleado)**:
  - Tanto los administradores como los empleados de mostrador pueden editar los perfiles de los clientes.
  - En caso de que un cliente olvide su contraseña para entrar a la PWA, cualquier usuario staff puede **restablecerle la contraseña manualmente** desde la lista de clientes.

- **Validación Rápida de Canjes (Cámara QR + Auto-Guión)**:
  - **Escáner con Cámara**: apertura de cámara en vivo para lectura automática del código QR que muestra el cliente, validando y consumiendo el canje al instante.
  - **Entrada Manual Optimizada**: auto-inserción inteligente del guión (`HLT-XXXXXX`) y formateo a mayúsculas para agilizar el tecleo sin buscar caracteres especiales.
  - Validación del estado: si es válido y está dentro de los 30 minutos, se marca como consumido, se asocia al personal que lo atendió y se confirma la entrega del producto.

- **Gestión de Clientes (CRUD y Puntos)**:
  - Registro de clientes asistido en mostrador (el número de teléfono es opcional).
  - Búsqueda de clientes por documento, correo electrónico o teléfono.
  - Modificación de datos y reseteo manual de claves de acceso.
  - Eliminación/desactivación de clientes.
  - Suma manual de puntos por compras presenciales con registro de nota/comprobante.

- **Gestión de Productos Canjeables (CRUD)**:
  - Alta de productos con carga directa de fotografías a Cloudinary.
  - Edición y actualización de productos.
  - Baja y reactivación de productos.

---

## 3. Arquitectura y Patrones de Diseño (PEAA & SOLID)

Para garantizar mantenibilidad, desacoplamiento y escalabilidad, el sistema se rige por principios de arquitectura limpia y patrones de **Patterns of Enterprise Application Architecture (PEAA - Martin Fowler)**, aplicando estrictamente **SOLID**:

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                       │
│    (Express Controllers, DTOs, Middlewares, Routes)         │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                     Application Layer                       │
│           (Use Cases / Command Handlers / SRP)              │
│       Cada caso de uso es una clase con < 100 LOC           │
└──────────────┬───────────────────────────────┬──────────────┘
               │                               │
               ▼                               ▼
┌─────────────────────────────┐ ┌─────────────────────────────┐
│        Domain Layer         │ │    Infrastructure Layer     │
│  (Entities, Value Objects,  │ │ (Mongoose Models, Mappers,  │
│   Domain Events, Contracts) │ │  WebPushService, Repos)     │
└─────────────────────────────┘ └─────────────────────────────┘
```

### 3.1 Patrones PEAA Implementados
1. **Domain Model**: Entidades de negocio ricas con reglas y validaciones encapsuladas (`Customer`, `Staff`, `Product`, `RedemptionCode`).
2. **Value Objects**: Inmutabilidad y autocontención de reglas para tipos específicos (`Email`, `DocumentNumber`, `Points`, `RedemptionToken`).
3. **Repository Pattern**: Abstracción del acceso a datos mediante interfaces en el dominio (`ICustomerRepository`, `IProductRepository`, `IRedemptionCodeRepository`), implementadas con Mongoose en la capa de infraestructura.
4. **Data Mapper**: Separación total entre el esquema de persistencia de MongoDB y las entidades del dominio de TypeScript.
5. **Service Layer / Use Case Classes**: Cada interacción de negocio se modela como una clase dedicada (ej. `RedeemProductUseCase`, `ValidateRedemptionCodeUseCase`, `AddCustomerPointsUseCase`), garantizando **SRP (Single Responsibility Principle)**.
6. **Separated Interface & Dependency Inversion (DIP)**: Los casos de uso dependen exclusivamente de interfaces de repositorio y servicios, nunca de implementaciones concretas de base de datos.

### 3.2 Reglas de Código y Estructura
- **Límite de líneas por clase**: Máximo de ~100 líneas por clase/archivo para máxima legibilidad y foco.
- **Nomenclatura**: Todo el código (variables, métodos, clases, interfaces, rutas y comentarios de código) en **inglés**.
- **Seguridad**: Autenticación mediante **JWT (JSON Web Tokens)** con roles diferenciados (`ROLE_CUSTOMER`, `ROLE_STAFF`). Almacenamiento de contraseñas con **bcrypt** (salt rounds >= 10).

---

## 4. Estructura de Directorios del Proyecto

El repositorio se organizará en una estructura limpia desacoplando Backend y Frontend:

```
helartico/
├── assets/                    # Identidad de marca y logos originales
│   ├── logo.png
│   ├── logo192.png
│   └── logo512.png
├── server/                    # Backend: Node.js + TypeScript + Express + MongoDB
│   ├── src/
│   │   ├── config/            # Environment & app configurations
│   │   ├── core/              # Shared errors, base classes, utilities
│   │   ├── domain/            # Domain layer
│   │   │   ├── entities/      # Customer, Staff, Product, RedemptionCode
│   │   │   ├── value-objects/ # Email, Points, DocumentNumber, RedemptionToken
│   │   │   └── repositories/  # Repository interfaces (contracts)
│   │   ├── application/       # Use Cases (SRP, < 100 lines each)
│   │   │   ├── auth/          # AuthenticateUserUseCase, RegisterCustomerUseCase, etc.
│   │   │   ├── customers/     # AddPointsUseCase, UpdateCustomerUseCase, etc.
│   │   │   ├── products/      # CreateProductUseCase, ListProductsUseCase, etc.
│   │   │   └── redemptions/   # RedeemProductUseCase, ValidateCodeUseCase, etc.
│   │   ├── infrastructure/    # Concrete implementations
│   │   │   ├── database/      # Mongo connection, Mongoose schemas, Mappers
│   │   │   ├── repositories/  # MongoCustomerRepository, MongoProductRepository, etc.
│   │   │   ├── security/      # BcryptHasher, JwtTokenService
│   │   │   └── notifications/ # WebPushNotificationService
│   │   ├── presentation/      # HTTP Delivery mechanism
│   │   │   ├── controllers/   # AuthController, CustomerController, etc.
│   │   │   ├── middlewares/   # AuthGuard, RoleGuard, ErrorHandler
│   │   │   ├── dtos/          # Request validation DTOs
│   │   │   └── routes/        # Express route modules
│   │   └── index.ts           # Server entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── client/                    # Frontend: Vite + React + TypeScript + PWA
│   ├── public/                # Static assets, icons, manifest.json
│   │   ├── icons/
│   │   └── favicon.ico
│   ├── src/
│   │   ├── assets/            # Local SVGs, brand assets
│   │   ├── components/        # Reusable UI components (Modals, Buttons, Cards)
│   │   │   ├── common/
│   │   │   ├── customer/      # ProductCard, RedeemModal, PwaPromptModal
│   │   │   └── staff/         # CodeScanner, PointAdjustmentForm, CustomerTable
│   │   ├── context/           # AuthContext, NotificationContext
│   │   ├── hooks/             # useAuth, usePwaInstall, usePushNotifications
│   │   ├── pages/             # Route views
│   │   │   ├── customer/      # CatalogPage, RedemptionsPage, ProfilePage
│   │   │   ├── staff/         # ValidationPage, CustomersAdminPage, ProductsAdminPage
│   │   │   └── auth/          # LoginPage, RegisterPage
│   │   ├── services/          # API client services (HttpCustomerService, etc.)
│   │   ├── styles/            # Design tokens, variables, typography, responsive utilities
│   │   ├── types/             # Frontend models and DTO interfaces
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── vite.config.ts         # Vite + VitePWA plugin config
│   ├── package.json
│   └── tsconfig.json
├── docs/                      # Technical diagrams and guides
├── REQUERIMIENTOS.md          # Este documento
└── package.json               # Monorepo / Workspaces orchestrator (opcional)
```

---

## 5. Modelo de Datos (MongoDB)

### 5.1 Colección `users`
Contiene tanto clientes como miembros del personal, discriminados por `role`.
```json
{
  "_id": "ObjectId",
  "name": "María González",
  "email": "maria@example.com",
  "phone": "+5491112345678",
  "documentNumber": "40123456",
  "passwordHash": "$2b$10$...",
  "role": "CUSTOMER", // "CUSTOMER" | "STAFF"
  "pointsBalance": 250,
  "isActive": true,
  "createdAt": "2026-10-27T10:00:00Z",
  "updatedAt": "2026-10-27T10:00:00Z"
}
```
*Índices obligatorios*:
- `email`: unique
- `documentNumber`: unique
- `role`: standard index

### 5.2 Colección `products`
Catálogo de productos canjeables por puntos.
```json
{
  "_id": "ObjectId",
  "name": "Cucurucho Especial 2 Bochas",
  "imageUrl": "https://.../cucurucho.jpg",
  "pointsRequired": 120,
  "isActive": true,
  "createdAt": "2026-10-27T10:00:00Z",
  "updatedAt": "2026-10-27T10:00:00Z"
}
```

### 5.3 Colección `redemption_codes`
Códigos generados para ser canjeados presencialmente.
```json
{
  "_id": "ObjectId",
  "code": "HLT-849201",
  "customerId": "ObjectId(User)",
  "productId": "ObjectId(Product)",
  "pointsSpent": 120,
  "status": "ACTIVE", // "ACTIVE" | "CONSUMED" | "EXPIRED"
  "expiresAt": "2026-10-27T10:30:00Z",
  "consumedAt": null,
  "consumedByStaffId": null,
  "createdAt": "2026-10-27T10:00:00Z"
}
```
*Índices obligatorios*:
- `code`: unique
- `customerId`: standard index
- `expiresAt`: standard index para consultas y validaciones

### 5.4 Colección `points_transactions`
Auditoría inmutable de cada acreditación o débito de puntos.
```json
{
  "_id": "ObjectId",
  "customerId": "ObjectId(User)",
  "amount": 50, // Positivo para acreditación, negativo para débito
  "type": "PURCHASE_REWARD", // "PURCHASE_REWARD" | "REDEMPTION" | "MANUAL_ADJUSTMENT"
  "performedByStaffId": "ObjectId(User)", // null si fue auto-canje del cliente
  "note": "Compra presencial Helado 1kg",
  "redemptionCodeId": null,
  "createdAt": "2026-10-27T10:00:00Z"
}
```

### 5.5 Colección `push_subscriptions`
Suscripciones activas para el envío de notificaciones PWA.
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId(User)",
  "endpoint": "https://fcm.googleapis.com/fcm/send/...",
  "keys": {
    "p256dh": "...",
    "auth": "..."
  },
  "deviceInfo": "Chrome / Android",
  "createdAt": "2026-10-27T10:00:00Z"
}
```

---

## 6. Variables de Entorno Requeridas (.env)

A continuación se detallan todas las variables de entorno necesarias para la configuración del servidor y cliente:

### 6.1 Servidor (`server/.env`)
```bash
# Servidor HTTP
PORT=5000
NODE_ENV=development

# Base de Datos MongoDB
MONGODB_URI=mongodb+srv://<usuario>:<password>@cluster.mongodb.net/helartico?retryWrites=true&w=majority

# Seguridad & Autenticación JWT
JWT_SECRET=super_secret_jwt_key_helartico_2026_change_in_production
JWT_EXPIRES_IN=7d

# CORS (Orígenes permitidos en Frontend)
CORS_ORIGIN=http://localhost:5173

# Reglas de Negocio
REDEMPTION_CODE_EXPIRATION_MINUTES=30

# Notificaciones Push PWA (WebPush VAPID Keys)
# Generadas mediante: npx web-push generate-vapid-keys
VAPID_PUBLIC_KEY=BL...tu_clave_publica_vapid
VAPID_PRIVATE_KEY=...tu_clave_privada_vapid
VAPID_SUBJECT=mailto:soporte@helartico.com

# Almacenamiento de Imágenes en la Nube (Cloudinary)
# Obtenidas desde tu consola de Cloudinary (https://cloudinary.com)
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
CLOUDINARY_FOLDER=helartico_products
```

### 6.2 Cliente (`client/.env`)
```bash
# URL base de la API del servidor
VITE_API_BASE_URL=http://localhost:5000/api

# Clave pública VAPID para registro del Service Worker en el navegador
VITE_VAPID_PUBLIC_KEY=BL...misma_clave_publica_que_en_el_servidor
```

---

## 7. Diseño Visual e Identidad de Marca

A partir del logotipo oficial de **Helartico — Helados & Café** (sello circular artesanal con tonos olivo, crema y café), se define una paleta cromática sobria, cálida, sin saturaciones estridentes y con balance óptimo de contraste (WCAG AA compliant):

### 7.1 Paleta de Colores
| Nombre del Tono | Código Hex | Uso Principal |
| :--- | :--- | :--- |
| **Forest Sage (Primario)** | `#384C34` | Botones principales, encabezados, acento de marca |
| **Forest Dark (Texto Principal)** | `#222D20` | Tipografía principal, títulos |
| **Hazelnut Caramel (Acento)** | `#B8864E` | Insignias de puntos, botones de acción secundaria, destacados |
| **Warm Biscuit (Fondo Global)** | `#F6F2EA` | Fondo general de la aplicación |
| **Cream Surface (Tarjetas)** | `#FFFFFF` | Contenedores, tarjetas de producto, modales |
| **Subtle Border** | `#E4DCD0` | Líneas divisorias, bordes sutiles |
| **Muted Text** | `#6F786C` | Textos secundarios, descripciones, fechas |
| **Success State** | `#2E6B3E` | Códigos válidos, acreditación exitosa |
| **Alert/Expired State** | `#A84236` | Códigos expirados o cancelaciones |

### 7.2 Tipografía
- Títulos: Fuente moderna con reminiscencia artesanal (ej. `Outfit` o `Playfair Display / Plus Jakarta Sans`).
- Cuerpo y datos: `Plus Jakarta Sans` o `Inter` para máxima legibilidad en pantallas reducidas de smartphones.

### 7.3 Interfaz Adaptativa (Mobile-First)
- **Cliente**:
  - Enfoque 100% móvil: barra de navegación inferior fija (**Bottom Navigation Bar**) con tres accesos rápidos:
    1. **Catálogo**: cuadrícula de 2 columnas en móvil con foto, título y puntos requeridos.
    2. **Mis Canjes**: listado de cupones con código en tipografía monoespaciada grande y cuenta regresiva.
    3. **Mi Perfil**: tarjeta con saldo de puntos en grande, datos personales y botón de cerrar sesión.
- **Staff / Administrador**:
  - Enfoque híbrido: optimizado tanto para tablet/smartphone en caja como para pantalla de escritorio.
  - Pestaña destacada de **Validación Rápida de Códigos** con campo de texto grande y respuesta visual inmediata (Verde = Válido / Rojo = Inválido o Expirado).

---

## 8. Especificación de PWA y Notificaciones Push

### 8.1 PWA (Progressive Web App)
- **Web App Manifest (`manifest.json`)**:
  - Nombre: `Helartico - Helados & Café`
  - Short name: `Helartico`
  - Icons: `logo192.png` y `logo512.png` (presentes en `assets/`).
  - `start_url`: `/`
  - `display`: `standalone`
  - `theme_color`: `#384C34`
  - `background_color`: `#F6F2EA`
- **Popup de Instalación Inteligente en Pantalla de Login y Perfil**:
  - Detección precisa del sistema operativo y navegador mediante agente de usuario y capacidades:
    - **iOS con Safari**: Instrucciones con botón *Compartir* (`Share` en barra inferior) -> *"Agregar a pantalla de inicio"*.
    - **iOS con Chrome**: Menú de tres puntos `...` o botón de compartir en barra de dirección -> *"Agregar a pantalla de inicio"*.
    - **Android (Chrome / Edge / Brave / Samsung Internet)**: Botón de instalación directa con un clic (evento `beforeinstallprompt`) y guía paso a paso con el menú de tres puntos (⋮) -> *"Instalar aplicación"*.
    - **PC / Escritorio (Windows / macOS / Linux con Chrome o Edge)**: Botón de instalación directa o guía para hacer clic en el ícono de instalación `⊕` en la barra de direcciones del navegador.
  - Selector interactivo de pestañas para que el usuario pueda consultar las instrucciones de cualquier dispositivo en cualquier momento.
  - Opción clara de descartar / posponer ("Quizás más tarde").

### 8.2 Notificaciones Push
- Integración del estándar **Web Push API** con llaves **VAPID**.
- Casos de uso de notificaciones:
  - Notificación de puntos acreditados tras compra presencial ("*¡Sumaste 50 puntos en tu última visita a Helartico!*").
  - Aviso de canje pronto a expirar ("*Tu código de canje para Helado 2 Bochas expira en 5 minutos*").
  - Nuevos productos canjeables disponibles en el catálogo.

---

## 9. API RESTful Endpoints (Especificación)

### 9.1 Autenticación (`/api/auth`)
- `POST /api/auth/register`: Registro de cliente.
- `POST /api/auth/login`: Autenticación para cliente y staff (retorna JWT y perfil).
- `GET /api/auth/me`: Obtención de datos del usuario autenticado.

### 9.2 Clientes (`/api/customers`)
- `GET /api/customers`: [Staff] Búsqueda y listado paginado de clientes.
- `POST /api/customers`: [Staff] Alta asistida de nuevo cliente.
- `GET /api/customers/:id`: [Staff / Customer prop.] Detalle del cliente.
- `PUT /api/customers/:id`: [Staff] Modificación de datos de cliente.
- `DELETE /api/customers/:id`: [Staff] Desactivación de cliente.
- `POST /api/customers/:id/points`: [Staff] Acreditación de puntos a cliente.

### 9.3 Productos (`/api/products`)
- `GET /api/products`: Listado de productos activos para canje (Público / Clientes).
- `GET /api/products/admin`: [Staff] Listado completo de productos (activos e inactivos).
- `POST /api/products`: [Staff] Creación de nuevo producto.
- `PUT /api/products/:id`: [Staff] Actualización de producto.
- `DELETE /api/products/:id`: [Staff] Eliminación o baja lógica de producto.

### 9.4 Canjes (`/api/redemptions`)
- `POST /api/redemptions`: [Customer] Solicitar canje de un producto (genera código y descuenta puntos).
- `GET /api/redemptions/my`: [Customer] Listado de códigos propios con estado.
- `POST /api/redemptions/validate`: [Staff] Validar y consumir código de canje en mostrador.

### 9.5 Notificaciones Push (`/api/push`)
- `POST /api/push/subscribe`: Registro de suscripción del Service Worker.
- `DELETE /api/push/unsubscribe`: Cancelación de suscripción.

### 9.6 Almacenamiento y Carga de Imágenes (`/api/upload`)
- `POST /api/upload`: [Staff] Carga de archivos de imagen mediante `multipart/form-data` con Multer (procesamiento en memoria con límite de 5MB) y almacenamiento en la nube mediante Cloudinary, retornando la URL segura `secure_url`.

---

## 10. Gestor de Paquetes y Monorepo (pnpm)

El proyecto utiliza **pnpm** como gestor de paquetes principal configurado con `pnpm-workspace.yaml`:
```bash
# Instalación de todas las dependencias
pnpm install

# Servidor en modo desarrollo
pnpm dev:server

# Cliente frontend en modo desarrollo
pnpm dev:client

# Compilación de producción
pnpm build:server
pnpm build:client

# Ejecución de todos los tests del monorepo
pnpm test
```

---

## 11. Estrategia de Pruebas Automatizadas (Vitest)

Para asegurar la confiabilidad de cada regla de negocio, se implementó una suite completa de pruebas unitarias y de integración rápida con **Vitest**:

1. **Pruebas de Value Objects (`server/src/__tests__/domain/ValueObjects.test.ts`)**:
   - `Email`: validación de sintaxis y normalización a minúsculas.
   - `Points`: control de números enteros positivos, suma, resta y validación de saldo suficiente.
   - `DocumentNumber`: sanitización de caracteres especiales (puntos, guiones, espacios) y longitudes mínimas.
   - `RedemptionToken`: formato `HLT-XXXXXX` y exclusión de caracteres ambiguos (0/O, 1/I).

2. **Pruebas de Entidades de Dominio (`server/src/__tests__/domain/Entities.test.ts`)**:
   - `Customer`: acumulación, descuento de puntos e inmutabilidad de saldo si no hay fondos suficientes.
   - `RedemptionCode`: cálculo de expiración (30 min), consumo exitoso por parte de un staff y prevención estricta de doble consumo.
   - `Product`: actualización de puntos requeridos y control de estados activo/inactivo.

3. **Pruebas de Casos de Uso / Lógica de Negocio (`server/src/__tests__/application/`)**:
   - `AuthUseCases.test.ts`: registro de clientes, login con JWT y hashing bcrypt, bloqueo de emails o documentos duplicados, creación restringida de staff.
   - `RedemptionAndPointsUseCases.test.ts`: flujo completo de compra presencial -> acreditación de puntos -> canje de producto con descuento -> validación y consumo en caja.

4. **Pruebas de Frontend (`client/src/__tests__/apiClient.test.ts`)**:
   - `ApiClient`: inyección automática del token Bearer, captura y propagación de errores HTTP del servidor.

5. **Pruebas de Seguridad y Control de Acceso RBAC (`server/src/__tests__/security/SecurityAndRBAC.test.ts`)**:
   - **Autenticación JWT (401)**: rechazo de peticiones sin token, cabeceras malformadas o firmas JWT adulteradas.
   - **Autorización por Roles (403)**: bloqueo estricto de clientes intentando acceder a endpoints de staff (`/api/customers`, `/api/products`, `/api/upload`, `/api/redemptions/validate`, etc.) y viceversa.
   - **Sanitización de Logs**: verificación de que ningún token o información sensible sea emitida en `console.error` ni en respuestas de error al cliente.

---

## 12. Búsqueda y Paginación con Infinite Scroll

Para garantizar una experiencia de usuario fluida y evitar sobrecarga de datos en la red y en el renderizado del cliente, todas las pantallas que presentan listas y catálogos cuentan con paginación en el servidor y carga progresiva mediante scroll infinito (**Infinite Scroll**):

### 12.1 Pantallas con Paginación e Infinite Scroll
1. **Catálogo de Recompensas del Cliente (`CatalogView.tsx`)**:
   - Barra de búsqueda reactiva con icono y botón de limpieza inmediata.
   - Búsqueda con técnica **debounce** (350ms) para evitar peticiones redundantes mientras el usuario escribe.
   - Scroll infinito con `IntersectionObserver`: carga páginas adicionales de a 10 productos a medida que el cliente se desplaza hacia abajo.
   - Indicador de estado de carga al pie (`Loader2`) y mensaje al alcanzar el final del catálogo.

2. **Gestión del Catálogo de Productos del Staff (`StaffProductsTab.tsx`)**:
   - Barra de búsqueda para localizar productos por nombre rápidamente en el mostrador o administración.
   - Paginación progresiva con scroll infinito de a 12 productos por página.
   - Actualización reactiva al crear o dar de baja productos.

3. **Lista de Clientes del Staff (`StaffCustomersTab.tsx`)**:
   - Búsqueda en tiempo real por DNI, nombre o correo electrónico con debounce.
   - Carga paginada en lote de a 10 clientes por página mediante scroll infinito.
   - Indicador dinámico de cantidad de clientes totales encontrados.

4. **Historial de Códigos de Canje del Cliente (`RedemptionsView.tsx`)**:
   - Carga paginada de a 10 códigos de canje mediante scroll infinito.
   - Mantiene la actualización periódica de la primera página para refrescar el temporizador de 30 minutos sin perder los canjes anteriores cargados.

### 12.2 Contrato de Paginación en la API
Todos los endpoints de listas soportan parámetros de consulta opcionales:
- `page`: Número de página solicitado (base 1, por defecto `1`).
- `limit`: Cantidad máxima de registros por página (por defecto entre `10` y `12`).
- `search`: Cadena de texto para filtrado insensible a mayúsculas/minúsculas.

Estructura de respuesta unificada:
```json
{
  "success": true,
  "data": [ ...items ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "totalPages": 5,
    "hasMore": true
  }
}
```

### 12.3 Pruebas de Paginación y Búsqueda (`server/src/__tests__/application/PaginationAndSearch.test.ts`)
- Pruebas unitarias sobre casos de uso comprobando:
  - Paginación correcta, cálculo de `totalPages` y bandera `hasMore`.
  - Búsqueda insensible a mayúsculas/minúsculas por nombre en productos.
  - Búsqueda de clientes por coincidencia en nombre, correo o DNI.
  - Paginación ordenada de códigos de canje por cliente.

---

## 13. Jerarquía de Roles del Staff y Gestión de Accesos

### 13.1 Niveles de Acceso y Permisos
El sistema implementa una matriz de control de acceso basada en roles (RBAC) jerárquica:

| Operación / Recurso | Cliente (`CUSTOMER`) | Empleado (`EMPLOYEE`) | Administrador (`ADMIN`) |
| :--- | :---: | :---: | :---: |
| **Explorar catálogo de recompensas** | ✅ | ✅ | ✅ |
| **Canjear puntos por código QR** | ✅ | ❌ | ❌ |
| **Validar y consumir códigos QR en caja** | ❌ | ✅ | ✅ |
| **Acreditar puntos por compra presencial** | ❌ | ✅ | ✅ |
| **Alta asistida de clientes en mostrador** | ❌ | ✅ | ✅ |
| **Modificar datos de clientes** | ❌ | ✅ | ✅ |
| **Restablecer contraseña olvidada a clientes** | ❌ | ✅ | ✅ |
| **Administrar productos (crear, editar, borrar)** | ❌ | ✅ | ✅ |
| **Listar miembros del Staff** | ❌ | ❌ | ✅ |
| **Crear nuevo miembro del Staff (Admin/Empleado)** | ❌ | ❌ | ✅ |
| **Editar datos, rol o contraseña de Staff** | ❌ | ❌ | ✅ |
| **Eliminar o dar de baja miembros del Staff** | ❌ | ❌ | ✅ *(excepto a sí mismo)* |

### 13.2 Especificaciones Técnicas de la Jerarquía
- **Tokens JWT y Middleware de Seguridad**:
  - `JwtTokenService.generateToken()` incluye en el payload: `{ userId, role: "STAFF", staffRole: "ADMIN" | "EMPLOYEE", email }`.
  - `RoleMiddleware.requireRole("STAFF")`: autoriza a cualquier miembro del personal (Administradores y Empleados).
  - `RoleMiddleware.requireAdmin()`: restringe estrictamente el acceso a usuarios con `staffRole === "ADMIN"`, respondiendo `403 Forbidden` a cualquier intento de acceso por parte de empleados.
- **Rutas de Gestión de Personal (`/api/staff`)**:
  - `GET /api/staff`: Listado paginado con búsqueda por nombre, email o DNI.
  - `POST /api/staff`: Creación de personal con campos de teléfono y DNI opcionales y selector de rol (`EMPLOYEE` / `ADMIN`).
  - `PUT /api/staff/:id`: Actualización de nombre, teléfono, DNI, rol y reseteo opcional de contraseña.
  - `DELETE /api/staff/:id`: Baja física/lógica del personal, con salvaguarda que impide al administrador auto-eliminarse.
- **Reseteo de Contraseñas de Clientes (`PUT /api/customers/:id`)**:
  - Si el cliente olvidó su contraseña, cualquier empleado o administrador puede ingresar una nueva contraseña (mínimo 6 caracteres). La capa de aplicación (`UpdateCustomerUseCase`) realiza el hash seguro con `bcrypt` y actualiza la entidad.
- **Suite de Pruebas Automatizadas (`server/src/__tests__/security/StaffHierarchyAndPermissions.test.ts`)**:
  - Verificación de 12 casos de prueba cubriendo creación con y sin DNI/teléfono, bloqueo 403 a empleados, autorización 200 a administradores, protección contra auto-eliminación y reseteo cruzado de contraseñas.

---

## 14. Edición de Productos y Limpieza Automática de Imágenes en Cloudinary

### 14.1 Requerimientos Funcionales
1. **Edición Completa por Miembros del Staff**:
   - Todo miembro del personal (`STAFF`: tanto `ADMIN` como `EMPLOYEE`) puede modificar la totalidad de los datos de cada producto:
     - Nombre del producto.
     - Imagen del producto (mantener la existente o subir una nueva foto).
     - Costo en puntos requeridos para el canje.
     - Estado de disponibilidad (`isActive`: Activo / Inactivo).
2. **Limpieza Automática en Cloudinary al Cambiar Imagen**:
   - Cuando se actualiza un producto con una nueva fotografía, el sistema detecta el cambio de URL y procede a eliminar automáticamente la imagen anterior del repositorio de Cloudinary para no acumular archivos huérfanos.
3. **Eliminación Total del Producto y su Imagen**:
   - Al eliminar un producto del catálogo de forma definitiva (`DELETE /api/products/:id`), el sistema borra el registro de la base de datos y elimina su imagen asociada del repositorio de Cloudinary mediante la API de destrucción de assets (`uploader.destroy`).

### 14.2 Especificaciones Técnicas y Arquitectura
- **Contrato de Servicio de Almacenamiento (`IImageStorageService`)**:
  - `uploadImage(buffer: Buffer, originalFilename?: string): Promise<string>`
  - `deleteImage(imageUrlOrPublicId: string): Promise<void>`
- **Implementación Cloudinary (`CloudinaryImageStorageService`)**:
  - Función de utilidad `extractCloudinaryPublicId(url: string)`:
    - Analiza la URL segura de Cloudinary (`https://res.cloudinary.com/.../image/upload/...`).
    - Descarta prefijos de versión (`v12345/`) y extensiones de archivo (`.png`, `.jpg`, etc.) para obtener el `public_id` canónico requerido por la API de Cloudinary.
    - Discrimina y omite de forma segura imágenes no alojadas en Cloudinary (URIs base64, URLs externas de Unsplash o seeds).
  - Invocación a `cloudinary.uploader.destroy(publicId, { invalidate: true })` con invalidación de CDN.
- **Casos de Uso Afectados**:
  - `UpdateProductUseCase`: Inyecta `IProductRepository` e `IImageStorageService`. Compara la nueva URL con la anterior; si difiere y existía imagen previa, llama a `deleteImage`.
  - `DeleteProductUseCase`: Inyecta `IProductRepository` e `IImageStorageService`. Obtiene el producto, destruye su imagen en Cloudinary y elimina el documento en MongoDB con `productRepo.delete(productId)`.
- **Interfaz de Usuario Staff (`StaffProductsTab.tsx`)**:
  - Cada tarjeta de producto cuenta con botones dedicados de "Editar" y "Eliminar".
  - Modal de edición interactivo con previsualización de imagen actual, selector de nuevo archivo de imagen, edición de nombre, puntos requeridos y toggle de estado activo.
  - Alerta de confirmación antes de la eliminación definitiva informando la destrucción del producto y de su archivo de imagen asociado.

### 14.3 Suite de Pruebas Automatizadas (`server/src/__tests__/application/ProductUseCasesAndCloudinaryCleanup.test.ts`)
- 7 casos de prueba unitarios validando:
  - Extracción precisa de `public_id` con versión, sin versión y manejo seguro de URLs no Cloudinary.
  - Actualización de campos sin llamar a `deleteImage` si la imagen se mantiene idéntica.
  - Llamada a `deleteImage` con la URL previa cuando la imagen es reemplazada.
  - Eliminación completa del producto en el repositorio y destrucción de su imagen en Cloudinary.
  - Manejo de errores controlados para identificadores inexistentes.

---

## 15. Mensajes de Error y Retroalimentación en Español

Para brindar una experiencia intuitiva, accesible y transparente tanto a los clientes como al personal del comercio, todos los mensajes de error, advertencia y retroalimentación del sistema se expresan en **español claro y comprensible**.

### 15.1 Capas Afectadas
1. **Objetos de Valor del Dominio (`Value Objects`)**:
   - `Email`: *"El correo electrónico es obligatorio."*, *"El formato del correo electrónico no es válido."*
   - `Points`: *"Los puntos deben ser un número válido."*, *"Los puntos deben ser un número entero."*, *"Los puntos no pueden ser negativos."*, *"Saldo de puntos insuficiente."*
   - `DocumentNumber`: *"El número de documento es obligatorio."*, *"El número de documento debe tener entre 5 y 20 caracteres."*
   - `RedemptionToken`: *"El código de canje es obligatorio."*, *"El formato del código de canje no es válido (ej: HLT-ABC123)."*
2. **Entidades del Dominio (`Entities`)**:
   - `Product`: *"El nombre del producto no puede estar vacío."*
   - `RedemptionCode`: *"Este código de canje ya fue utilizado."*, *"Este código de canje ha expirado (los códigos tienen 30 minutos de validez)."*
3. **Casos de Uso de Aplicación (`Use Cases`)**:
   - Autenticación: *"Correo electrónico o contraseña incorrectos."*
   - Registro de clientes y staff: *"El nombre debe tener al menos 2 caracteres."*, *"La contraseña debe tener al menos 6 caracteres."*, *"Ya existe un cliente/miembro registrado con este correo electrónico."*, *"Ya existe un cliente/miembro registrado con este número de documento."*
   - Canjes y validaciones: *"Cliente no encontrado o inactivo."*, *"El producto seleccionado no está disponible para canje."*, *"Puntos insuficientes para este canje. Necesarios: X, Disponibles: Y"*, *"Código de canje no encontrado."*
   - Jerarquía de Staff: *"No puedes eliminar tu propia cuenta de administrador mientras estés en sesión."*, *"Miembro del personal no encontrado."*
   - Gestión de productos: *"Producto no encontrado."*, *"El nombre del producto es obligatorio."*, *"La imagen del producto es obligatoria."*
4. **Middlewares y Controladores de Presentación**:
   - Token y sesión: *"Sesión no válida o token de acceso ausente."*, *"La sesión ha expirado o el token no es válido."*
   - Permisos y roles: *"Acceso denegado: No tienes permisos para acceder a este recurso."*, *"Acceso denegado: Se requieren permisos de Administrador."*
   - Control de fallos generales: *"Ocurrió un error interno en el servidor. Por favor, intenta de nuevo más tarde."*
5. **Cliente Web / PWA**:
   - Manejo centralizado en `ApiClient` con mensajes predeterminados en español (*"Error en la solicitud."*, *"Error al subir la imagen."*).
   - Retroalimentación en modales, alertas y estados de error directos en la interfaz.

---

## 16. Ajuste Manual y Arbitrario del Saldo de Puntos (Staff)

Para gestionar situaciones excepcionales —tales como equivocaciones al tipear puntos en compras presenciales, devoluciones o compensaciones autorizadas— los miembros del personal (`STAFF`) disponen de la capacidad de **establecer arbitrariamente el saldo total de puntos** de un cliente a un número exacto (mayor o igual a cero).

### 16.1 Salvaguardas y Confirmación Obligatoria
Al ser una operación crítica que reemplaza de forma directa el balance acumulado:
- **Alerta Visual**: La interfaz despliega advertencias claras en tonos de precaución destacando que se trata de una acción delicada.
- **Cálculo Dinámico de Diferencia**: Al tipear el nuevo saldo, la interfaz calcula y previsualiza en tiempo real la diferencia aritmética respecto al saldo anterior (ej. de 50 a 80 pts muestra `+30 pts`, de 50 a 10 pts muestra `-40 pts`).
- **Paso Obligatorio de Confirmación**: Antes de enviar la solicitud al servidor, se activa un diálogo de confirmación explícito que detalla:
  - Nombre y DNI del cliente.
  - Saldo anterior tachado y nuevo saldo en tipografía destacada.
  - Botón de confirmación reforzado (*"Sí, Confirmar Ajuste"*) y opción de volver atrás.

### 16.2 Arquitectura y Auditoría en Base de Datos
- **Entidad `Customer`**: Método `setPoints(newPoints: Points): void` que actualiza el saldo y fecha de modificación.
- **Caso de Uso `SetCustomerPointsUseCase`**:
  - Valida que los puntos sean un entero no negativo (`Points.create`).
  - Obtiene el cliente activo y calcula la variación `diff = targetPoints - previousPoints`.
  - Registra una transacción inmutable en `points_transactions` con:
    - `type`: `"MANUAL_ADJUSTMENT"`
    - `amount`: `diff` (positivo o negativo)
    - `performedByStaffId`: identificador del usuario staff autenticado en sesión
    - `note`: motivo ingresado por el empleado o texto explicativo automático (`Ajuste manual de saldo de puntos (de X a Y pts)`).
- **Endpoint**: `PUT /api/customers/:id/points` protegido con `AuthMiddleware` y `RoleMiddleware.requireRole("STAFF")`.

---

## 17. Sistema Integral de Registros y Auditoría (Audit Logs)

Para garantizar la máxima transparencia, trazabilidad y seguridad operativa en el negocio, el sistema implementa una infraestructura transversal de **registros de auditoría inmutables**. Cada operación efectuada en la plataforma —ya sea realizada por un Administrador, un Empleado de mostrador o un Cliente— queda registrada con fecha, hora, autor, destinatario, descripción humana en español y detalles técnicos.

### 17.1 Modelo de Datos en MongoDB (`audit_logs`)
Colección dedicada optimizada para consultas de alto rendimiento y orden cronológico inverso:
```json
{
  "_id": "ObjectId",
  "action": "POINTS_ADD",
  "category": "POINTS", // "POINTS" | "REDEMPTION" | "PRODUCT" | "CUSTOMER" | "STAFF" | "AUTH"
  "actorId": "ObjectId(User)",
  "actorName": "Mariana Lopez",
  "actorEmail": "mariana@helartico.com",
  "actorRole": "STAFF", // "ADMIN" | "STAFF" | "CUSTOMER"
  "targetId": "ObjectId(Customer)",
  "targetName": "Carlos Gomez",
  "targetType": "CUSTOMER",
  "description": "El personal Mariana Lopez acreditó 40 puntos al cliente Carlos Gomez.",
  "details": {
    "pointsAdded": 40,
    "newBalance": 140,
    "note": "Compra presencial Helado 1kg"
  },
  "createdAt": "2026-10-27T21:00:00.000Z"
}
```

*Estrategia de Índices*:
- `{ createdAt: -1 }`: Optimizado para paginación y orden cronológico predeterminado.
- `{ category: 1, createdAt: -1 }`: Optimizado para filtrado por categoría temática.
- `{ action: 1 }`: Optimizado para filtrado por tipo específico de operación.
- `{ actorId: 1 }` y `{ targetId: 1 }`: Optimizado para búsquedas por usuario o entidad destino.

### 17.2 Catálogo de Operaciones Auditadas
El sistema registra todas las acciones existentes y está diseñado de manera abierta y desacoplada para admitir futuras operaciones sin alterar la base de datos:

| Categoría | Acción (`action`) | Actor | Descripción Típica |
| :--- | :--- | :--- | :--- |
| **POINTS** | `POINTS_ADD` | Staff / Admin | Acreditación de puntos por compra presencial |
| **POINTS** | `POINTS_SET` | Staff / Admin | Ajuste manual y arbitrario del saldo total de puntos |
| **REDEMPTION** | `REDEMPTION_CREATE` | Cliente | Generación de código temporal para canjear un producto |
| **REDEMPTION** | `REDEMPTION_VALIDATE` | Staff / Admin | Validación, consumo de código y entrega física del producto |
| **PRODUCT** | `PRODUCT_CREATE` | Staff / Admin | Alta de un nuevo producto en el catálogo |
| **PRODUCT** | `PRODUCT_UPDATE` | Staff / Admin | Modificación de nombre, puntos o imagen de un producto |
| **PRODUCT** | `PRODUCT_DELETE` | Staff / Admin | Eliminación de un producto y limpieza de imagen en Cloudinary |
| **CUSTOMER** | `CUSTOMER_REGISTER` | Cliente | Auto-registro de nuevo cliente desde la PWA |
| **CUSTOMER** | `CUSTOMER_CREATE` | Staff / Admin | Alta de nuevo cliente realizada por personal en mostrador |
| **CUSTOMER** | `CUSTOMER_UPDATE` | Staff / Admin | Actualización de datos de perfil de un cliente |
| **STAFF** | `STAFF_CREATE` | Admin | Creación de una nueva cuenta de empleado o administrador |
| **STAFF** | `STAFF_UPDATE` | Admin | Edición de rol, nombre, teléfono o contraseña de un miembro del staff |
| **STAFF** | `STAFF_DELETE` | Admin | Baja definitiva de una cuenta del personal |
| **AUTH** | `AUTH_LOGIN` | Cualquiera | Inicio de sesión exitoso en la plataforma |

### 17.3 Arquitectura y Desacoplamiento (`AuditLogService`)
- **Tolerancia a Fallos**: El servicio de auditoría (`AuditLogService`) ejecuta los registros de forma segura dentro de bloques controlados. Un fallo eventual en la persistencia del log nunca interrumpe ni revierte la transacción principal del negocio (ej. el canje o la venta).
- **Inyección de Dependencias**: Los casos de uso de la aplicación (`AddPointsUseCase`, `SetCustomerPointsUseCase`, `RedeemProductUseCase`, `ValidateCodeUseCase`, etc.) reciben `AuditLogService` como parámetro opcional, preservando la compatibilidad retroactiva y facilitando las pruebas unitarias con repositorios en memoria.
- **Identidad en Tokens**: Se enriqueció el payload de autenticación JWT (`TokenPayload`) para incluir el nombre del usuario (`name`), garantizando que cada petición autenticada tenga acceso inmediato al nombre del operador sin requerir consultas adicionales a la base de datos.

### 17.4 Seguridad y Control de Acceso (RBAC)
- **Endpoint Exclusivo para Administradores**:
  - `GET /api/logs`: Protegido con `AuthMiddleware.handle` y `RoleMiddleware.requireAdmin()`.
  - Los empleados con rol `EMPLOYEE` o clientes obtienen un error `403 Forbidden` (*"Acceso denegado: Se requieren permisos de Administrador."*).
- **Parámetros de Filtrado**:
  - `category`: Filtra por categoría (`POINTS`, `REDEMPTION`, `PRODUCT`, `CUSTOMER`, `STAFF`, `AUTH`).
  - `action`: Filtra por código de acción exacta.
  - `role`: Filtra por rol del operador (`ADMIN`, `STAFF`, `CUSTOMER`).
  - `search`: Búsqueda textual parcial (case-insensitive) sobre el nombre del actor, correo electrónico, destinatario y descripción del evento.
  - `page` y `limit`: Paginación con metadatos estándar (`total`, `totalPages`, `hasMore`).

### 17.5 Interfaz de Usuario para Administradores (Staff Dashboard)
En el panel del personal (`StaffAdminDashboard`), los usuarios con rol `ADMIN` acceden a una nueva pestaña: **"Registros del Sistema"** (`AUDIT_LOGS`):
1. **Filtros Interactivos**:
   - Selector visual de categorías en píldoras con iconos temáticos.
   - Menú desplegable para filtrar por acción específica.
   - Barra de búsqueda con debounce (350 ms) para búsqueda instantánea sin sobrecargar el servidor.
   - Botón de refresco manual y botón para restablecer filtros con un clic.
2. **Tarjetas de Actividad**:
   - Identificación cromática según categoría y rol (`👑 Admin`, `💼 Empleado`, `👤 Cliente`).
   - Fecha y hora formateadas en hora local (`DD/MM/AAAA, HH:mm:ss`).
   - Descripción redactada en lenguaje natural y legible.
   - Visor desplegable de detalles técnicos estructurados en formato JSON (diferencias de puntos, motivos, IDs vinculados).
3. **Paginación Infinita**:
   - Integración con el hook `useInfiniteScroll` mediante `IntersectionObserver` para una navegación continua y fluida sin saltos de página.

---

## 18. Adaptación Móvil de Staff, Revelado de Contraseñas, Depuración de Términos y Localización Argentina

### 18.1 Optimización de la Interfaz STAFF para Dispositivos Móviles
Para evitar quiebres desprolijos de texto, desbordes horizontales o botones comprimidos al visualizar el panel de personal en teléfonos inteligentes:
1. **Encabezado y Pestañas del Staff (`StaffAdminDashboard.tsx`)**:
   - Subtítulo acotado a *"Panel de Control"* con regla elíptica de una sola línea (`whiteSpace: "nowrap"`, `overflow: "hidden"`, `textOverflow: "ellipsis"`).
   - Insignias de usuario y rol compactas que preservan el botón de *"Cerrar sesión"* visible y accesible.
   - Pestañas con desplazamiento táctil horizontal suave, clase de utilidad `.no-scrollbar` para ocultar barras de scroll antiestéticas y botones con `flexShrink: 0` y `whiteSpace: "nowrap"`.
2. **Reestructuración de Tarjetas de Clientes (`StaffCustomersTab.tsx`)**:
   - División en dos filas funcionales:
     - **Fila Superior (Identificación)**: Nombre del cliente alineado a la izquierda y píldora de saldo de puntos destacada a la derecha.
     - **Fila de Acciones**: Contenedor con `flexWrap: "wrap"` y separación adecuada (`gap: 8`), con botones flexibles (`flex: "1 1 auto"`, `whiteSpace: "nowrap"`) para *"Sumar Puntos"*, *"Ajustar Saldo"* y *"Editar"*. Esto impide que el texto de los botones se rompa en varias líneas.
3. **Cuadrículas Adaptativas en Productos y Auditoría**:
   - Redimensión dinámica de columnas con `repeat(auto-fit, minmax(160px, 1fr))` en el catálogo de productos y `minmax(200px, 1fr)` en filtros de auditoría para evitar desbordes en resoluciones reducidas.
4. **Modales y Diálogos Responsivos**:
   - Ajuste de padding en `.modal-card` a `20px 16px` en pantallas móviles.
   - Regla `wordBreak: "break-word"` y tamaños adaptativos en encabezados de modales para nombres extensos de clientes y personal.

### 18.2 Componente Reutilizable de Revelado de Contraseñas (`PasswordInput`)
Se desarrolló el componente `PasswordInput` (`client/src/components/common/PasswordInput.tsx`) para permitir que los usuarios comprueben visualmente lo que están escribiendo antes de enviar un formulario:
- **Conmutación Visual**: Botón integrado con iconos `Eye` y `EyeOff` (Lucide Icons) que alterna dinámicamente entre `type="password"` y `type="text"`.
- **Compensación de Espaciado**: Relleno interno derecho (`paddingRight: 42px`) que garantiza que el texto ingresado no se solape con el botón de alternancia.
- **Accesibilidad**: Inclusión de atributos `aria-label`, `title` descriptivos y `tabIndex={-1}` en el botón para no interferir con la navegación por teclado.
- **Implementación Universal**: Integrado en la pantalla de autenticación (Login y Registro), modal de alta de cliente asistida, edición de datos de cliente, alta de personal institucional y edición de personal/contraseña.

### 18.3 Eliminación del Concepto "Club de Fidelidad" / "Programa de Fidelidad"
Se erradicaron todas las apariciones de *"club de fidelidad"* y *"programa de fidelidad"* en la interfaz visual, metadatos y manifiestos de la aplicación:
- **SEO y Metadatos (`index.html`, `manifest.json`, `vite.config.ts`)**: Actualización de títulos y descripciones hacia *"Helartico — Helados & Café | Beneficios y Puntos"* y *"Sumá puntos y canjeá premios en Helartico Helados & Café"*.
- **Página de Inicio y Auth (`AuthPage.tsx`)**: Reemplazo del subtítulo de bienvenida por *"Helados & Café • Sumá y Canjeá Puntos"*.
- **Catálogo y Perfil**: Enfoque directo en puntos y recompensas transparentes.

### 18.4 Estandarización al Español Rioplatense (Voseo Formal)
Toda la interfaz de usuario fue redactada bajo la modalidad del voseo argentino formal, brindando una comunicación natural, cercana y profesional:
- **Búsquedas y Exploración**: *"Buscá helados, café, delicias..."*, *"Buscá por DNI o nombre..."*, *"Probá con otro término de búsqueda."*.
- **Autenticación y Registro**: *"Iniciá Sesión"*, *"Registrate"*, *"Ingresá tu correo"*, *"Creá tu cuenta"*.
- **Canjes y Premios**: *"Canjeá"*, *"Confirmá tu canje"*, *"Sí, Canjeá"*, *"Mostrá el código QR o el texto en caja"*, *"Todavía no tenés canjes"*, *"Explorá el catálogo y canjeá tus puntos."*.
- **Instalación de la PWA**: *"Instalá Helartico"*, *"Tocá el botón Compartir"*, *"Deslizá hacia abajo"*, *"Elegí 'Instalar aplicación'"*, *"Confirmá la instalación"*, *"vas a poder abrir Helartico"*.
- **Navegación e Historial**: *"Llegaste al final del catálogo ✨"*, *"Llegaste al final de tu historial"*, *"Llegaste al final de la lista"*, *"No podés quitarte el rol de Administrador a vos mismo"*.

### 18.5 Pruebas Automatizadas
- **Suite de Pruebas en Cliente (`client/src/__tests__/uiLocalizationAndComponents.test.ts`)**:
  - Verificación del renderizado del componente `PasswordInput` con propiedades controladas.
  - Comprobación de estándares de voseo y descarte de conjugaciones de tuteo no deseadas.
  - Validación de ausencia de cadenas obsoletas referidas a "club de fidelidad".
- **Suite Integral del Sistema**: 62 pruebas backend en Vitest + 6 pruebas frontend en Vitest en estado verde (100% éxito).