# Salon Inventory Tracker

## Current State
The app is optimized for mobile with:
- Bottom navigation bar (BottomNav component)
- Narrow `max-w-lg` content width (512px)
- Large touch targets (h-12 inputs)
- Single column layouts throughout
- Mobile-first padding and spacing

## Requested Changes (Diff)

### Add
- Left sidebar navigation for laptop/desktop replacing bottom nav
- Wider content area (max-w-7xl) with proper two/three column layouts
- Sidebar shows app logo, nav links with icons, and current date
- Responsive: sidebar on desktop (lg+), bottom nav on mobile

### Modify
- App.tsx: add sidebar layout wrapper for lg+ screens
- EntryPage: two-column layout on desktop (form left, summary right)
- HistoryPage: filters as collapsible left panel or inline row on desktop
- ManagePage: wider table-style product/staff list with better column usage
- ReportsPage: side-by-side daily/monthly tabs use full width on desktop
- All pages: remove `max-w-lg` constraint, use full available width
- Input heights can be slightly smaller on desktop (h-10 instead of h-12)

### Remove
- Nothing removed, bottom nav kept for mobile

## Implementation Plan
1. Update `App.tsx` to use responsive layout: sidebar on lg+, bottom nav on mobile
2. Create `SideNav` component for desktop sidebar navigation
3. Update `EntryPage` to use two-column grid on lg+ (form + help/summary panel)
4. Update `HistoryPage` to use inline filter row on desktop
5. Update `ManagePage` to use wider list with better spacing
6. Update `ReportsPage` to remove narrow width constraint and use full space
7. Update all page wrappers to remove max-w-lg and use proper responsive padding
