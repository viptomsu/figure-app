# Phase 1: Initial Setup and Component Installation

## Overview
In this phase, we'll install all necessary shadcn/ui components and set up the foundation for our migration.

## Prerequisites
- Node.js installed
- Working Next.js project with TypeScript
- Tailwind CSS already configured

## Step 1: Install Required shadcn/ui Components

### 1.1 Form and Input Components
```bash
npx shadcn@latest add form
npx shadcn@latest add input
npx shadcn@latest add textarea
npx shadcn@latest add label
```

### 1.2 Data Display Components
```bash
npx shadcn@latest add table
npx shadcn@latest add avatar
npx shadcn@latest add badge
```

### 1.3 Navigation Components
```bash
npx shadcn@latest add tabs
npx shadcn@latest add separator
```

### 1.4 Selection Components
```bash
npx shadcn@latest add select
npx shadcn@latest add checkbox
npx shadcn@latest add radio-group
```

### 1.5 Feedback Components
```bash
npx shadcn@latest add toast
npx shadcn@latest add dialog
npx shadcn@latest add alert
```

### 1.6 Layout and Utility Components
```bash
npx shadcn@latest add card
npx shadcn@latest add sheet
npx shadcn@latest add collapsible
```

## Step 2: Install Additional Dependencies

### 2.1 Icons Library
```bash
npm install lucide-react
```

### 2.2 Form Validation (if not already installed)
```bash
npm install @hookform/resolvers
npm install zod  # or yup if you prefer
```

## Step 3: Verify Installation

After installation, verify these components exist in `/src/components/ui/`:
- [ ] button.tsx (should already exist)
- [ ] form.tsx
- [ ] input.tsx
- [ ] textarea.tsx
- [ ] label.tsx
- [ ] table.tsx
- [ ] avatar.tsx
- [ ] badge.tsx
- [ ] tabs.tsx
- [ ] separator.tsx
- [ ] select.tsx
- [ ] checkbox.tsx
- [ ] radio-group.tsx
- [ ] toast.tsx
- [ ] dialog.tsx
- [ ] alert.tsx
- [ ] card.tsx
- [ ] sheet.tsx
- [ ] collapsible.tsx

## Step 4: Update tsconfig.json (if needed)

Ensure your `tsconfig.json` includes the path aliases:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"]
    }
  }
}
```

## Step 5: Create a Test Component

Create a test file to verify all components are working:
```bash
# Create /src/components/test-shadcn.tsx
```

This file will be created in the next phase for testing.

## What's Next?
After completing this setup:
1. Review the component mapping in `02-component-mapping.md`
2. Configure your new theme in `03-theme-setup.md`
3. Start migrating simple components in `04-phase-1-simple-components.md`

## Troubleshooting

### Common Issues
1. **"Module not found" errors**: Run `npm install` after adding components
2. **TypeScript errors**: Make sure all dependencies are installed
3. **Tailwind class not found**: Restart your dev server after adding components

### Tips
- Keep antd installed until all components are migrated
- Test each component individually before proceeding
- Create a dedicated branch for this migration

## Verification Checklist
- [ ] All shadcn/ui components installed successfully
- [ ] lucide-react installed
- [ ] TypeScript configuration updated
- [ ] No errors in npm output
- [ ] Ready to proceed to phase 2
