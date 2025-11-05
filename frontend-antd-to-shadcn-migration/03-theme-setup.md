# Theme Setup: Creating a New Design System

## Overview
We're creating a fresh, modern theme using shadcn/ui and Tailwind CSS. This approach allows us to:
- Build a cohesive design system from scratch
- Take advantage of modern design patterns
- Ensure accessibility and consistency
- Create a unique look that fits our brand

## Design Principles

### 1. Minimalist and Clean
- Ample white space
- Clear visual hierarchy
- Subtle shadows and borders
- Focus on content and functionality

### 2. Consistent Spacing
- Use Tailwind's spacing scale consistently
- Maintain rhythm throughout the UI
- Responsive spacing for different screen sizes

### 3. Accessible Color Palette
- Sufficient contrast ratios
- Clear visual feedback
- Semantic color usage (success, warning, error)

### 4. Modern Typography
- Clear hierarchy
- Readable font sizes
- Consistent line heights

## Color Palette Configuration

### Update `globals.css`
```css
@import "tailwindcss";
@import "tw-animate-css";

/* Custom CSS Variables for Design System */
@theme {
  /* Primary Colors - Modern Blue Palette */
  --color-primary: 14 165 233;  /* sky-500 */
  --color-primary-foreground: 255 255 255;
  
  /* Secondary Colors */
  --color-secondary: 241 245 249;  /* slate-100 */
  --color-secondary-foreground: 15 23 42;  /* slate-900 */
  
  /* Accent Colors */
  --color-accent: 99 102 241;  /* indigo-500 */
  --color-accent-foreground: 255 255 255;
  
  /* Neutral Colors */
  --color-muted: 243 244 246;  /* gray-100 */
  --color-muted-foreground: 107 114 128;  /* gray-500 */
  
  /* Background Colors */
  --color-background: 255 255 255;
  --color-foreground: 15 23 42;
  
  /* Border Colors */
  --color-border: 229 231 235;  /* gray-200 */
  --color-input: 255 255 255;
  --color-ring: 14 165 233;  /* sky-500 */
  
  /* Status Colors */
  --color-success: 34 197 94;  /* green-500 */
  --color-warning: 251 146 60;  /* orange-400 */
  --color-error: 239 68 68;  /* red-500 */
  --color-info: 59 130 246;  /* blue-500 */
  
  /* Custom Theme Colors */
  --color-brand: 220 38 38;  /* Keep existing red if needed */
  --color-brand-foreground: 255 255 255;
  
  /* Dark Mode Colors */
  --color-background-dark: 15 23 42;
  --color-foreground-dark: 248 250 252;
  --color-muted-dark: 30 41 59;
  --color-muted-foreground-dark: 148 163 184;
  --color-border-dark: 51 65 85;
}

/* Dark Mode Support */
@media (prefers-color-scheme: dark) {
  :root {
    --color-background: var(--color-background-dark);
    --color-foreground: var(--color-foreground-dark);
    --color-muted: var(--color-muted-dark);
    --color-muted-foreground: var(--color-muted-foreground-dark);
    --color-border: var(--color-border-dark);
    --color-input: var(--color-muted-dark);
  }
}

/* Base Styles */
@layer base {
  * {
    @apply border-border;
  }
  
  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
  
  /* Smooth scrolling */
  html {
    scroll-behavior: smooth;
  }
  
  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  ::-webkit-scrollbar-track {
    @apply bg-muted;
  }
  
  ::-webkit-scrollbar-thumb {
    @apply bg-muted-foreground/30 rounded-md;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    @apply bg-muted-foreground/50;
  }
}

/* Component Customizations */
@layer components {
  /* Button Variants */
  .btn-gradient {
    @apply bg-gradient-to-r from-primary to-accent text-white hover:from-primary/90 hover:to-accent/90;
  }
  
  /* Card Styles */
  .card-elevated {
    @apply shadow-lg hover:shadow-xl transition-shadow duration-300;
  }
  
  /* Form Styles */
  .input-focus {
    @apply focus:ring-2 focus:ring-primary/20 focus:border-primary;
  }
  
  /* Typography */
  .text-gradient {
    @apply bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent;
  }
  
  /* Animation Classes */
  .animate-fade-in {
    animation: fadeIn 0.5s ease-in-out;
  }
  
  .animate-slide-up {
    animation: slideUp 0.3s ease-out;
  }
  
  .animate-scale-in {
    animation: scaleIn 0.2s ease-out;
  }
}

/* Custom Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

/* Utility Classes for New Theme */
@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
  
  /* Hover effects */
  .hover-lift {
    @apply transition-transform duration-200 hover:-translate-y-1;
  }
  
  /* Focus styles */
  .focus-ring {
    @apply focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2;
  }
  
  /* Spacing utilities */
  .space-y-responsive {
    @apply space-y-4 md:space-y-6 lg:space-y-8;
  }
  
  .container-responsive {
    @apply container mx-auto px-4 sm:px-6 lg:px-8;
  }
}
```

## Component Variants Configuration

### Custom Button Variants
Update `/src/components/ui/button.tsx` with additional variants:

```tsx
// Add to buttonVariants in button.tsx
variants: {
  variant: {
    // ... existing variants ...
    gradient: "bg-gradient-to-r from-primary to-accent text-primary-foreground hover:from-primary/90 hover:to-accent/90",
    ghostGradient: "text-transparent bg-gradient-to-r from-primary to-accent bg-clip-text hover:from-primary/80 hover:to-accent/80",
    outlineGradient: "border-2 border-gradient bg-gradient-to-r from-primary/10 to-accent/10 text-foreground hover:from-primary/20 hover:to-accent/20",
  },
  // ... existing size variants
}
```

### Custom Card Variants
Create `/src/components/ui/card-variants.tsx`:

```tsx
import { cva, type VariantProps } from "class-variance-authority";

export const cardVariants = cva(
  "rounded-lg border bg-card text-card-foreground shadow-sm",
  {
    variants: {
      variant: {
        default: "border-border bg-card",
        elevated: "border-border bg-card shadow-lg hover:shadow-xl transition-shadow duration-300",
        outlined: "border-2 border-primary bg-transparent",
        gradient: "border-transparent bg-gradient-to-br from-primary/5 to-accent/5 backdrop-blur-sm",
      },
      padding: {
        none: "p-0",
        sm: "p-4",
        default: "p-6",
        lg: "p-8",
      }
    },
    defaultVariants: {
      variant: "default",
      padding: "default",
    },
  }
);
```

## Typography Scale

### Update Tailwind Config
Extend your Tailwind configuration with custom font sizes:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
      letterSpacing: {
        tighter: '-0.05em',
        tight: '-0.025em',
        normal: '0em',
        wide: '0.025em',
        wider: '0.05em',
        widest: '0.1em',
      }
    }
  }
}
```

## Creating Reusable Layout Patterns

### 1. Page Layout Component
Create `/src/components/layout/page-layout.tsx`:

```tsx
import { cn } from "@/lib/utils";

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
}

export function PageLayout({ 
  children, 
  className, 
  maxWidth = "2xl" 
}: PageLayoutProps) {
  const maxWidthClasses = {
    sm: "max-w-2xl",
    md: "max-w-4xl",
    lg: "max-w-6xl",
    xl: "max-w-7xl",
    "2xl": "max-w-screen-2xl",
    full: "max-w-full"
  };

  return (
    <div className={cn(
      "container mx-auto px-4 sm:px-6 lg:px-8 py-8",
      maxWidthClasses[maxWidth],
      className
    )}>
      {children}
    </div>
  );
}
```

### 2. Section Component
Create `/src/components/layout/section.tsx`:

```tsx
import { cn } from "@/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  spacing?: "sm" | "md" | "lg" | "xl";
  id?: string;
}

export function Section({ 
  children, 
  className, 
  spacing = "md",
  id 
}: SectionProps) {
  const spacingClasses = {
    sm: "py-8",
    md: "py-12",
    lg: "py-16",
    xl: "py-24"
  };

  return (
    <section 
      id={id}
      className={cn(
        spacingClasses[spacing],
        className
      )}
    >
      {children}
    </section>
  );
}
```

## Dark Mode Configuration

### Update `components.json`
Ensure dark mode is configured:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "darkMode": "class"
  }
}
```

### Dark Mode Provider
Update `/src/app/layout.tsx`:

```tsx
"use client";

import { ThemeProvider } from "next-themes";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

## Testing the Theme

### Create a Theme Showcase
Create `/src/components/theme-showcase.tsx`:

```tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ThemeShowcase() {
  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Theme Showcase</h1>
        <p className="text-muted-foreground">Preview all component styles</p>
      </div>
      
      <Tabs defaultValue="colors" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="typography">Typography</TabsTrigger>
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="forms">Forms</TabsTrigger>
        </TabsList>
        
        <TabsContent value="colors" className="space-y-4">
          <h3 className="text-2xl font-semibold">Color Palette</h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="h-20 w-full bg-primary rounded-lg"></div>
              <p className="text-sm">Primary</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 w-full bg-secondary rounded-lg"></div>
              <p className="text-sm">Secondary</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 w-full bg-accent rounded-lg"></div>
              <p className="text-sm">Accent</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 w-full bg-muted rounded-lg"></div>
              <p className="text-sm">Muted</p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="components" className="space-y-4">
          <h3 className="text-2xl font-semibold">Component Styles</h3>
          <div className="flex flex-wrap gap-4">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="gradient">Gradient</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

## What's Next?
After setting up the theme:
1. Test all components with the new theme
2. Verify dark mode functionality
3. Proceed to `04-phase-1-simple-components.md` to start migration
4. Adjust colors and spacing as needed during migration

## Checklist
- [ ] Updated global CSS with new design tokens
- [ ] Added custom component variants
- [ ] Created reusable layout components
- [ ] Configured dark mode
- [ ] Created theme showcase for testing
- [ ] All colors meet accessibility standards
- [ ] Typography scale is consistent
- [ ] Spacing system is implemented
