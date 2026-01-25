# nuvaClub Frontend Playbook
## Table of Contents (Storybook-Style Outline)

> **Version:** Draft 1.0
> **Purpose:** A narrative-driven guide to the nuvaClub UI/UX codebase
> **Format:** Chapters tell stories; sections reveal scenes; Easter eggs spark joy

---

# PROLOGUE: Welcome to the Club

## P.1 The nuvaClub Universe
- P.1.1 What Is nuvaClub? (AI learning ecosystem overview)
- P.1.2 The Cast of Characters (Users, Nunus, Vavas, Explorers, Voyagers)
- P.1.3 The Five Pillars (Learn, Test, Forum, Space, Sprint)
- P.1.4 The Journey Metaphor (Explorer -> Traveler -> Voyager)

## P.2 How to Read This Playbook
- P.2.1 Chapter Structure Explained
- P.2.2 Finding What You Need (Index by Feature, by File, by Pattern)
- P.2.3 Easter Egg Legend (Icons and their meanings)

---

# PART I: ARCHITECTURE & FOUNDATIONS

## Chapter 1: The Blueprint (Project Architecture)

### 1.1 The Big Picture
- 1.1.1 Next.js 15 App Router: Why We Chose It
- 1.1.2 The `(public)` Route Group Pattern
- 1.1.3 Directory Anatomy: `/src` at a Glance
- 1.1.4 [Easter Egg] The Hidden `/checkout-demo` Route

### 1.2 The Feature-First Philosophy
- 1.2.1 `/features/*` — Domain-Driven Modules
- 1.2.2 Feature Anatomy: `components/`, `hooks/`, `data/`, `types/`
- 1.2.3 When to Create a New Feature vs. Extend
- 1.2.4 [Easter Egg] The "Shared" Feature: Cross-Cutting Concerns

### 1.3 Component Hierarchy
- 1.3.1 Atoms: The Indivisible UI Building Blocks
- 1.3.2 Molecules: Compositions That Do One Thing Well
- 1.3.3 Organisms: Complex, Feature-Rich Assemblies
- 1.3.4 Skeletons: The Art of Perceived Performance
- 1.3.5 [Mini Story] "The Skeleton Optimization Saga"

### 1.4 The Mock Data Strategy
- 1.4.1 `/mocks/*` — A Local Database in Disguise
- 1.4.2 Entity Mocks vs. Config Mocks vs. User-State Mocks
- 1.4.3 The Seed Pattern: Predictable Testing Data
- 1.4.4 [Tip] Switching Between Mock and Real APIs

---

## Chapter 2: The Design System (Visual Language)

### 2.1 Tailwind CSS 4: The Styling Engine
- 2.1.1 Why Tailwind 4? (New Features, Performance)
- 2.1.2 Custom Color Palette: `primary`, `accent`, `neutral`
- 2.1.3 The `cn()` Utility: Class Merging Made Safe
- 2.1.4 [Easter Egg] Shop Page's Custom CSS Variables

### 2.2 Motion & Animation
- 2.2.1 Framer Motion Basics in nuvaClub
- 2.2.2 Page Transitions: `PageTransition` Component
- 2.2.3 Scroll-Triggered Animations with `whileInView`
- 2.2.4 [Mini Story] "The Netflix Row Animation Journey"

### 2.3 Dark Mode by Default
- 2.3.1 The `neutral-950` Foundation
- 2.3.2 Gradient Overlays and Visual Depth
- 2.3.3 Text Hierarchy: Primary, Secondary, Muted
- 2.3.4 [Tip] Maintaining Contrast in Dark UI

### 2.4 Responsive Design Patterns
- 2.4.1 Mobile-First Breakpoints
- 2.4.2 Navbar Mobile Menu: The Slide-Down Pattern
- 2.4.3 Grid Layouts That Adapt Gracefully
- 2.4.4 [Easter Egg] The `hidden md:flex` Trick

---

## Chapter 3: State & Data Flow (The Nervous System)

### 3.1 Authentication Architecture
- 3.1.1 The `AuthProvider` Context
- 3.1.2 Identity Types: From Guest to Duo Fly
- 3.1.3 The `useAuth()` Hook: Your Gateway to User State
- 3.1.4 [Mini Story] "The Identity Switcher: Testing Made Easy"

### 3.2 Permission-Based UI
- 3.2.1 The `Gate` Component: Declarative Access Control
- 3.2.2 Permission Matrix: Who Can Do What
- 3.2.3 `hasPermission()`, `hasAnyPermission()`, `hasAllPermissions()`
- 3.2.4 [Tip] Graceful Degradation for Unprivileged Users

### 3.3 Cart & Checkout State
- 3.3.1 The `CartProvider` and `useCart()` Hook
- 3.3.2 Cart Item Structure and Lifecycle
- 3.3.3 The `CheckoutProvider`: Multi-Step Form State
- 3.3.4 [Easter Egg] The Duo Entitlement Grant on Purchase

### 3.4 Progress Tracking
- 3.4.1 The `useProgress()` Hook System
- 3.4.2 Video Progress: Resume Where You Left Off
- 3.4.3 Test Progress: Levels, Scores, Attempts
- 3.4.4 [Mini Story] "Building the Resume Playback Feature"

---

# PART II: THE SIX KINGDOMS (Feature Deep-Dives)

## Chapter 4: The Landing Experience (Home Page)

### 4.1 First Impressions
- 4.1.1 The Hero Section: Video Background Magic
- 4.1.2 Stats Row: Social Proof in Motion
- 4.1.3 [Easter Egg] The Scroll Indicator Animation

### 4.2 The Persuasion Pattern
- 4.2.1 Problem Section: "Sound Familiar?" (Pain Points)
- 4.2.2 Solution Section: The Five Pillars Reveal
- 4.2.3 Course Preview: Netflix-Style Teasers
- 4.2.4 [Tip] Writing High-Converting Section Headings

### 4.3 Trust Builders
- 4.3.1 Mentorship Section: The Nunu Concept Introduction
- 4.3.2 Testimonials Carousel
- 4.3.3 Pricing Tiers: Transparent and Tiered
- 4.3.4 [Mini Story] "The Pricing Section A/B Test"

### 4.4 The Final CTA
- 4.4.1 Urgency Copy: "AI Won't Wait. Will You?"
- 4.4.2 Call-to-Action Button Design
- 4.4.3 [Easter Egg] The Trust Badges Pattern

---

## Chapter 5: Learn Kingdom (Course Platform)

### 5.1 The Learn Page Architecture
- 5.1.1 `VideoHero`: The Flagship Course Showcase
- 5.1.2 Progressive Row Loader: Performance Optimization
- 5.1.3 The `HoverPreviewProvider`: Desktop Discovery UX
- 5.1.4 [Mini Story] "Achieving Netflix-Level Polish"

### 5.2 Course Data Model
- 5.2.1 Course Types: `Course`, `Chapter`, `Lesson`
- 5.2.2 Access Levels: Free, Premium, Voyager-Only
- 5.2.3 The `getAllLessons()` Utility
- 5.2.4 [Tip] Adding a New Course to the Catalog

### 5.3 The Video Player Experience
- 5.3.1 `VideoPlayer` Component Deep-Dive
- 5.3.2 Chapter Navigation: Sidebar Episode Drawer
- 5.3.3 Progress Callbacks and Auto-Save
- 5.3.4 [Easter Egg] The YouTube Embed Optimization

### 5.4 Course Discovery
- 5.4.1 Search with Animated Search Icon
- 5.4.2 Course Rows and Horizontal Scrolling
- 5.4.3 The `LearnHoverPreview` Panel
- 5.4.4 [Mini Story] "The Hover Preview Scroll-Pin Fix"

### 5.5 Course Detail Page
- 5.5.1 Dynamic Route: `/learn/[courseId]`
- 5.5.2 Course Header and Instructor Info
- 5.5.3 Chapter List with Lesson Previews
- 5.5.4 [Tip] SEO Considerations for Course Pages

---

## Chapter 6: Test Kingdom (Assessment System)

### 6.1 The Three Tracks
- 6.1.1 AI Skills Track: Levels 1-12
- 6.1.2 Nunu Certification Track: N5 to N1
- 6.1.3 Vava Learning Path: Guided Journey
- 6.1.4 [Easter Egg] The Verified Nunu Exam Lock

### 6.2 Level System Deep-Dive
- 6.2.1 `LEVEL_CONFIGS` and `LEVEL_DETAILS`
- 6.2.2 Level Colors and Tier Groupings
- 6.2.3 The Progress Bar Component
- 6.2.4 [Mini Story] "Designing the Level-Color Palette"

### 6.3 The Exam Experience
- 6.3.1 `/test/[level]/exam` — The Exam Room
- 6.3.2 Question Types: Multiple Choice, True/False, Fill-in
- 6.3.3 Timer Management and Auto-Submit
- 6.3.4 [Tip] Handling Browser Refresh During Exams

### 6.4 Results and Progression
- 6.4.1 `/test/results/[sessionId]` — Score Reveal
- 6.4.2 Pass/Fail Logic: 60% Threshold
- 6.4.3 Retry Mechanics and Best Score Tracking
- 6.4.4 [Easter Egg] The Confetti Animation on Pass

### 6.5 Course-Level Sync
- 6.5.1 Auto-Filter Courses by Selected Level
- 6.5.2 `CourseListCard` with Status Badges
- 6.5.3 Status Tabs: Not Started, Ongoing, Completed
- 6.5.4 [Mini Story] "The Level-Course Sync Eureka Moment"

---

## Chapter 7: Forum Kingdom (Community Discussions)

### 7.1 Reddit-Inspired Architecture
- 7.1.1 Design Tokens: The `REDDIT_COLORS` Object
- 7.1.2 Three-Column Layout Strategy
- 7.1.3 [Easter Egg] The Exact Reddit Color Codes

### 7.2 The Feed Experience
- 7.2.1 `FeedToolbar`: Sort, Filter, Search
- 7.2.2 `RedditPostCard`: Anatomy of a Post
- 7.2.3 Vote Column: Upvote/Downvote UX
- 7.2.4 [Tip] Optimizing Post Cards for Mobile

### 7.3 Post Interactions
- 7.3.1 Category Badges and Color Mapping
- 7.3.2 Bookmark and Share Actions
- 7.3.3 The Contributors Leaderboard Sidebar
- 7.3.4 [Mini Story] "Building the Share with Clipboard API"

### 7.4 Post Creation Flow
- 7.4.1 `/forum/new` — The New Post Page
- 7.4.2 Permission Gate: Who Can Post?
- 7.4.3 Markdown Support in Posts
- 7.4.4 [Easter Egg] The "First Post" Encouragement

### 7.5 Post Detail View
- 7.5.1 `/forum/[postId]` — Full Post with Comments
- 7.5.2 Comment Thread Rendering
- 7.5.3 Reply Nesting and Collapse
- 7.5.4 [Tip] Comment Performance for Long Threads

---

## Chapter 8: Space Kingdom (Mentorship Marketplace)

### 8.1 The Nunu-Vava Ecosystem
- 8.1.1 Understanding Nunus: Mentors with Levels
- 8.1.2 Understanding Vavas: Learners Seeking Guidance
- 8.1.3 The Matching Board Concept
- 8.1.4 [Mini Story] "Naming Nunu and Vava"

### 8.2 My Space Sections
- 8.2.1 `MyNunuSection`: For Mentors
- 8.2.2 `MyVavaSection`: For Learners
- 8.2.3 Locked Sections for Guests
- 8.2.4 [Tip] Progressive Disclosure for Non-Members

### 8.3 The Matching Board
- 8.3.1 Post Types: Nunu-Looking-for-Vava vs. Vava-Looking-for-Nunu
- 8.3.2 Pricing Models: Fixed, Range, Negotiable
- 8.3.3 Available Months Selection
- 8.3.4 [Easter Egg] The "Slots Full" Visual

### 8.4 Matching Post Cards
- 8.4.1 `MatchingPostCard` Component
- 8.4.2 Author Badge: Nunu Level Display
- 8.4.3 Post Detail Modal
- 8.4.4 [Mini Story] "The Pricing Display Iteration"

### 8.5 Nunu Profiles and Levels
- 8.5.1 N5 to N1: The Nunu Hierarchy
- 8.5.2 Max Vavas by Level
- 8.5.3 Verified vs. Regular Nunu
- 8.5.4 [Easter Egg] The Founder "Shangzhe" Role

---

## Chapter 9: Sprint Kingdom (Project Showcase)

### 9.1 Season and Sprint Structure
- 9.1.1 Seasons: Time-Bounded Periods
- 9.1.2 Sprints: Themed Challenges Within Seasons
- 9.1.3 Projects: User Submissions
- 9.1.4 [Mini Story] "The Season Naming Convention"

### 9.2 Current Sprint Section
- 9.2.1 Active Season Detection
- 9.2.2 Sprint Cards with Thumbnails
- 9.2.3 Voting Open Badge
- 9.2.4 [Tip] Promoting Featured Sprints

### 9.3 Project Library
- 9.3.1 Archive View: Past Season Projects
- 9.3.2 `SprintFilters`: Season, Sprint, Sort
- 9.3.3 `SprintWorkCard` Component
- 9.3.4 [Easter Egg] The "Most Starred" Sort

### 9.4 Project Detail
- 9.4.1 `/sprint/project/[projectId]`
- 9.4.2 Star Count and View Count
- 9.4.3 Author Attribution
- 9.4.4 [Mini Story] "Adding the View Counter"

### 9.5 Sprint Detail
- 9.5.1 `/sprint/[seasonId]/[sprintId]`
- 9.5.2 Project Grid Within Sprint
- 9.5.3 Voting Mechanics (Future)
- 9.5.4 [Tip] Designing for Sprint Scalability

---

## Chapter 10: Shop Kingdom (Commerce Hub)

### 10.1 Category-Based Navigation
- 10.1.1 The Four Categories: Plan, Duo, Event, Merchandise
- 10.1.2 `CategoryPill` Selection Pattern
- 10.1.3 Dynamic Product Filtering
- 10.1.4 [Easter Egg] The Shop-Specific CSS Variables

### 10.2 Plan Comparison
- 10.2.1 `PlanComparisonSection` Component
- 10.2.2 Explorer, Traveler, Voyager, Enterprise
- 10.2.3 Feature Comparison Table
- 10.2.4 [Mini Story] "The Yearly 10+2 Offer Display"

### 10.3 Duo Tickets
- 10.3.1 Go, Run, Fly Tiers
- 10.3.2 Nunu Access by Tier
- 10.3.3 [Tip] Explaining Duo Value Proposition

### 10.4 Events and Merchandise
- 10.4.1 Event Cards: Online vs. In-Person
- 10.4.2 Event Sort: Hot vs. Time
- 10.4.3 Merchandise with Price Sorting
- 10.4.4 [Easter Egg] The Event Type Filter Logic

### 10.5 Product Information
- 10.5.1 Category Introductions
- 10.5.2 FAQ Accordion Pattern
- 10.5.3 [Tip] Writing Effective FAQ Content

---

## Chapter 11: Checkout Kingdom (Purchase Flow)

### 11.1 Cart System
- 11.1.1 `CartDrawer`: The Slide-Out Cart
- 11.1.2 `CartItem` Component
- 11.1.3 Cart Badge on Navbar
- 11.1.4 [Mini Story] "The Cart Animation Polish"

### 11.2 Multi-Step Checkout
- 11.2.1 `CheckoutProvider` Context
- 11.2.2 Step Navigation: Dynamic Based on Cart Contents
- 11.2.3 The `Stepper` Component
- 11.2.4 [Easter Egg] Cart-Type-Aware Step Sequences

### 11.3 Checkout Steps
- 11.3.1 `ConfirmCartStep`: Review Items
- 11.3.2 `PurchaserInfoStep`: Billing Details
- 11.3.3 `PaymentInfoStep`: Payment Method
- 11.3.4 `DeliveryInfoStep`: For Physical Goods
- 11.3.5 [Tip] Validation Patterns Across Steps

### 11.4 Order Completion
- 11.4.1 `ReviewStep`: Final Confirmation
- 11.4.2 Order Success Screen
- 11.4.3 Duo Entitlement Grant on Purchase
- 11.4.4 [Mini Story] "The Order Number Generation"

---

# PART III: SUPPORTING SYSTEMS

## Chapter 12: Navigation & Layout

### 12.1 The Navbar Experience
- 12.1.1 Fixed Navbar with Blur Background
- 12.1.2 Active Route Underline Animation
- 12.1.3 User Area: Avatar, Cart, Notifications
- 12.1.4 [Easter Egg] The MissionPanel Integration

### 12.2 Mobile Navigation
- 12.2.1 Hamburger Menu Toggle
- 12.2.2 Slide-Down Mobile Menu
- 12.2.3 Mobile User Profile Card
- 12.2.4 [Tip] Mobile-First Nav Testing

### 12.3 Footer
- 12.3.1 Link Sections Layout
- 12.3.2 Social Media Links
- 12.3.3 [Mini Story] "The Footer Redesign"

### 12.4 Page Transitions
- 12.4.1 `PageTransition` Component
- 12.4.2 Skeleton-First Loading
- 12.4.3 Minimum Load Time Pattern
- 12.4.4 [Easter Egg] The 150ms Threshold

---

## Chapter 13: Member Dashboard

### 13.1 Member Layout
- 13.1.1 `/member` Route Group
- 13.1.2 Sidebar Navigation
- 13.1.3 [Tip] Dashboard Permission Checks

### 13.2 Profile Section
- 13.2.1 `/member/profile` — User Info Display
- 13.2.2 Avatar and Identity Badge
- 13.2.3 Membership Details Card
- 13.2.4 [Easter Egg] The Feature List by Identity

### 13.3 My Courses
- 13.3.1 `/member/courses` — Enrolled Courses
- 13.3.2 Progress Indicators
- 13.3.3 Continue Watching CTA
- 13.3.4 [Mini Story] "Course Progress Visualization"

### 13.4 Favorites and Settings
- 13.4.1 `/member/favorites` — Bookmarked Content
- 13.4.2 `/member/settings` — Account Configuration
- 13.4.3 [Tip] Settings Form Patterns

---

## Chapter 14: The Playbook/Document System

### 14.1 Versioned Documentation
- 14.1.1 Version Selector Component
- 14.1.2 `getPlaybookVersion()` Utility
- 14.1.3 Changelog and Updates Display
- 14.1.4 [Easter Egg] The "Latest" Badge Logic

### 14.2 Table of Contents
- 14.2.1 `PlaybookSidebar` with Active Tracking
- 14.2.2 Intersection Observer for Active Section
- 14.2.3 Smooth Scroll Behavior
- 14.2.4 [Mini Story] "The TOC Active State Challenge"

### 14.3 Content Rendering
- 14.3.1 `MarkdownContent` Component
- 14.3.2 Identity Cards and Tables
- 14.3.3 FAQ Accordion
- 14.3.4 [Tip] Writing Playbook Content

---

## Chapter 15: Notifications & Missions

### 15.1 Notification System
- 15.1.1 `NotificationBell` Component
- 15.1.2 Notification Dropdown
- 15.1.3 [Easter Egg] The Unread Count Badge

### 15.2 Mission System
- 15.2.1 `MissionPanel` Component
- 15.2.2 Daily Missions Concept
- 15.2.3 Mission Progress Tracking
- 15.2.4 [Mini Story] "The Gamification Vision"

---

# PART IV: PATTERNS & BEST PRACTICES

## Chapter 16: Common UI Patterns

### 16.1 Loading States
- 16.1.1 Skeleton Components Library
- 16.1.2 `isLoading` State Handling
- 16.1.3 Progressive Content Reveal
- 16.1.4 [Tip] Avoiding Layout Shift

### 16.2 Empty States
- 16.2.1 The Empty Icon + Message Pattern
- 16.2.2 Contextual CTAs in Empty States
- 16.2.3 [Mini Story] "Making Empty States Helpful"

### 16.3 Error States
- 16.3.1 Error Boundary Patterns
- 16.3.2 Inline Error Messages
- 16.3.3 [Easter Egg] The Friendly Error Copy

### 16.4 Forms and Validation
- 16.4.1 Input Component Patterns
- 16.4.2 Real-Time vs. Submit Validation
- 16.4.3 [Tip] Accessible Form Labels

---

## Chapter 17: Performance Patterns

### 17.1 Media Preloading
- 17.1.1 `useMediaPreloadGate` Hook
- 17.1.2 Hero Video Preloading
- 17.1.3 Thumbnail Preloading Strategy
- 17.1.4 [Mini Story] "The LCP Optimization Journey"

### 17.2 Progressive Loading
- 17.2.1 `useProgressiveRowLoader` Hook
- 17.2.2 Row-by-Row Content Reveal
- 17.2.3 [Tip] Balancing Speed vs. Smoothness

### 17.3 Code Organization
- 17.3.1 Barrel Exports (`index.ts` Pattern)
- 17.3.2 Type-First Development
- 17.3.3 [Easter Egg] The Circular Import Guard

---

## Chapter 18: Testing & Development

### 18.1 The Identity Switcher
- 18.1.1 `IdentitySwitcher` Component
- 18.1.2 Quick Identity Toggle for Testing
- 18.1.3 [Tip] Testing Permission-Gated Features

### 18.2 Mock Data Development
- 18.2.1 Working with `/mocks` Data
- 18.2.2 Adding New Mock Entities
- 18.2.3 [Mini Story] "The Mock User Personas"

### 18.3 Console and DevTools
- 18.3.1 Helpful Console Logs Pattern
- 18.3.2 React DevTools Integration
- 18.3.3 [Easter Egg] The Debug Mode Flag

---

# EPILOGUE: Contributing to nuvaClub

## E.1 Adding a New Feature
- E.1.1 Feature Folder Structure Template
- E.1.2 Type Definition First
- E.1.3 Mock Data Setup
- E.1.4 Component Development Flow

## E.2 Styling Guidelines
- E.2.1 Tailwind Class Ordering
- E.2.2 Custom Component Variants
- E.2.3 Animation Consistency

## E.3 Code Quality
- E.3.1 ESLint and Prettier Config
- E.3.2 TypeScript Strictness
- E.3.3 [Final Easter Egg] The Code Review Checklist

---

# APPENDICES

## Appendix A: Component Reference
- A.1 Atoms Index
- A.2 Molecules Index
- A.3 Organisms Index
- A.4 Feature Components by Domain

## Appendix B: Type Reference
- B.1 Auth Types
- B.2 Learn Types
- B.3 Shop Types
- B.4 Space Types
- B.5 Sprint Types
- B.6 Test Types
- B.7 Forum Types

## Appendix C: Hook Reference
- C.1 Auth Hooks
- C.2 Database Hooks
- C.3 Progress Hooks
- C.4 UI Utility Hooks

## Appendix D: Route Map
- D.1 Public Routes
- D.2 Member Routes
- D.3 Dynamic Routes and Parameters

## Appendix E: Glossary
- E.1 nuvaClub Terminology (Nunu, Vava, Duo, etc.)
- E.2 Technical Terms

---

> **Total Chapters:** 18 (including Prologue and Epilogue)
> **Total Sections:** 100+
> **Mini Stories:** 20+
> **Easter Eggs:** 30+
> **Tips:** 25+

---

*"Every line of code tells a story. This playbook helps you read them all."*
