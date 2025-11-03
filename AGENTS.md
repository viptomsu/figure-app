# Figure E-Commerce Platform

## Project Overview
Figure is a full-stack e-commerce platform with three main applications:
- **Backend** (`/backend`): Node.js/Express API server with MongoDB database
- **Frontend** (`/frontend`): Next.js 16 TypeScript customer-facing store
- **Admin** (`/admin`): React JavaScript admin dashboard

## Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd figure-app

# Install dependencies for all applications
npm run install:all

# Set up environment variables
# Backend: Copy backend/.env.sample to backend/.env
# Frontend: Copy frontend/.env.sample to frontend/.env
# Admin: Copy admin/.env.sample to admin/.env

# Start all development servers
npm run dev:all
```

## Application Structure

### Backend (Port 5001)
- **Technology**: Node.js, Express, MongoDB, Mongoose
- **Authentication**: JWT with refresh tokens
- **File Processing**: Multer with Sharp
- **Payment**: VNPay integration
- **Documentation**: See [backend/README.md](./backend/README.md)

### Frontend (Port 3000)
- **Technology**: Next.js 16, TypeScript, Tailwind CSS
- **UI Libraries**: Ant Design 5, ShadCN UI
- **State Management**: Zustand
- **Payment**: PayPal integration
- **Documentation**: See [frontend/README.md](./frontend/README.md)

### Admin (Port 3001)
- **Technology**: React 16, JavaScript, Ant Design 4
- **State Management**: Redux with Redux Saga
- **Charts**: Chart.js, ApexCharts
- **Rich Text**: TinyMCE, React Quill
- **Documentation**: See [admin/README.md](./admin/README.md)

## Common Development Commands

```bash
# Backend
cd backend
npm run dev          # Start with nodemon
npm start            # Production start

# Frontend
cd frontend
npm run dev          # Development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run linter

# Admin
cd admin
npm start            # Development server
npm run build        # Production build
npm test             # Run tests
```

## Code Conventions

### General
- Use meaningful variable and function names
- Follow consistent indentation (2 spaces for JavaScript/TypeScript)
- Add comments for complex logic
- Keep functions small and focused

### Backend
- ES6 modules (`import/export`)
- Async/await for async operations
- Express route handlers with try-catch error handling
- Mongoose schemas with validation

### Frontend
- TypeScript for type safety
- Functional components with hooks
- Tailwind CSS for styling
- Zustand for state management

### Admin
- JavaScript ES6+
- Class and functional components mixed
- Redux Saga for side effects
- Ant Design components for UI

## Security Considerations
- JWT tokens with refresh mechanism
- CORS configuration for allowed origins
- Input validation with Mongoose schemas
- File upload restrictions
- Environment variable management

## Deployment
- **Backend**: Vercel serverless functions
- **Frontend**: Vercel static hosting
- **Admin**: Vercel static hosting
- **Database**: MongoDB Atlas

## Repository Links
- [Backend Documentation](./backend/README.md)
- [Frontend Documentation](./frontend/README.md)
- [Admin Documentation](./admin/README.md)
