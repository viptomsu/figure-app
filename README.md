# Figure E-Commerce Platform

Full-stack e-commerce platform consisting of two main applications:

- **Backend** (Port 8080): Node.js/Express API with PostgreSQL & Prisma
- **Frontend** (Port 3000): Next.js 16 TypeScript store (includes Admin Dashboard)

## Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL 16+

### Installation & Running

1.  **Backend**

    ```bash
    cd backend
    npm install
    # Create .env file based on .env.sample
    npm run prisma:generate
    npm run prisma:migrate
    npm run dev
    ```

2.  **Frontend**

    ```bash
    cd frontend
    npm install
    # Create .env.local file based on requirements
    npm run dev
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

### General

- Use meaningful variable and function names
- 2 spaces indentation for JavaScript/TypeScript
- Keep functions small and focused

### Backend

- ES6 modules (`import/export`)
- Async/await for async operations
- Express route handlers with try-catch error handling
- Prisma for database operations

### Frontend

- TypeScript for type safety
- Functional components with hooks
- Tailwind CSS v4 for styling
- Zustand for state management
- ShadCN UI for components

## Security

- JWT tokens with refresh mechanism
- Input validation with Zod schemas
- Environment variable management

## Deployment

- All apps deploy to Vercel
- Database: PostgreSQL (e.g., Neon, Supabase, or AWS RDS)
