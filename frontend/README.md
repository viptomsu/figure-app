# Figure Frontend

Next.js 16 TypeScript e-commerce store for the Figure platform.

## Technology Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Library**: React 19
- **Styling**: Tailwind CSS v4 with ShadCN UI components
- **UI Components**: shadcn/ui (Radix UI primitives)
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form with Zod validation
- **Validation**: Zod schemas with type-safe form validation
- **Payment**: PayPal integration
- **Notifications**: Sonner toast notifications
- **Image Optimization**: Next.js Image component

## Prerequisites

- Node.js 18+ installed
- Backend API server running

## Installation

```bash
cd frontend
npm install
```

## Environment Configuration

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
```

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linter
npm run lint
```

## Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── app/                # Next.js app router pages
│   │   ├── admin/          # Admin dashboard pages
│   │   ├── cart/           # Shopping cart
│   │   ├── checkout/       # Checkout process
│   │   ├── login/          # Login page
│   │   ├── products/       # Product listing
│   │   ├── register/       # Registration page
│   │   ├── globals.css     # Global styles (Tailwind v4 config)
│   │   ├── layout.tsx      # Root layout
│   │   └── loading.tsx     # Loading component
│   ├── components/         # Reusable UI components
│   │   ├── ui/             # ShadCN UI components
│   │   ├── Footer/         # Footer components
│   │   ├── Header/         # Header components
│   │   ├── Home/           # Home page components
│   │   ├── Products/       # Product-related components
│   │   └── ...             # Other component groups
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility libraries
│   ├── schema/             # Zod validation schemas
│   │   ├── validation.ts   # Form validation schemas
│   │   └── searchParams.ts # Search params schemas
│   ├── services/           # API service functions
│   ├── stores/             # Zustand stores
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions
├── components.json         # ShadCN configuration
├── next.config.ts          # Next.js configuration
└── tsconfig.json           # TypeScript configuration
```

## Key Features

### Product Catalog

- Product browsing with pagination
- Category and brand filtering
- Product search functionality
- Product detail pages with image gallery
- Product variations (size, color, etc.)
- Product reviews and ratings

### Shopping Cart

- Add/remove products from cart
- Update product quantities
- Calculate totals with tax and shipping
- Apply discount vouchers
- Persistent cart using local storage

### User Account

- User registration and login
- Profile management
- Order history
- Address book management
- Wishlist functionality

### Checkout Process

- Multi-step checkout flow
- Multiple payment methods (PayPal)
- Order confirmation
- Email notifications

### Admin Dashboard

- Product management (CRUD)
- Order management
- User management
- Review moderation
- Voucher management
- Analytics and reporting

## Component Architecture

### Layout Components

- `AppLayout`: Root layout wrapper
- `Header`: Main navigation header
- `Footer`: Site footer
- `Sidebar`: Category sidebar (optional)

### UI Components

- shadcn/ui components in `src/components/ui/`
- Custom components built with Tailwind CSS
- Icons from lucide-react
- Modal management with nice-modal
- Toast notifications with sonner

### Page Components

- `Home`: Landing page
- `Products`: Product listing page
- `ProductDetail`: Individual product page
- `Cart`: Shopping cart page
- `Checkout`: Checkout process pages
- `Account`: User account pages
- `Auth`: Authentication pages

## State Management

### Zustand Stores

#### Auth Store

```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}
```

#### Cart Store

```typescript
interface CartState {
  items: CartItem[];
  total: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}
```

#### Product Store

```typescript
interface ProductState {
  products: Product[];
  categories: Category[];
  brands: Brand[];
  loading: boolean;
  fetchProducts: (params?: ProductParams) => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchBrands: () => Promise<void>;
}
```

## API Services

API service functions are organized in `src/services/`:

## Routing

The app uses Next.js App Router with route groups:

```
/app
/app
├── admin/                 # Admin dashboard
│   ├── products/
│   ├── orders/
│   └── users/
├── cart/
├── checkout/
├── login/
├── products/
├── register/
├── admin/                 # Admin dashboard
│   ├── products/
│   ├── orders/
│   └── users/
├── account/
├── api/                   # API routes
└── globals.css
```

## Styling

### Tailwind CSS

### Tailwind CSS v4

- Configuration via CSS variables in `globals.css`
- No `tailwind.config.js` file needed
- Custom colors and spacing defined in CSS
- Responsive design utilities

### ShadCN UI

- Pre-built component library
- Located in `src/components/ui/`
- Customizable themes

## Form Handling

Forms use React Hook Form with Zod validation and TypeScript type safety:

```typescript
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

// Define validation schema
const validationSchema = z.object({
  email: z.string().min(1, 'Email là bắt buộc').email('Email không hợp lệ'),
  password: z.string().min(1, 'Mật khẩu là bắt buộc').min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

// Infer TypeScript type from schema
type FormValues = z.infer<typeof validationSchema>;

// Use with React Hook Form
const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm<FormValues>({
  resolver: zodResolver(validationSchema),
});

const onSubmit = async (data: FormValues) => {
  // Handle form submission with type-safe data
};
```

### Validation Schemas

Reusable Zod schemas are organized in `src/schema/`:

- **`validation.ts`**: Form validation schemas (email, password, phone, etc.)
- **`searchParams.ts`**: Search parameter schemas with type coercion

## Image Optimization

Images use Next.js Image component for optimization:

```typescript
<Image
  src={product.imageUrl}
  alt={product.name}
  width={300}
  height={300}
  className="rounded-lg"
/>
```

## Development Guidelines

1. Use TypeScript for all new components
2. Follow React functional component patterns
3. Use custom hooks for reusable logic
4. Implement proper error boundaries
5. Optimize images with Next.js Image component
6. Use semantic HTML elements
7. Implement loading states for async operations
8. Follow consistent naming conventions
9. Write component-level documentation

## Performance Optimizations

- Image optimization with Next.js Image
- Code splitting with dynamic imports
- Lazy loading for heavy components
- Bundle size optimization
- Font optimization with Google Fonts

## SEO Optimization

- Dynamic meta tags for each page
- Structured data with JSON-LD
- Sitemap generation
- Canonical URLs
- Open Graph tags

## Deployment

### Vercel Deployment

1. Connect repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main branch

### Build Configuration

Next.js configuration in `next.config.ts`:

- Image optimization settings
- Experimental features
- Bundle optimization

## Testing

Recommended testing setup:

- Jest for unit testing
- React Testing Library for component testing
- Cypress for end-to-end testing

## Contributing

1. Follow the existing code style
2. Write tests for new features
3. Update documentation
4. Ensure all tests pass before submitting

## Support

For issues and questions:

- Create an issue in the repository
- Contact the development team
