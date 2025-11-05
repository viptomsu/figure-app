# Component Mapping: Ant Design to shadcn/ui

## Overview
This document provides a comprehensive mapping of all Ant Design components to their shadcn/ui equivalents or custom solutions.

## Direct Component Replacements

| Ant Design | shadcn/ui | Status | Notes |
|------------|-----------|--------|-------|
| Button | Button | ✅ | Already installed |
| Modal | Dialog | ✅ | Already installed |
| Form | Form | 📦 | Need to install |
| Input | Input | 📦 | Need to install |
| Select | Select | 📦 | Need to install |
| Table | Table | 📦 | Need to install |
| Tag | Badge | 📦 | Need to install |
| Avatar | Avatar | 📦 | Need to install |
| Tabs | Tabs | 📦 | Need to install |
| Divider | Separator | 📦 | Need to install |
| Checkbox | Checkbox | 📦 | Need to install |
| Radio | Radio Group | 📦 | Need to install |
| Card | Card | 📦 | Need to install |
| Drawer | Sheet | 📦 | Need to install |

## Custom Components Required

| Ant Design | Solution | Priority | Implementation Notes |
|------------|----------|----------|---------------------|
| Spin | LoadingSpinner | High | Simple spinner with lucide-react |
| Typography | Native HTML | Medium | Use semantic HTML5 tags with Tailwind |
| Steps | CustomSteps | Medium | Create from scratch with Tailwind |
| Result | ResultTemplate | Medium | Create reusable result templates |
| List | CustomList | Low | Use Card components or simple divs |
| Grid System | Tailwind Grid | High | Replace Row/Col with grid classes |
| Layout | Flexbox/Grid | Medium | Use Tailwind layout utilities |

## Icon Mapping

| Ant Design Icon | Lucide React | Component Usage |
|-----------------|--------------|-----------------|
| MessageOutlined | MessageCircle | Chat button |
| SendOutlined | Send | Chat send button |
| EditOutlined | Edit | Edit actions |
| DeleteOutlined | Trash2 | Delete actions |
| PlusOutlined | Plus | Add actions |
| CloseOutlined | X | Close actions |
| CheckOutlined | Check | Success states |
| WarningOutlined | AlertTriangle | Warning states |
| InfoCircleOutlined | Info | Info states |

## Layout System Migration

### Ant Design Grid → Tailwind CSS Grid

```tsx
// Ant Design
<Row gutter={[16, 16]}>
  <Col span={8}>Content 1</Col>
  <Col span={8}>Content 2</Col>
  <Col span={8}>Content 3</Col>
</Row>

// Tailwind CSS
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  <div>Content 1</div>
  <div>Content 2</div>
  <div>Content 3</div>
</div>
```

### Common Grid Patterns

| Ant Design | Tailwind CSS |
|------------|--------------|
| Col span={24} | col-span-full or w-full |
| Col span={12} | md:col-span-2 (in 6 columns) or md:w-1/2 |
| Col span={8} | md:col-span-4 (in 12 columns) or md:w-1/3 |
| Col span={6} | md:col-span-2 (in 12 columns) or md:w-1/4 |
| gutter={[16, 16]} | gap-4 |

## Styling Differences

### Colors
- **Ant Design**: Uses CSS variables with antd prefix
- **shadcn/ui**: Uses CSS variables with semantic names (primary, secondary, etc.)

### Spacing
- **Ant Design**: Fixed spacing scale (8px, 16px, 24px)
- **shadcn/ui**: Tailwind spacing scale (4px, 8px, 12px, 16px, 20px, 24px)

### Typography
- **Ant Design**: Typography component with predefined styles
- **shadcn/ui**: Semantic HTML tags with Tailwind typography utilities

## Components Requiring Custom Implementation

### 1. Loading Spinner
```tsx
// Simple loading spinner using lucide-react
import { Loader2 } from "lucide-react";

export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8"
  };
  
  return <Loader2 className={`animate-spin ${sizeClasses[size]}`} />;
}
```

### 2. Steps Component
```tsx
// Custom steps implementation
import { Check } from "lucide-react";

interface Step {
  id: string;
  title: string;
  description?: string;
  status: "complete" | "active" | "inactive";
}

export function Steps({ steps, current }: { steps: Step[], current: number }) {
  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div className={`
            w-8 h-8 rounded-full flex items-center justify-center text-sm
            ${step.status === "complete" ? "bg-primary text-primary-foreground" : ""}
            ${step.status === "active" ? "bg-primary text-primary-foreground" : ""}
            ${step.status === "inactive" ? "bg-muted text-muted-foreground" : ""}
          `}>
            {step.status === "complete" ? <Check className="w-4 h-4" /> : index + 1}
          </div>
          {index < steps.length - 1 && (
            <div className={`flex-1 h-px mx-2 ${
              step.status === "complete" ? "bg-primary" : "bg-muted"
            }`} />
          )}
        </div>
      ))}
    </div>
  );
}
```

### 3. Result Template
```tsx
// Reusable result component
import { Button } from "./button";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface ResultProps {
  status: "success" | "error" | "warning" | "info";
  title: string;
  subtitle?: string;
  extra?: React.ReactNode;
}

export function Result({ status, title, subtitle, extra }: ResultProps) {
  const icons = {
    success: <CheckCircle className="w-16 h-16 text-green-500" />,
    error: <XCircle className="w-16 h-16 text-red-500" />,
    warning: <AlertCircle className="w-16 h-16 text-yellow-500" />,
    info: <AlertCircle className="w-16 h-16 text-blue-500" />
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      {icons[status]}
      <h1 className="text-2xl font-bold">{title}</h1>
      {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
      {extra && <div className="pt-4">{extra}</div>}
    </div>
  );
}
```

## Migration Priority

### High Priority (Core Components)
1. Button - Used in 6+ files
2. Input - Form components
3. Modal - Dialog boxes
4. Form - Form validation

### Medium Priority (Frequently Used)
1. Table - Data display
2. Select - Form inputs
3. Tabs - Navigation
4. Avatar - User display

### Low Priority (Specialized)
1. Steps - Checkout process
2. Result - Error/success pages
3. List - Simple lists

## Next Steps
1. Review this mapping to understand replacements needed
2. Proceed to `03-theme-setup.md` to configure the new theme
3. Start with high-priority components in `04-phase-1-simple-components.md`
