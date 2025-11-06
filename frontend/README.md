# Figure Frontend

Next.js 16 TypeScript e-commerce store for the Figure platform.

## Technology Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with ShadCN UI components
- **UI Components**: shadcn/ui (Radix UI primitives)
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form with Yup validation
- **Payment**: PayPal integration
- **Notifications**: React Toastify
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
NEXT_PUBLIC_API_URL=http://localhost:5001
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
│   │   ├── (auth)/         # Authentication pages group
│   │   ├── (shop)/         # Shop pages group
│   │   ├── globals.css     # Global styles
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
│   ├── services/           # API service functions
│   ├── stores/             # Zustand stores
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions
├── components.json         # ShadCN configuration
├── next.config.ts          # Next.js configuration
├── tailwind.config.js      # Tailwind CSS configuration
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

```typescript
// Example service function
export const productService = {
  getProducts: async (params?: ProductParams) => {
    const response = await api.get('/products', { params });
    return response.data;
  },
  
  getProductById: async (id: string) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  }
};
```

## Routing

The app uses Next.js App Router with route groups:

```
/app
├── (auth)/
│   ├── login/
│   └── register/
├── (shop)/
│   ├── products/
│   ├── cart/
│   └── checkout/
├── account/
├── api/                   # API routes
└── globals.css
```

## Styling

### Tailwind CSS
- Primary configuration in `tailwind.config.js`
- Custom colors and spacing defined
- Responsive design utilities

### ShadCN UI
- Pre-built component library
- Located in `src/components/ui/`
- Customizable themes

## Form Handling

Forms use React Hook Form with Yup validation:

```typescript
const {
  register,
  handleSubmit,
  formState: { errors }
} = useForm({
  resolver: yupResolver(loginSchema)
});

const onSubmit = async (data) => {
  // Handle form submission
};
```

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
