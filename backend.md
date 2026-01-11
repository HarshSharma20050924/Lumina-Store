# Lumina Backend Implementation Roadmap (Node.js + Express)

This document outlines the architecture and implementation plan to build a dedicated, production-ready REST API using **Node.js**, **Express**, **PostgreSQL**, and **Prisma**. This backend will serve the existing React frontend.

## 1. Technology Stack

*   **Runtime**: Node.js
*   **Framework**: Express.js (Fast, unopinionated, minimalist web framework)
*   **Language**: TypeScript (Shared types with Frontend)
*   **Database**: PostgreSQL (Supabase, Neon, or self-hosted)
*   **ORM**: Prisma (Type-safe database client)
*   **Authentication**: JWT (JSON Web Tokens) + bcryptjs
*   **Payment Gateway**: Stripe API
*   **Image Storage**: Cloudinary or AWS S3 (via Multer)
*   **Validation**: Zod (Shared schemas with Frontend)

---

## 2. Architecture Overview

We will use a **Decoupled Architecture**:
1.  **Frontend (Client)**: React (Port 3000) - Fetches data via HTTP requests (Axios/Fetch).
2.  **Backend (Server)**: Node.js/Express (Port 5000) - Exposes RESTful API endpoints.
3.  **Database**: PostgreSQL - Stores persistent data.

---

## 3. Database Schema Design (Prisma)

You will create a `schema.prisma` file in the backend.

### Models
1.  **User**: `id`, `email`, `password_hash`, `name`, `role` (USER/ADMIN), `createdAt`.
2.  **Address**: `id`, `userId`, `street`, `city`, `zip`, `country`.
3.  **Product**: `id`, `name`, `slug`, `description`, `price`, `stock`, `images` (string[]), `categoryId`, `attributes` (JSON: colors, sizes).
4.  **Category**: `id`, `name`, `slug`, `parentId` (for subcategories).
5.  **Order**: `id`, `userId`, `status`, `totalAmount`, `paymentIntentId`, `shippingAddress`.
6.  **OrderItem**: `id`, `orderId`, `productId`, `quantity`, `priceAtPurchase`, `selectedColor`, `selectedSize`.

---

## 4. Implementation Phases

### Phase 1: Server Setup & Infrastructure
**Goal**: Get a "Hello World" API running with a database connection.

1.  **Initialize Project**:
    *   `mkdir backend && cd backend`
    *   `npm init -y`
    *   Install: `express`, `cors`, `dotenv`, `helmet` (security).
    *   Dev: `typescript`, `ts-node`, `nodemon`.
2.  **Database Setup**:
    *   Initialize Prisma: `npx prisma init`.
    *   Connect to PostgreSQL instance.
3.  **Basic Server**:
    *   Create `src/server.ts`.
    *   Configure CORS to allow requests from `localhost:3000` (Frontend).

### Phase 2: Authentication (JWT)
**Goal**: Allow users to register and login securely.

1.  **Models**: Define `User` model in Prisma.
2.  **Utils**:
    *   `generateToken.ts`: Sign JWTs.
    *   `hashPassword.ts`: Use bcryptjs.
3.  **Middleware**:
    *   `authMiddleware.ts`: Intercept requests, verify Bearer token, attach user to request object.
    *   `adminMiddleware.ts`: Check if `req.user.role === 'ADMIN'`.
4.  **Endpoints**:
    *   `POST /api/auth/register`
    *   `POST /api/auth/login`
    *   `GET /api/auth/me` (Get current user profile).

### Phase 3: Product Management (Public & Admin)
**Goal**: dynamic inventory management.

1.  **Models**: Define `Product` and `Category`.
2.  **Seeding**: Create a `seed.ts` to import `MOCK_PRODUCTS` from frontend to DB.
3.  **Endpoints**:
    *   `GET /api/products` (Support query params: `?page=1&category=men&sort=price_asc`).
    *   `GET /api/products/:id`
    *   `POST /api/products` (Admin only).
    *   `PUT /api/products/:id` (Admin only).
    *   `DELETE /api/products/:id` (Admin only).

### Phase 4: Cart & Order Management
**Goal**: Handling the checkout flow.

1.  **Endpoints**:
    *   `POST /api/orders` (Create order from cart data).
    *   `GET /api/orders/my-orders` (User history).
    *   `GET /api/orders` (Admin: View all).
    *   `PATCH /api/orders/:id/status` (Admin: Update status).
2.  **Logic**:
    *   When an order is placed, verify stock levels in the DB.
    *   Use Prisma `interactive transactions` to ensure atomic operations (decrement stock + create order).

### Phase 5: Payment Integration (Stripe)
**Goal**: Secure payment processing.

1.  **Setup**: Install `stripe` package.
2.  **Endpoints**:
    *   `POST /api/create-payment-intent`:
        *   Backend calculates total price based on DB products (never trust client-side price).
        *   Returns `clientSecret` to frontend.
3.  **Webhooks**:
    *   `POST /api/webhook`: Listen for `payment_intent.succeeded`.
    *   Update Order status to `PAID`.

### Phase 6: Image Uploads
**Goal**: Allow admins to upload product images.

1.  **Service**: Cloudinary (easiest) or AWS S3.
2.  **Middleware**: `multer`.
3.  **Endpoint**:
    *   `POST /api/upload`: Accepts file, returns URL.

---

## 5. Proposed File Structure

```text
/backend
  /src
    /config
      db.ts (Prisma client)
    /controllers
      authController.ts
      productController.ts
      orderController.ts
    /middleware
      authMiddleware.ts
      errorMiddleware.ts
      validateRequest.ts
    /routes
      authRoutes.ts
      productRoutes.ts
      orderRoutes.ts
    /services
      stripeService.ts
    /utils
      jwt.ts
    server.ts
    app.ts
  package.json
  schema.prisma
  .env
```

---

## 6. Deployment Guide

1.  **Database**: Provision a Postgres DB (e.g., Railway, Neon, Render).
2.  **Backend**:
    *   Set environment variables (`DATABASE_URL`, `JWT_SECRET`, `STRIPE_KEY`).
    *   Deploy to Render, Heroku, or DigitalOcean App Platform.
3.  **Frontend**:
    *   Update API calls to point to the production Backend URL (e.g., `https://api.lumina.com`).
    *   Deploy to Vercel/Netlify.

---

## 7. Next Steps for Developer

1.  **Create the Server**: "Create the Node.js server setup with Express and TypeScript."
2.  **Setup Prisma**: "Create the schema.prisma file with the models defined above."
3.  **Auth API**: "Create the Auth controller and routes."
