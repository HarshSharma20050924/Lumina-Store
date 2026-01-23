# Lumina | Next-Gen E-Commerce Platform

![Lumina Banner](https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop)

<div align="center">

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://www.prisma.io/)
[![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io/)

</div>

---

**Lumina** is a full-stack, minimalist e-commerce ecosystem built for the modern web. It features a monolithic repository structure containing three distinct applications (Storefront, Admin Console, Logistics Driver App) powered by a robust Node.js backend.

# 🌐 Live Demos

Experience Lumina in action:

- **Storefront (Customer):** [lumina-store-black.vercel.app](https://lumina-store-black.vercel.app/)
- **Admin Dashboard:** [lumina-admin-black.vercel.app](https://lumina-admin-black.vercel.app/)
- **Driver App:** [lumina-driver-black.vercel.app](https://lumina-driver-black.vercel.app/)

*Note: All applications are connected to a shared backend API and database. Use the demo credentials provided in the Getting Started section to explore all features.*


##  Key Features

###  Storefront (Customer Experience)
*   **Modern Aesthetic:** Glassmorphism, fluid animations (Framer Motion), and minimalist typography.
*   **Dynamic CMS:** Homepage slides, sections, and navigation are fully manageable via the Admin API.
*   **Real-time Stock:** WebSocket integration for live inventory updates.
*   **Checkout Flow:** Multi-step checkout with address verification and simulated payment gateways.
*   **User Profiles:** Order history tracking, wishlist management, and profile settings.

###  Admin Console
*   **Dashboard Analytics:** Real-time revenue charts, inventory health, and order volume metrics.
*   **CMS Management:** Drag-and-drop style editing for Hero slides, site sections, and static pages.
*   **Order Management:** Kanban-style order processing (Processing -> Shipped -> Delivered).
*   **Marketing Tools:** Send global push notifications and create "Smart Segments" based on user behavior.

###  Logistics (Driver App)
*   **Job Assignment:** Real-time push notifications when orders are marked "Shipped".
*   **Delivery Workflow:** Route visualization (mock), OTP verification for secure handovers, and proof-of-delivery photo upload.
*   **Offline First:** Optimized for mobile viewports.

##  Architecture Overview

Lumina uses a **Decoupled Monolith** architecture. The frontend is a single Vite build that outputs three distinct entry points based on the port/URL, while the backend is a dedicated Express server.

| Service | Port | Description |
| :--- | :--- | :--- |
| **Store App** | `3001` | The main customer facing shopping experience. |
| **Admin App** | `3002` | Protected dashboard for store owners. |
| **Driver App** | `3003` | Mobile-first interface for delivery agents. |
| **Backend API** | `5000` | REST API, WebSocket Server, and Static Asset host. |
| **Database** | `5432` | PostgreSQL (via Docker). |

## 📁 Project Structure

```
lumina-store/
├── src/                      # Frontend Source (Vite)
│   ├── apps/                 # Application entry points
│   │   ├── StoreApp.tsx      # Main store application
│   │   ├── AdminApp.tsx      # Admin dashboard application
│   │   └── DriverApp.tsx     # Delivery driver application
│   ├── components/           # Shared UI components
│   ├── stores/               # Zustand state management slices
│   ├── utils/                # Shared utilities and helpers
│   └── types.ts              # Shared TypeScript interfaces
├── backend/                  # Backend Source (Node.js/Express)
│   ├── src/
│   │   ├── controllers/      # Route handlers and business logic
│   │   ├── middleware/       # Custom middleware (auth, logging)
│   │   ├── prisma/           # Database schema, migrations, seeds
│   │   ├── routes/           # API route definitions
│   │   ├── services/         # Business logic (Socket.io, Queue, etc.)
│   │   └── utils/            # Backend utilities
│   ├── prisma/
│   │   ├── schema.prisma     # Prisma data model
│   │   └── seed.ts           # Database seed script
│   └── server.ts             # Main application entry point
├── public/                   # Static assets
├── docker-compose.yml        # Database service definition
├── package.json              # Root package.json (frontend scripts)
├── vite.config.ts            # Vite configuration
└── README.md                 # This file
```

##  Getting Started

### Prerequisites
*   **Node.js** (v18 or higher)
*   **Docker & Docker Compose** (for running PostgreSQL database)
*   **npm** or **yarn** package manager

### Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/lumina-store.git
    cd lumina-store
    ```

2.  **Install root/frontend dependencies**
    ```bash
    npm install
    ```

3.  **Install backend dependencies**
    ```bash
    cd backend
    npm install
    cd ..
    ```

4.  **Environment Setup**
    
    Create a `.env` file in the `backend/` directory:
    ```env
    PORT=5000
    DATABASE_URL="postgresql://lumina:lumina123@localhost:5432/lumina_store?schema=public"
    JWT_SECRET="development_secret_key"
    NODE_ENV="development"
    FRONTEND_URL="http://localhost:3001"
    ADMIN_URL="http://localhost:3002"
    DRIVER_URL="http://localhost:3003"
    ```

5.  **Start the Database with Docker**
    ```bash
    docker-compose up -d postgres
    ```

6.  **Initialize Database (Migrations & Seeding)**
    ```bash
    cd backend
    npx prisma migrate dev --name init
    npm run seed  # Seeds products, admin user, and CMS content
    cd ..
    ```

7.  **Run Development Servers**
    ```bash
    npm run dev
    ```
    *This command uses `concurrently` to start all three frontend applications and the backend server simultaneously.*

### Accessing the Applications

Once the development servers are running, you can access the different applications:

*   **Storefront (Customer):** [http://localhost:3001](http://localhost:3001)
*   **Admin Dashboard:** [http://localhost:3002](http://localhost:3002)
    *   *Default Admin Credentials:* `admin@lumina.com` / `admin123`
*   **Driver Application:** [http://localhost:3003](http://localhost:3003)
    *   *Note:* Register a new account (it auto-upgrades in dev mode) or login with admin credentials
*   **Backend API:** [http://localhost:5000](http://localhost:5000)

## 🧪 Testing

The backend includes a test suite using Jest and Supertest.

```bash
cd backend
npm test
```

## 📚 API Reference

Base URL: `http://localhost:5000/api`

### Authentication

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| POST | `/auth/login` | Login user, admin, or agent | Public |
| POST | `/auth/register` | Register new customer or agent | Public |
| POST | `/auth/check-email` | Check if email exists | Public |
| POST | `/auth/send-otp` | Trigger OTP email/SMS | Public |
| GET | `/auth/me` | Get current user profile | Private |

### Products

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| GET | `/products` | Get all products (paginated, filtered) | Public |
| GET | `/products/:id` | Get single product details | Public |
| POST | `/products` | Create new product | Admin |
| PUT | `/products/:id` | Update product | Admin |
| DELETE | `/products/:id` | Delete product | Admin |

### Orders

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| POST | `/orders` | Create a new order | Private |
| GET | `/orders` | Get all orders | Admin/Agent |
| GET | `/orders/myorders` | Get current user history | Private |
| PATCH | `/orders/:id/status` | Update status (requires OTP for delivery) | Admin/Agent |
| POST | `/orders/:id/arrival` | Notify arrival & generate OTP | Agent |

### Content Management (CMS)

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| GET | `/content` | Get all site content | Public |
| PUT | `/content/hero/:id` | Update Hero Slide | Admin |
| PUT | `/content/section` | Update Section | Admin |
| PUT | `/content/page` | Update Static Page | Admin |

### Analytics

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| GET | `/analytics/dashboard` | Get KPIs (Revenue, Users, Stock) | Admin |
| GET | `/analytics/sales-chart`| Get 7-day sales data | Admin |

##  Technical Architecture Details

### Frontend Architecture
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite for fast development and optimized builds
- **State Management:** Zustand with modular slices (productSlice, cartSlice, authSlice, orderSlice, cmsSlice)
- **Styling:** Tailwind CSS for utility-first styling
- **Animations:** Framer Motion for smooth transitions and interactions
- **Icons:** Lucide React for consistent iconography
- **Multi-Port Configuration:** Vite serves different entry points based on port (3001, 3002, 3003)

### Backend Architecture
- **Runtime:** Node.js with Express.js
- **Database:** PostgreSQL with Prisma ORM for type-safe database operations
- **Real-time Communication:** Socket.io for live updates (inventory, order status, notifications)
- **Authentication:** JWT-based with Role-Based Access Control (RBAC)
- **Middleware:**
  - `protect`: Verifies valid JWT token
  - `admin`: Verifies `role === 'ADMIN'`
  - `adminOrAgent`: Verifies `role === 'ADMIN' || 'AGENT'`
- **Additional Features:**
  - Circuit Breaker pattern for database connections
  - In-memory queue for async tasks (OTP sending)
  - Request logging middleware for observability

### Database Schema (Prisma)

Key Models:
- `User`: Customers, Admins, and Delivery Agents
- `Product`: Inventory with categories, pricing, and stock
- `Order`: Customer orders with status tracking
- `OrderItem`: Individual items within orders
- `HeroSlide`: Dynamic homepage slides
- `SiteSection`: Configurable content sections
- `Review`: Product reviews and ratings

### Real-time Events (Socket.io)

| Event | Emitted By | Received By | Description |
| :--- | :--- | :--- | :--- |
| `order_update` | Backend | Store App | When order status changes |
| `job_available` | Backend | Driver App | When order is ready for pickup |
| `notification` | Backend | All Apps | General purpose push notifications |
| `stock_update` | Backend | Store App | When product inventory changes |

## 🔄 Order Lifecycle Data Flow

1.  **Order Creation:** Customer adds items to cart → `POST /api/orders`
2.  **Order Processing:** Order created with status `processing`. Stock is decremented transactionally.
3.  **Order Shipping:** Admin marks order as `shipped` via Admin Console.
4.  **Job Assignment:** Backend emits `job_available` socket event to all connected drivers.
5.  **Delivery Initiation:** Driver accepts job and navigates to delivery location.
6.  **Arrival Notification:** Driver arrives → `POST /orders/:id/arrival`. Backend generates OTP.
7.  **Handover Verification:** Customer provides OTP to Driver. Driver submits OTP → `PATCH /orders/:id/status` with `{ status: 'delivered', otp }`.
8.  **Completion:** Order marked `delivered`. Customer receives confirmation.

##  Troubleshooting

### Common Issues

1.  **Port Conflicts:**
    ```bash
    # Kill processes on conflicting ports
    npm run cleanup
    ```

2.  **Database Connection Errors:**
    - Ensure Docker is running: `docker ps`
    - Check PostgreSQL container: `docker-compose logs postgres`
    - Verify `.env` DATABASE_URL matches `docker-compose.yml`

3.  **CORS Errors:**
    - Ensure `FRONTEND_URL`, `ADMIN_URL`, `DRIVER_URL` in backend `.env` match your browser URLs
    - Restart backend after changing environment variables

4.  **Prisma Migration Issues:**
    ```bash
    cd backend
    npx prisma generate
    npx prisma db push --accept-data-loss  # Development only
    ```

##  Deployment

### Production Deployment Steps

1.  **Database:** Provision a managed PostgreSQL database (AWS RDS, Railway, Supabase, etc.)
2.  **Backend:**
    - Build: `cd backend && npm run build`
    - Set production environment variables
    - Use process manager (PM2) for running the server
3.  **Frontend:**
    - Build: `npm run build`
    - Deploy static files to CDN or web server
    - Configure routing (Nginx/Caddy) for multi-app setup
4.  **Environment Variables (Production):**
    ```env
    NODE_ENV=production
    DATABASE_URL="your_production_database_url"
    JWT_SECRET="strong_random_secret"
    FRONTEND_URL="https://yourstore.com"
    ADMIN_URL="https://admin.yourstore.com"
    DRIVER_URL="https://driver.yourstore.com"
    ```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1.  Fork the repository
2.  Create a feature branch: `git checkout -b feature/amazing-feature`
3.  Commit your changes: `git commit -m 'Add amazing feature'`
4.  Push to the branch: `git push origin feature/amazing-feature`
5.  Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new functionality
- Update documentation as needed
- Ensure code follows existing style patterns

## 📄 License

Distributed under the MIT License. See `LICENSE` file for more information.

## 📞 Support

For support, questions, or feature requests:
- Open an issue on GitHub
- Check the existing documentation

---

<div align="center">
  
**Lumina** – Building the future of e-commerce, one pixel at a time.

</div>
