# Figure Admin Panel

React 16 admin dashboard for managing the Figure e-commerce platform.

## Technology Stack

- **Framework**: React 16.12
- **Language**: JavaScript (ES6+)
- **UI Library**: Ant Design 4
- **State Management**: Redux with Redux Saga
- **Routing**: React Router v5
- **Charts**: Chart.js, ApexCharts
- **Rich Text**: TinyMCE, React Quill
- **Real-time**: WebSocket support with SockJS
- **HTTP Client**: Axios
- **Build Tool**: Create React App (react-scripts)

## Prerequisites

- Node.js 14+ installed
- Backend API server running

## Installation

```bash
cd admin
npm install
```

## Environment Configuration

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:5001
REACT_APP_VERSION=1.1.3
```

## Development

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Eject (one-time operation)
npm run eject
```

## Project Structure

```
admin/
├── public/                 # Static assets
│   ├── index.html         # HTML template
│   └── favicon.ico        # Favicon
├── src/
│   ├── assets/            # Static resources (images, fonts)
│   ├── auth/              # Authentication components
│   ├── components/        # Reusable UI components
│   │   ├── layout-components/  # Layout related components
│   │   └── ...            # Other component groups
│   ├── configs/           # Configuration files
│   ├── constants/         # Application constants
│   ├── hook/              # Custom hooks
│   ├── lang/              # Internationalization files
│   ├── layouts/           # Page layouts
│   ├── redux/             # Redux store configuration
│   │   ├── actions/       # Redux actions
│   │   ├── reducers/      # Redux reducers
│   │   └── sagas/         # Redux sagas
│   ├── services/          # API service functions
│   ├── utils/             # Utility functions
│   ├── views/             # Page components
│   │   ├── app-views/     # Main application pages
│   │   └── auth-views/    # Authentication pages
│   ├── App.js             # Main App component
│   ├── index.js           # Application entry point
│   └── index.scss         # Global styles
├── jsconfig.json          # JavaScript configuration
└── package.json
```

## Key Features

### Dashboard
- Overview statistics and KPIs
- Revenue charts and analytics
- Recent orders and activities
- Product performance metrics
- User engagement statistics

### Product Management
- Create, edit, and delete products
- Product variations and inventory management
- Bulk product operations
- Product image upload and management
- Product category and brand assignment

### Order Management
- View and process orders
- Update order status
- Order filtering and search
- Order details and history
- Shipping and tracking management

### User Management
- View and manage users
- User role assignments
- Account status management
- User activity tracking

### Content Management
- Banner and promotion management
- News and announcements
- Page content editing with rich text editor
- Media library management

### Analytics
- Sales reports and charts
- Product performance analytics
- Customer behavior insights
- Revenue tracking

## Authentication System

The admin panel uses JWT-based authentication:

```javascript
// Login action
export const login = (user) => ({
  type: LOGIN,
  user
});

// Check authentication
export const authenticated = () => ({
  type: AUTHENTICATED
});
```

## Redux Store Structure

### State Shape
```javascript
{
  auth: {
    token: null,
    loading: false,
    redirect: null
  },
  theme: {
    currentTheme: THEME_CONFIG.LIGHT,
    direction: 'ltr'
  },
  // ... other state slices
}
```

### Main Reducers
- `auth`: Authentication state
- `theme`: UI theme settings
- `product`: Product data
- `order`: Order data
- `user`: User data

## Component Architecture

### Layout Components
- `AppLayout`: Main application layout
- `TopNav`: Top navigation bar
- `MenuNav`: Side navigation menu
- `Header`: Page header component
- `Footer`: Page footer component

### Page Components
Pages are organized under `src/views/`:
- `dashboard-views/`: Dashboard pages
- `app-views/`: Main application pages
- `auth-views/`: Authentication pages

### Common Components
- `Charts/`: Chart components (Chart.js, ApexCharts)
- `layout-components/`: Layout related components
- `utils/`: Utility components

## Navigation & Routing

The app uses React Router v5 for navigation:

```javascript
// Example route configuration
<Switch>
  <Route path="/login" component={Login} />
  <ProtectedRoute path="/dashboard" component={Dashboard} />
  <ProtectedRoute path="/products" component={Products} />
  <ProtectedRoute path="/orders" component={Orders} />
  {/* ... other routes */}
</Switch>
```

## API Integration

API calls are handled through Redux Sagas:

```javascript
// Example saga
function* fetchProducts() {
  try {
    const response = yield call(Api.getProducts);
    yield put(fetchProductsSuccess(response.data));
  } catch (error) {
    yield put(fetchProductsError(error.message));
  }
}
```

## Forms & Validation

Forms use Ant Design Form components:
- Built-in validation rules
- Custom validation functions
- Form submission handling

## Data Display

### Tables
Ant Design Table components for data display:
- Sorting and filtering
- Pagination
- Custom cell renderers
- Row selection

### Charts
- Line charts for trends
- Bar charts for comparisons
- Pie charts for distributions
- Custom chart configurations

## Internationalization

The app supports multiple languages:
- Language files in `src/lang/`
- Dynamic language switching
- Translation keys management

## Development Guidelines

1. Use functional components with hooks where applicable
2. Follow Redux best practices for state management
3. Implement proper error handling in sagas
4. Use Ant Design components consistently
5. Write component-level documentation
6. Follow consistent naming conventions
7. Implement loading states for async operations

## Customization

### Theme Customization
Update theme settings in `src/config/theme.js`:
- Primary colors
- Typography settings
- Component customizations

### Component Customization
- Extend Ant Design components
- Create custom styled components
- Maintain consistent design language

## Performance Optimization

- Code splitting with React.lazy
- Component memoization with React.memo
- Bundle size optimization
- Image optimization
- Lazy loading for heavy components

## Deployment

### Build Process
```bash
# Create production build
npm run build

# The build files will be in /build directory
```

### Environment Variables
Set production environment variables:
- API endpoint URL
- Application version
- Feature flags

## Testing

The app includes basic test setup with Create React App:
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Generate coverage report
npm test -- --coverage
```

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- IE 11 (limited support)

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
