# Figure E-Commerce Platform

Full-stack e-commerce platform with three applications:

- **Backend** (Port 8080): Node.js/Express API with MongoDB
- **Frontend** (Port 3000): Next.js 16 TypeScript store
- **Admin** (Port 3001): React 16 JavaScript dashboard

## Quick Start

Please refer to the [README.md](./README.md) for detailed installation and running instructions.

## Common Commands

```bash
# Backend
cd backend && npm run dev

# Frontend
cd frontend && npm run dev

# Admin
cd admin && npm start
```

## Code Conventions

### Comment Guidelines

**AVOID these comments:**

```javascript
// state for loading
const [loading, setLoading] = useState(false);

// increment counter
setCount(count + 1);
```

**USE comments for:**

- Complex business logic
- Non-obvious implementation details
- Workarounds or temporary solutions
- API integration notes

**Good example:**

```javascript
// Cache user session to reduce API calls during checkout
// Expire after 30 minutes to ensure fresh data
const sessionData = cache.get(`session_${userId}`);
```

### General

- Use meaningful variable and function names
- 2 spaces indentation for JavaScript/TypeScript
- Keep functions small and focused

### Backend

- ES6 modules (`import/export`)
- Async/await for async operations
- Express route handlers with try-catch error handling

### Frontend

- TypeScript for type safety
- Functional components with hooks
- Tailwind CSS for styling
- Zustand for state management

### Admin

- JavaScript ES6+
- Redux Saga for side effects
- Ant Design components for UI

## Security

- JWT tokens with refresh mechanism
- Input validation with schemas
- Environment variable management

## Deployment

- All apps deploy to Vercel
- Database: MongoDB Atlas
