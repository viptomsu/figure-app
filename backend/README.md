# Figure Backend API

Node.js/Express REST API server for the Figure e-commerce platform.

## Technology Stack

- **Runtime**: Node.js (see package.json for version)
- **Framework**: Express.js with ES modules
- **Database**: PostgreSQL with Prisma ORM (see package.json for versions)
- **Authentication**: JWT with refresh tokens
- **File Upload**: Multer with Sharp for image processing
- **Payment**: VNPay integration for Vietnamese payments
- **Email**: Nodemailer
- **Deployment**: Vercel serverless functions

## Prerequisites

- Node.js 20+
- PostgreSQL 16+
- npm 9+ or compatible package manager

## Installation

### First-time Setup Checklist

1. **Install dependencies**:

   ```bash
   cd backend
   npm install
   ```

2. **Create environment file**:

   ```bash
   cp .env.sample .env
   ```

3. **Configure environment variables** - Edit `.env` with your actual values:

   - `DATABASE_URL` - PostgreSQL connection string
   - `ACCESS_TOKEN_SECRET` - Generate secure random string
   - `REFRESH_TOKEN_SECRET` - Generate secure random string

4. **Ensure PostgreSQL is running** - PostgreSQL 16+ must be installed and running

5. **Generate Prisma client**:

   ```bash
   npm run prisma:generate
   ```

6. **Run database migrations**:

   ```bash
   npm run prisma:migrate
   ```

7. **Start development server**:
   ```bash
   npm run dev
   ```

### Quick Install

```bash
cd backend && npm install
```

## Environment Configuration

1. Copy `.env.sample` to `.env`
2. Update the following variables:
   ```env
   PORT=8080  # Default backend port for local development
   DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
   ACCESS_TOKEN_SECRET=your_access_token_secret
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   ```

## Development

```bash
# Start development server with hot reload
npm run dev

# Explicit watch mode (same as dev)
npm run dev:watch

# Start production server (builds first)
npm start
```

**Note**: Use `npm run dev` for development with hot reload. `npm start` is for production and will build the project first.

## Troubleshooting

### Common Startup Issues

**Missing .env file**

- Error: `DATABASE_URL not defined` or similar environment variable errors
- Solution: Copy `.env.sample` to `.env` and fill in actual values
- Command: `cp .env.sample .env`

**Prisma client not generated**

- Error: `Cannot find module '@prisma/client'` or Prisma client errors
- Solution: Generate Prisma client after installation
- Command: `npm run prisma:generate`

**Database connection issues**

- Error: `ECONNREFUSED`, `password authentication failed`, or database connection errors
- Solution:
  - Ensure PostgreSQL is running: `brew services start postgresql` (macOS) or `systemctl start postgresql` (Linux)
  - Verify DATABASE_URL is correct in `.env`
  - Create database if it doesn't exist: `createdb your_database_name`

**Node version mismatch**

- Error: `Unsupported Node.js version` or module resolution errors
- Solution: Ensure Node.js 20.18.2 is installed
- Check: `node -v` (should show 20.18.2)
- Install with nvm: `nvm install 20.18.2 && nvm use 20.18.2`

**Port already in use**

- Error: `EADDRINUSE: address already in use :::8080`
- Solution:
  - Change PORT in `.env` file
  - Or stop process using port 8080: `lsof -ti:8080 | xargs kill`

**Path alias issues**

- Error: `Cannot find module '@/...'` or module resolution errors
- Solution:
  - Ensure dependencies are installed: `npm install`
  - Check that `tsconfig-paths` is installed (should be automatic)
  - Verify `tsconfig.json` paths configuration

### Common Errors & Solutions

| Error                                           | Solution                                                   |
| ----------------------------------------------- | ---------------------------------------------------------- |
| `Cannot find module '@/utils/...'`              | Run `npm install` to ensure tsconfig-paths is installed    |
| `Prisma Client not generated`                   | Run `npm run prisma:generate`                              |
| `DATABASE_URL not defined`                      | Create `.env` file with valid DATABASE_URL                 |
| `Port 8080 already in use`                      | Change PORT in `.env` or stop conflicting process          |
| `JWT secrets must be provided`                  | Set ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET in `.env` |
| `bcrypt error: data must be a string or Buffer` | Ensure passwords are strings before hashing                |

### Verification Commands

```bash
# Check Node version (should be 20.18.2)
node -v

# Check PostgreSQL connection
npm run prisma:studio

# Test database connection
npm run prisma:validate

# Test basic server startup
npm run dev
```

## Database Setup

Uses PostgreSQL with Prisma ORM. See `prisma/schema.prisma` for schema definition.

**Prerequisites:**

- PostgreSQL (version per package.json)
- Set DATABASE_URL in `.env`

**Quick Start:**

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:studio  # Optional: Inspect database
```

## API Endpoints

### Authentication

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/refresh-token` - Refresh access token
- `POST /auth/logout` - User logout
- `POST /auth/forgot-password` - Forgot password
- `POST /auth/reset-password` - Reset password

### Users

- `GET /users` - Get all users (admin only)
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user profile
- `DELETE /users/:id` - Delete user (admin only)

### Products

- `GET /products` - Get all products with pagination and filtering
- `GET /products/:id` - Get product by ID
- `POST /products` - Create new product (admin/staff only)
- `PUT /products/:id` - Update product (admin/staff only)
- `DELETE /products/:id` - Delete product (admin only)

### Categories

- `GET /categories` - Get all categories
- `GET /categories/:id` - Get category by ID
- `POST /categories` - Create new category (admin/staff only)
- `PUT /categories/:id` - Update category (admin/staff only)
- `DELETE /categories/:id` - Delete category (admin only)

### Brands

- `GET /brands` - Get all brands
- `GET /brands/:id` - Get brand by ID
- `POST /brands` - Create new brand (admin/staff only)
- `PUT /brands/:id` - Update brand (admin/staff only)
- `DELETE /brands/:id` - Delete brand (admin only)

### Orders

- `GET /orders` - Get all orders (admin only)
- `GET /orders/user/:userId` - Get user's orders
- `GET /orders/:id` - Get order by ID
- `POST /orders` - Create new order
- `PUT /orders/:id` - Update order status (admin/staff only)
- `DELETE /orders/:id` - Cancel order (user or admin)

### Reviews

- `GET /reviews` - Get all reviews with pagination
- `GET /reviews/product/:productId` - Get reviews for a product
- `POST /reviews` - Create new review
- `PUT /reviews/:id` - Update review (owner only)
- `DELETE /reviews/:id` - Delete review (owner or admin)

### Vouchers

- `GET /vouchers` - Get all active vouchers
- `GET /vouchers/:id` - Get voucher by ID
- `POST /vouchers` - Create new voucher (admin/staff only)
- `PUT /vouchers/:id` - Update voucher (admin/staff only)
- `DELETE /vouchers/:id` - Delete voucher (admin only)

### Address Book

- `GET /addressbook/user/:userId` - Get user's addresses
- `POST /addressbook` - Add new address
- `PUT /addressbook/:id` - Update address
- `DELETE /addressbook/:id` - Delete address

### Payment

- `POST /vnpay/create-payment` - Create VNPay payment URL
- `GET /vnpay/callback` - VNPay payment callback

### Email

- `POST /email/send-confirmation` - Send order confirmation
- `POST /email/send-reset` - Send password reset email

## Project Structure

```
backend/
├── src/
│   ├── app.js              # Express app configuration
│   ├── index.js            # Server entry point
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── db/                 # Database connection (Prisma client)
│   ├── middlewares/        # Custom middlewares
│   ├── models/             # [REMOVED] Mongoose models (migration complete)
│   ├── routes/             # API routes
│   ├── services/           # Business logic services
│   └── utils/              # Utility functions
├── prisma/                 # Prisma schema and migrations
│   ├── schema.prisma       # Database schema definition
│   └── migrations/         # Database migration history
├── uploads/                # File upload directory
├── .env.sample             # Environment variables template
├── package.json
└── vercel.json            # Vercel deployment config
```

## Error Handling

All API responses follow a consistent format:

### Success Response

```json
{
	"success": true,
	"data": {},
	"message": "Operation successful"
}
```

### Error Response

```json
{
	"success": false,
	"error": {
		"code": "ERROR_CODE",
		"message": "Error description"
	}
}
```

## Security Features

- JWT authentication with access and refresh tokens
- Password hashing with bcrypt
- CORS configuration
- Input validation with Prisma schema and TypeScript types
- Database-level constraints enforced by PostgreSQL
- File upload restrictions (image types only)
- Rate limiting on sensitive endpoints

## Development Guidelines

1. Use async/await for all async operations
2. Wrap route handlers in try-catch blocks
3. Validate input data before processing
4. Use meaningful variable and function names
5. Add comments for complex business logic
6. Follow RESTful API conventions
7. Implement proper error handling
8. Use environment variables for sensitive data
9. Use Prisma 6 best practices: leverage `include` for relations, use transactions for multi-step operations, and utilize Prisma's aggregate API for complex queries

## Deployment

All apps deploy to Vercel. See package.json for required Node.js and dependency versions.

**Environment Variables:**

- DATABASE_URL (PostgreSQL connection)
- ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET
- Other service credentials (Firebase, email, etc.)

**Vercel Configuration:**

1. Connect repo to Vercel
2. Set env vars in dashboard
3. Deploy on push to main

### Manual Deployment

```bash
# Install production dependencies
npm ci --production

# Start production server
npm start
```

## Testing

Currently no testing framework is configured. Recommended setup:

- Jest for unit testing
- Supertest for API endpoint testing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Support

For issues and questions:

- Create an issue in the repository
- Contact the development team
