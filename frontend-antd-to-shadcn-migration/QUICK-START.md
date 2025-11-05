# Quick Start Guide

## 🚀 Ready to Migrate?

Follow this quick path to migrate from Ant Design to shadcn/ui:

### 1. Install Dependencies (10 minutes)
```bash
# Navigate to frontend directory
cd frontend

# Install all shadcn/ui components at once
npx shadcn@latest add button form input textarea label table avatar badge tabs separator select checkbox radio-group toast dialog alert card sheet

# Install additional dependencies
npm install lucide-react @hookform/resolvers zod
```

### 2. Run the Migration (15 minutes)
Follow the numbered guides in order:

1. **Setup Components** → `01-setup.md`
2. **Review Mappings** → `02-component-mapping.md`
3. **Configure Theme** → `03-theme-setup.md`
4. **Migrate Simple Components** → `04-phase-1-simple-components.md`
5. **Migrate Forms & Dialogs** → `05-phase-2-medium-components.md`
6. **Migrate Complex Components** → `06-phase-3-complex-components.md`
7. **Migrate Icons** → `07-icon-migration.md`
8. **Cleanup** → `08-cleanup-and-testing.md`

### 3. Test Everything (5 minutes)
```bash
npm run build
npm run dev
```

### 4. Remove Ant Design (2 minutes)
```bash
npm uninstall antd @ant-design/icons
```

## 🎯 Priority Files to Update

Start with these high-impact files:
1. `/src/app/page.tsx` - Chat button
2. `/src/components/Checkout/ShippingInfo/ShippingInfo.tsx` - Buttons
3. `/src/components/Home/Chat/ChatBox.tsx` - Input, Button, Icons
4. `/src/components/Profile/ProfileSection.tsx` - Tabs
5. `/src/components/History/HistorySection.tsx` - Table, Avatar, Badge
6. `/src/app/checkout/page.tsx` - Steps, Grid layout

## ⚡ Quick Wins

### Replace Button (Most Used)
```tsx
// Before
import { Button } from 'antd';
<Button type="primary" onClick={handleClick}>Click me</Button>

// After
import { Button } from '@/components/ui/button';
<Button onClick={handleClick}>Click me</Button>
```

### Replace Icons
```tsx
// Before
import { MessageOutlined } from '@ant-design/icons';
<MessageOutlined size={25} />

// After
import { MessageCircle } from 'lucide-react';
<MessageCircle className="w-6 h-6" />
```

### Replace Grid Layout
```tsx
// Before
<Row gutter={[16, 16]}>
  <Col span={12}>Content</Col>
  <Col span={12}>Content</Col>
</Row>

// After
<div className="grid grid-cols-2 gap-4">
  <div>Content</div>
  <div>Content</div>
</div>
```

## 🎨 New Theme Preview

The new theme will have:
- Modern, clean design
- Consistent spacing (4px, 8px, 16px, 24px, 32px)
- Better color contrast
- Smooth animations
- Mobile-first responsive design
- Dark mode support

## 📋 Migration Checklist

- [ ] Run `01-setup.md` to install components
- [ ] Update `globals.css` with new theme
- [ ] Migrate all buttons first (most used)
- [ ] Migrate icons next (visual impact)
- [ ] Migrate forms and dialogs
- [ ] Migrate tables and data display
- [ ] Test in development
- [ ] Remove antd dependencies
- [ ] Test production build

## 🚨 Common Issues

**"Component not found" error**
→ Make sure you installed the component: `npx shadcn@latest add [component-name]`

**Styles not applying**
→ Restart your dev server after updating globals.css

**TypeScript errors**
→ Run `npm install` to ensure all dependencies are installed

## 💡 Pro Tips

1. **Don't try to match old styles exactly** - embrace the new modern look
2. **Test each component individually** before moving to the next
3. **Use the test components** provided in each phase
4. **Keep antd installed until** all replacements are tested
5. **Use git commits** after each phase to track progress

## 🆘 Need Help?

- Check the detailed guides in each numbered file
- Refer to [shadcn/ui documentation](https://ui.shadcn.com/)
- Check [Tailwind CSS documentation](https://tailwindcss.com/docs)
- Review the component mapping in `02-component-mapping.md`

## 🎉 After Migration

You'll have:
- ✅ Modern UI components
- ✅ Better performance
- ✅ Improved accessibility
- ✅ TypeScript-first development
- ✅ Flexible styling with Tailwind CSS

---

**Estimated total time: 1-2 hours**

Good luck with your migration! 🚀
