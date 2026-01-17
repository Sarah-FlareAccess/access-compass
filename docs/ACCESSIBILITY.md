# Accessibility Documentation

## Overview

Access Compass is committed to being accessible to all users, including those who use assistive technologies. This document outlines the accessibility features implemented in the application.

## ARIA Landmarks

The application uses semantic ARIA landmarks to help screen reader users navigate:

| Component | Landmark | Purpose |
|-----------|----------|---------|
| `AppLayout` | `role="main"` | Main content area |
| `NavBar` | `aria-label="Main navigation"` | Primary navigation |
| `Sidebar` | `role="complementary"` | Supplementary content |
| `Dashboard Sidebar` | `role="complementary"` | Dashboard sidebar navigation |

## Keyboard Navigation

### Skip Links
A skip link is provided at the top of every page allowing keyboard users to bypass navigation and jump directly to main content.

```
Press Tab on page load → "Skip to main content" link appears → Press Enter to skip navigation
```

### Focus Management
- All interactive elements are focusable
- Focus indicators are visible (3px solid outline)
- Focus order follows logical reading order

## Heading Hierarchy

All pages maintain proper heading hierarchy without skipping levels:

```
h1 - Page title
  h2 - Section headings
    h3 - Subsection headings
      h4 - Detail headings (if needed)
```

## Images

### Alt Text Guidelines
- **Informative images**: Descriptive alt text explaining the content
- **Decorative images**: Empty alt text (`alt=""`) or `aria-hidden="true"`
- **Functional images**: Alt text describes the action (e.g., "Upload image")

### SVG Icons
Decorative SVG icons use `aria-hidden="true"` to hide them from screen readers.

## Form Controls

- All form inputs have associated labels
- Required fields are indicated
- Error messages are associated with their inputs
- Form validation provides clear feedback

## Color & Contrast

- Text meets WCAG 2.1 AA contrast requirements
- Information is not conveyed by color alone
- Focus states are clearly visible

## Screen Reader Support

The application has been tested with:
- NVDA (Windows)
- VoiceOver (macOS/iOS)

## Testing Checklist

- [ ] All pages can be navigated using keyboard only
- [ ] Skip link works on all pages
- [ ] Heading hierarchy is correct (no skipped levels)
- [ ] All images have appropriate alt text
- [ ] Form inputs have visible labels
- [ ] Error messages are announced by screen readers
- [ ] Focus is managed appropriately in modals
- [ ] Interactive elements have sufficient touch targets (44x44px minimum)

## Known Limitations

- Some third-party components may have limited accessibility
- Complex data visualizations may require additional descriptions

## Reporting Issues

If you encounter any accessibility barriers, please report them via the "Report a Problem" feature in the application or contact support.
