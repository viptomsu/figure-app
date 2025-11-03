# Figure Backend API

Node.js/Express REST API server for the Figure e-commerce platform.

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js with ES modules
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with refresh tokens
- **File Upload**: Multer with Sharp for image processing
- **Payment**: VNPay integration for Vietnamese payments
- **Email**: Nodemailer
- **Deployment**: Vercel serverless functions

## Prerequisites

- Node.js 14+ installed
- MongoDB database (local or MongoDB Atlas)

## Installation

```bash
cd backend
npm install
```

## Environment Configuration

1. Copy `.env.sample` to `.env`
2. Update the following variables:
   ```env
   PORT=5001
   MONGODB_URL=mongodb://localhost:27017/figure-db
   ACCESS_TOKEN_SECRET=your_access_token_secret
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   ```

## Development

```bash
# Start development server with hot reload
npm run dev

# Start production server
npm start
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

## Database Models

### User
```javascript
{
  username: String,
  password: String,
  email: String,
  phoneNumber: String,
  fullName: String,
  avatar: String,
  role: ["ADMIN", "STAFF", "CUSTOMER"],
  address: String,
  isDelete: Boolean,
  active: Boolean
}
```

### Product
```javascript
{
  name: String,
  description: String,
  price: Number,
  categoryId: ObjectId,
  brandId: ObjectId,
  images: [String],
  variations: [{
    name: String,
    options: [String],
    price: Number,
    stock: Number
  }],
  isDelete: Boolean,
  isActive: Boolean
}
```

### Order
```javascript
{
  userId: ObjectId,
  items: [{
    productId: ObjectId,
    quantity: Number,
    price: Number,
    variations: Object
  }],
  totalAmount: Number,
  status: ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"],
  shippingAddress: Object,
  paymentMethod: String,
  paymentStatus: String,
  voucherId: ObjectId
}
```

## Project Structure

```
backend/
├── src/
│   ├── app.js              # Express app configuration
│   ├── index.js            # Server entry point
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── db/                 # Database connection
│   ├── middlewares/        # Custom middlewares
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── services/           # Business logic services
│   └── utils/              # Utility functions
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
- Input validation with Mongoose schemas
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

## Deployment

### Vercel Deployment

The backend is configured for Vercel serverless deployment:

1. Connect repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

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
