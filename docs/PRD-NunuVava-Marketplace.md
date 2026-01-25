# Product Requirements Document (PRD)
# NuvaClub Nunu-Vava Marketplace System

**Version:** 2.0
**Date:** 2026-01-23
**Status:** Implementation Ready

---

## 1. Executive Summary

The NuvaClub Nunu-Vava Marketplace is a time-based mentorship platform connecting mentors (Nunus) with learners (Vavas). Similar to Airbnb's rental model, every Nunu-Vava relationship has a defined time duration, with flexible booking from 1 month to 1 year.

---

## 2. Core Concepts

### 2.1 Terminology
| Term | Definition |
|------|------------|
| **Nunu** | Mentor who guides and teaches Vavas |
| **Vava** | Learner seeking mentorship from a Nunu |
| **Mentorship** | A time-bound 1-to-1 relationship between Nunu and Vava |
| **Matching Board** | Marketplace where Nunus and Vavas post listings |

### 2.2 Nunu Level System
Nunu levels indicate experience and determine capacity:

| Level | Name | Max Vavas | Description |
|-------|------|-----------|-------------|
| **N5** | Beginner | 3 | Entry-level mentor (weakest) |
| **N4** | Intermediate | 5 | Mid-level mentor |
| **N3** | Advanced | 10 | Senior mentor |
| **N2** | Expert | 30 | Expert-level mentor |
| **N1** | Master | 50 | Highest level (strongest) |

### 2.3 Nunu Types
| Type | Description |
|------|-------------|
| **Regular** | Standard Nunu mentor |
| **Verified** | Certified Nunu with verified credentials |

---

## 3. Time Duration System (Airbnb Model)

### 3.1 Duration Rules
- **Minimum:** 1 month
- **Maximum:** 12 months (1 year)
- **Start Date:** Always begins on the 1st day of the next month
- **Format:** YYYY-MM (e.g., "2026-02")

### 3.2 Duration Selection
Users can select consecutive months for their mentorship:

```
Available Durations:
- 1 month:  Feb 2026
- 3 months: Feb - Apr 2026
- 6 months: Feb - Jul 2026
- 12 months: Feb 2026 - Jan 2027
```

### 3.3 Pricing Model
- **Per-Month Pricing:** All prices are monthly (NT$/month)
- **Total Cost:** Monthly Price x Number of Months

---

## 4. Matching Board

### 4.1 Post Types

#### Nunu Looking for Vava
- Nunu posts availability and monthly rate
- Sets available months and capacity
- Price type: Fixed or Negotiable

#### Vava Looking for Nunu
- Vava posts learning needs and budget
- Sets desired months
- Price type: Range (min-max) or Negotiable

### 4.2 Price Structure

| Price Type | Description | Display Format |
|------------|-------------|----------------|
| **Range** | Budget range (Vava posts) | NT$500 - NT$1,000/mo |
| **Fixed** | Set price (Nunu posts) | NT$800/mo |
| **Negotiable** | Open to discussion | Negotiable |

### 4.3 Sorting Options

Posts can be sorted by:

| Sort Option | Description |
|-------------|-------------|
| **Rating (Stars)** | Average rating (1-5 stars) - highest first |
| **Review Count** | Total number of reviews - most first |
| **Nunu Level** | N1 > N2 > N3 > N4 > N5 |
| **Newest** | Most recent posts first |
| **Most Views** | Most viewed posts first |

### 4.4 Filtering Options
- Post type (Nunu/Vava looking)
- Price range
- Available months
- Verified Nunu only
- Tags/Expertise

---

## 5. User Accounts & Mock Data

### 5.1 Account Distribution (20 Users)

| Category | Count | Description |
|----------|-------|-------------|
| **Nunus (Active Mentors)** | 6 | Have approved Nunu profiles |
| **Vavas (Active Learners)** | 8 | Seeking or paired with Nunus |
| **Mixed/New Users** | 6 | Explorers or pending applications |

### 5.2 Mock User Data

#### Nunus (6 users)
| ID | Name | Level | Type | Rating | Vavas | Status |
|----|------|-------|------|--------|-------|--------|
| user-2 | Sarah Lin | N4 | Regular | 4.7 | 3/5 | Active |
| user-4 | Emily Huang | N2 | Verified | 4.9 | 4/30 | Active |
| user-10 | Amy Lin | N1 | Verified | 5.0 | 5/50 | Active |
| user-11 | Ryan Chen | N5 | Regular | 4.2 | 2/3 | Active |
| user-14 | Sophia Wang | N3 | Verified | 4.8 | 6/10 | Active |
| user-18 | Eric Liu | N4 | Regular | 4.5 | 3/5 | Active |

#### Vavas (8 users - some paired)
| ID | Name | Has Nunu | Duration | Monthly Rate |
|----|------|----------|----------|--------------|
| user-1 | Alex Chen | Yes (Sarah) | 3 months | NT$800 |
| user-5 | Kevin Lee | Yes (Emily) | 2 months | NT$2,000 |
| user-6 | Jessica Wu | Yes (Amy) | 6 months | NT$3,500 |
| user-7 | David Zhang | Yes (Ryan) | 1 month | NT$600 |
| user-8 | Lisa Chen | No | - | Looking |
| user-12 | Mia Huang | Yes (Sophia) | 4 months | NT$1,500 |
| user-15 | Noah Lin | No | - | Looking |
| user-17 | Zoe Wu | Yes (Eric) | 3 months | NT$900 |

#### Explorers/New (6 users)
| ID | Name | Status | Notes |
|----|------|--------|-------|
| user-3 | Mike Wang | Explorer | Browsing |
| user-9 | Tom Huang | Pending Nunu | Applied |
| user-13 | Olivia Lee | Explorer | New user |
| user-16 | Ethan Chen | Explorer | Interested in Nunu |
| user-19 | Hannah Zhang | Explorer | New user |
| user-20 | Lucas Wang | Explorer | New user |

### 5.3 Pairing Summary

**Active Pairings (6 pairs):**
1. Sarah Lin (N4) → Alex Chen (3 months: Feb-Apr 2026)
2. Emily Huang (N2) → Kevin Lee (2 months: Feb-Mar 2026)
3. Amy Lin (N1) → Jessica Wu (6 months: Feb-Jul 2026)
4. Ryan Chen (N5) → David Zhang (1 month: Feb 2026)
5. Sophia Wang (N3) → Mia Huang (4 months: Feb-May 2026)
6. Eric Liu (N4) → Zoe Wu (3 months: Feb-Apr 2026)

---

## 6. Matching Board Posts

### 6.1 Nunu Posts (Looking for Vava)

| Author | Title | Price | Available | Slots |
|--------|-------|-------|-----------|-------|
| Sarah Lin (N4) | Automation & Make.com Mentoring | NT$800/mo | Feb-Jun 2026 | 2/5 |
| Emily Huang (N2) | AI Strategy for Business | NT$2,000/mo | Feb-May 2026 | 1/5 |
| Amy Lin (N1) | Master Mentorship Program | NT$3,500/mo | Feb-Apr 2026 | 2/3 |
| Ryan Chen (N5) | Beginner-Friendly Guidance | NT$600/mo | Feb-Mar 2026 | 1/3 |
| Sophia Wang (N3) | Product & AI Integration | NT$1,500/mo | Feb-Jul 2026 | 2/5 |
| Eric Liu (N4) | Full-Stack with AI | NT$900/mo | Feb-May 2026 | 1/4 |

### 6.2 Vava Posts (Looking for Nunu)

| Author | Title | Budget | Duration |
|--------|-------|--------|----------|
| Lisa Chen | Seeking Patient Mentor | NT$500-1,000/mo | 2-3 months |
| Noah Lin | Looking for Verified Nunu | NT$1,500-2,500/mo | 3-6 months |
| Tom Huang | Automation Learning | NT$800-1,200/mo | 2 months |

---

## 7. Technical Implementation

### 7.1 Database Schema Updates

```typescript
// Mentorship Duration
interface MentorshipDuration {
  startMonth: string;      // YYYY-MM format
  endMonth: string;        // YYYY-MM format
  durationMonths: number;  // 1-12
  monthlyPrice: number;    // NT$ per month
  totalPrice: number;      // monthlyPrice * durationMonths
}

// Enhanced Matching Post
interface MatchingPost {
  // ... existing fields
  priceType: 'fixed' | 'range' | 'negotiable';
  priceMin?: number;       // For range type
  priceMax?: number;       // For range type
  priceAmount?: number;    // For fixed type
  availableMonths: string[]; // Available booking months
}
```

### 7.2 Sorting Implementation

```typescript
type SortOption =
  | 'rating'      // By avgRating DESC
  | 'reviews'     // By totalRatings DESC
  | 'level'       // By NunuLevel (N1 > N5)
  | 'newest'      // By createdAt DESC
  | 'views';      // By viewCount DESC

const LEVEL_SORT_ORDER: Record<NunuLevel, number> = {
  'N1': 5,  // Highest
  'N2': 4,
  'N3': 3,
  'N4': 2,
  'N5': 1,  // Lowest
};
```

---

## 8. UI/UX Specifications

### 8.1 Matching Board Card Display

```
┌─────────────────────────────────────────────┐
│ [Avatar] Sarah Lin          ⭐ 4.7 (23)     │
│          N4 • Regular                       │
├─────────────────────────────────────────────┤
│ Automation & Make.com Mentoring             │
│                                             │
│ 💰 NT$800/mo                                │
│ 📅 Feb - Jun 2026 (5 months available)      │
│ 👥 2/5 slots remaining                      │
│                                             │
│ [Automation] [Make.com] [Zapier]            │
└─────────────────────────────────────────────┘
```

### 8.2 Duration Selector

```
┌─────────────────────────────────────────────┐
│ Select Duration                             │
├─────────────────────────────────────────────┤
│ Start Month: [February 2026 ▼]              │
│                                             │
│ Duration:                                   │
│ ○ 1 month  (NT$800)                        │
│ ● 3 months (NT$2,400)                      │
│ ○ 6 months (NT$4,800)                      │
│ ○ 12 months (NT$9,600)                     │
│                                             │
│ End Date: April 2026                        │
│ Total: NT$2,400                             │
└─────────────────────────────────────────────┘
```

### 8.3 Sort Controls

```
Sort by: [Rating ▼] [Reviews ▼] [Level ▼] [Newest ▼]
```

---

## 9. Business Rules

### 9.1 Mentorship Rules
1. Minimum commitment: 1 month
2. Maximum commitment: 12 months
3. Start date always on 1st of next month
4. Nunu cannot exceed max Vava capacity
5. Price is locked at booking time

### 9.2 Level Progression
1. Start at N5 upon approval
2. Level up based on completed mentorships and ratings
3. Higher levels unlock more Vava capacity

### 9.3 Payment
1. Full payment required at booking
2. Pro-rated refunds available (policy TBD)
3. Currency: TWD (NT$)

---

## 10. Success Metrics

| Metric | Target |
|--------|--------|
| Average pairing duration | 3+ months |
| Nunu capacity utilization | 60%+ |
| Average rating | 4.5+ stars |
| Repeat bookings | 30%+ |

---

## Appendix A: Full User List

| ID | Name | Type | Level | Status |
|----|------|------|-------|--------|
| user-1 | Alex Chen | Vava | - | Paired |
| user-2 | Sarah Lin | Nunu | N4 | Active |
| user-3 | Mike Wang | Explorer | - | Browsing |
| user-4 | Emily Huang | Nunu | N2 | Active |
| user-5 | Kevin Lee | Vava | - | Paired |
| user-6 | Jessica Wu | Vava | - | Paired |
| user-7 | David Zhang | Vava | - | Paired |
| user-8 | Lisa Chen | Vava | - | Looking |
| user-9 | Tom Huang | Pending | - | Applied |
| user-10 | Amy Lin | Nunu | N1 | Active |
| user-11 | Ryan Chen | Nunu | N5 | Active |
| user-12 | Mia Huang | Vava | - | Paired |
| user-13 | Olivia Lee | Explorer | - | New |
| user-14 | Sophia Wang | Nunu | N3 | Active |
| user-15 | Noah Lin | Vava | - | Looking |
| user-16 | Ethan Chen | Explorer | - | Interested |
| user-17 | Zoe Wu | Vava | - | Paired |
| user-18 | Eric Liu | Nunu | N4 | Active |
| user-19 | Hannah Zhang | Explorer | - | New |
| user-20 | Lucas Wang | Explorer | - | New |
