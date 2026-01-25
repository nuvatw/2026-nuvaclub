# nuvaClub Playbook Documentation

> **Version:** 3.0.0
> **Last Updated:** 2026-01-23
> **Purpose:** Complete user guide for the nuvaClub platform

---

## Overview

This playbook provides comprehensive documentation for all nuvaClub features. Each section is designed to be:

- **Easy to read** - Clear, simple language
- **Fast to understand** - Scannable with TL;DR summaries
- **Actionable** - Every section tells you what to do next

---

## Document Structure

Documents follow the naming convention: `{section}-{subsection}_{feature}_{topic}.md`

### Section Index

| # | Section | Files | Description |
|---|---------|-------|-------------|
| 1 | Quick Start | `1-0_quickstart.md` | Getting started in 5 minutes |
| 2 | What's New | `2-0_whats-new.md` | Latest version updates |
| 3 | Identity | `3-0` to `3-5` | User levels and permissions |
| 4 | Dashboard | `4-0` to `4-6` | Member dashboard features |
| 5 | Learn | `5-0` to `5-3` | Course learning system |
| 6 | Test | `6-0` to `6-3` | Knowledge assessment |
| 7 | Forum | `7-0` to `7-3` | Community discussions |
| 8 | Space | `8-0` to `8-3` | Mentorship matching |
| 9 | Sprint | `9-0` to `9-3` | Project competitions |
| 10 | Shop | `10-0` to `10-3` | Plans, tickets, and merch |
| 11 | FAQ | `11-0_faq.md` | Frequently asked questions |

---

## Navigation Best Practices

### Sidebar Navigation

The playbook uses a sticky sidebar with:
- **Hierarchical structure** - Sections with expandable subsections
- **Active state tracking** - Current section highlighted
- **Smooth scrolling** - Animated scroll to target section
- **Mobile support** - Slide-out drawer on small screens

### Scroll Behavior

- **Offset calculation**: 88px (64px navbar + 24px buffer)
- **Smooth animation**: Native `scroll-behavior: smooth`
- **Intersection Observer**: Tracks active section as user scrolls

### Implementation Details

```typescript
// Scroll offset for fixed navbar
const SCROLL_OFFSET = 88; // navbar (64px) + buffer (24px)

// Scroll to section with proper offset
function scrollToSection(id: string): void {
  const element = document.getElementById(id);
  const offsetPosition = element.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
  window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
}
```

---

## Content Guidelines

### TL;DR Pattern

Every section starts with a quick summary:

```markdown
## TL;DR

**Action 1** → **Action 2** → **Result**

One sentence explaining what this section covers.
```

### Scannable Format

- Bold key terms
- Use tables for comparisons
- Keep paragraphs short (2-3 sentences max)
- Use bullet points for lists

### Visual Hierarchy

1. **H2** - Main section title
2. **H3** - Subsection headers
3. **Bold** - Key concepts
4. **Tables** - Comparisons and data
5. **Code blocks** - Technical examples

---

## File Quick Links

### Getting Started
- [Quick Start](1-0_quickstart.md)
- [What's New](2-0_whats-new.md)

### User System
- [Identity Overview](3-0_identity_overview.md)
- [Dashboard Guide](4-0_dashboard_overview.md)

### Core Features
- [Learn - Courses](5-0_learn_overview.md)
- [Test - Assessments](6-0_test_overview.md)
- [Forum - Community](7-0_forum_overview.md)
- [Space - Mentorship](8-0_space_overview.md)
- [Sprint - Projects](9-0_sprint_overview.md)

### Commerce
- [Shop - Plans & Products](10-0_shop_plans.md)

### Help
- [FAQ](11-0_faq.md)
