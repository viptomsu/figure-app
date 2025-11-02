# VieFigure E-Commerce Platform

## Project Overview
VieFigure is a full-stack e-commerce platform consisting of three main applications:
- **Backend**: Node.js/Express API server with MongoDB database
- **Frontend**: React TypeScript customer-facing e-commerce store
- **Admin**: React JavaScript admin dashboard for store management

## Architecture

### Backend (`/backend`)
- **Framework**: Express.js with ES modules
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with refresh tokens
- **File Upload**: Multer with Sharp for image processing
- **Payment**: VNPay integration for Vietnamese payments
- **Deployment**: Vercel serverless functions

**Key Features:**
- Product catalog with categories, brands, and variations
- User authentication and authorization
- Order management and tracking
- Shopping cart and wishlist
- Review and rating system
- Address book management
- Voucher/discount system
- Email notifications with Nodemailer
- Revenue analytics

### Frontend (`/frontend`)
- **Framework**: React 17 with TypeScript
- **UI Library**: Ant Design 5, React Bootstrap
- **State Management**: Redux with Redux Saga
- **Routing**: React Router v5
- **Payment**: PayPal integration
- **Styling**: Sass/SCSS

**Key Features:**
- Product browsing and search
- Shopping cart management
- User authentication and profiles
- Order placement and tracking
- Product reviews
- Wishlist functionality
- Multi-language support preparation

### Admin (`/admin`)
- **Framework**: React 16 with JavaScript
- **UI Library**: Ant Design 4
- **State Management**: Redux with Redux Saga
- **Charts**: Chart.js, ApexCharts
- **Rich Text**: TinyMCE, React Quill
- **Real-time**: WebSocket support with SockJS

**Key Features:**
- Product management
- Order processing
- User management
- Analytics dashboard
- Content management
- Real-time notifications

## Development Workflow

### Environment Setup
1. Clone the repository
2. Set up environment variables:
   - Backend: Copy `.env.sample` to `.env` and configure
   - Frontend: Uses default React development server
   - Admin: Configure `.env` for API endpoints

### Development Commands
```bash
# Backend
cd backend
npm run dev          # Start with nodemon
npm start            # Production start

# Frontend
cd frontend
npm start            # Development server on port 3000
npm run build        # Production build
npm test             # Run tests

# Admin
cd admin
npm start            # Development server on port 3001
npm run build        # Production build
npm test             # Run tests
```

### Database Models
- **User**: Authentication, profiles, roles
- **Product**: Catalog with variations and images
- **Order**: Order management and tracking
- **Category/Brand**: Product classification
- **Review**: Product rating system
- **Voucher**: Discount management
- **AddressBook**: User shipping addresses

### API Structure
- `/api/auth` - Authentication endpoints
- `/api/products` - Product management
- `/api/orders` - Order processing
- `/api/users` - User management
- `/api/categories` - Category management
- `/api/brands` - Brand management
- `/api/reviews` - Product reviews
- `/api/vouchers` - Discount codes
- `/api/vnpay` - Payment processing

### Deployment
- **Backend**: Vercel serverless functions
- **Frontend**: Vercel static hosting
- **Admin**: Vercel static hosting
- **Database**: MongoDB Atlas

## Code Conventions

### Backend
- ES6 modules (`import/export`)
- Async/await for async operations
- Express route handlers with try-catch error handling
- Mongoose schemas with validation
- JWT middleware for protected routes

### Frontend
- TypeScript for type safety
- Functional components with hooks
- Redux for global state management
- Axios for API calls
- Ant Design components for UI

### Admin
- JavaScript ES6+
- Class and functional components mixed
- Redux Saga for side effects
- Ant Design v4 components

## Testing
- Jest and React Testing Library for frontend testing
- No specific backend testing framework configured

## Security Considerations
- JWT tokens with refresh mechanism
- CORS configuration for allowed origins
- Input validation with Mongoose schemas
- File upload restrictions
- Environment variable management
