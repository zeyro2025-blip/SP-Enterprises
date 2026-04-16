# SP Enterprises eCommerce Platform

Full-stack masala eCommerce website for SP Enterprises with:

- `frontend/`: Next.js storefront and admin UI
- `backend/`: Express, MongoDB, JWT auth, product and order APIs, Razorpay flow

## Stack

- Frontend: Next.js App Router, React, Framer Motion, React Hot Toast
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, Multer, Razorpay

## Local setup

### Backend

```bash
cd backend
copy .env.example .env
npm install
npm run seed:admin
npm run dev
```

### Frontend

```bash
cd frontend
copy .env.example .env.local
npm install
npm run dev
```

## Environment variables

### Backend `.env`

- `PORT`
- `CLIENT_URL`
- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `ADMIN_NAME`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

### Frontend `.env.local`

- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_BACKEND_URL`

## Deployment

### Frontend on Vercel

1. Import `frontend` as a Vercel project.
2. Set `NEXT_PUBLIC_API_URL` to your deployed backend API URL like `https://your-api.onrender.com/api`.
3. Set `NEXT_PUBLIC_BACKEND_URL` to the backend origin like `https://your-api.onrender.com`.
4. Build command: `npm run build`

### Backend on Render or Railway

1. Deploy the `backend` folder as a Node service.
2. Set start command to `npm start`.
3. Add all backend environment variables from `.env.example`.
4. Ensure CORS `CLIENT_URL` matches the deployed frontend URL.
5. Persist uploaded images with a disk or cloud storage strategy for production.

### Database on MongoDB Atlas

1. Create a cluster and database user.
2. Copy the connection string into `MONGODB_URI`.
3. Add your deployment IP or allow trusted access as needed.

## Functional coverage

- User signup and login with JWT
- Product listing, search, category filters, reviews
- Cart and checkout
- Razorpay order creation and payment verification
- User dashboard with order history and profile updates
- Admin dashboard, product CRUD, order management, user role management

## Notes

- Razorpay requires real test or live keys in backend `.env`.
- Product image uploads are stored in `backend/uploads`.
- Email confirmations are not wired yet; the architecture is ready for a mail service to be added.
