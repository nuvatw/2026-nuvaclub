# NuvaClub Multilingual Architecture Plan

## Executive Strategy Summary

NuvaClub transforms from a single-region campaign into a global AI education brand by implementing a **Story-First Multilingual Strategy**. Unlike traditional localization which focuses on literal translation, our architecture enables **Cultural Narrative Adaptation**.

The system decouples **Business Logic** (Domain Layer) from **Brand Narrative** (Content Layer). The Domain enforces consistent rules (pricing, membership rights) globally, while the Content Layer (Strapi + Application) serves culturally distinct stories (e.g., emphasizing "efficiency" for Japan vs "innovation" for US).

**Core Pillars:**
1.  **Strict Domain Authority**: Business rules never live in the CMS.
2.  **Narrative Flexibility**: Strapi models support structural variation per locale.
3.  **High-Performance Delivery**: Edge-cached content with tag-based revalidation.
4.  **Bot-First SEO**: Complete `hreflang` and metadata support for global discovery.

---

## 2. Technical Architecture Diagram

```mermaid
graph TD
    User[User (Browser)] -->|Requests /ja/home| NextJS[Next.js App Router]
    
    subgraph "Application Layer (Presentation)"
        NextJS -->|1. Detect Locale| Middleware[Middleware]
        NextJS -->|2. Fetch Content| CMSProvider[StrapiContentProvider]
        NextJS -->|3. Fetch Data| BFF[BFF API Layer]
    end

    subgraph "Data Layer (Single Source of Truth)"
        BFF -->|Query| Domain[Domain Services]
        Domain -->|Read/Write| DB[(PostgreSQL)]
        CMSProvider -->|GraphQL/REST| Strapi[Strapi Headless CMS]
    end

    subgraph "Content Governance"
        Strapi -->|Webhooks| Revalidate[Revalidation API]
        Revalidate -->|Purge Cache| NextJS
    end
```

---

## 3. Multilingual Strategy & Routing

### URL Structure
We adopt a **Path-Based Routing** strategy for maximum SEO control and zero configuration for users.

-   `nuvaclub.com/` (Default: redirects to detected locale or fallback `zh-TW`)
-   `nuvaclub.com/zh-TW` (Taiwan - Primary Market)
-   `nuvaclub.com/en` (Global / US)
-   `nuvaclub.com/ja` (Japan)
-   `nuvaclub.com/ko` (Korea)

### Locale Fallback Rules
1.  **Explicit Path**: If URL is `/ja/*`, render Japanese.
2.  **Cookie Preference**: If `NEXT_LOCALE` cookie exists, redirect root `/` to cookie value.
3.  **Accept-Language**: If no cookie, match browser header.
4.  **Default**: Fallback to `zh-TW` if no match found.

---

## 4. CMS Schema Design (Strapi)

We structure content to separate **Architecture** (Page Structure) from **Decoration** (Text/Assets).

### Single Types (Page Narratives)
Used for high-traffic, narrative-heavy pages.

#### `Topic: HomePage`
*Internationalization Enabled*
-   **Hero Section** (Component)
    -   `Badge` (Text)
    -   `Headlines` (Dynamic Zone: varies by region intensity)
    -   `VideoID` (Text: different videos for different regions)
-   **ValueProps** (Repeatable Component)
    -   `Icon` (Asset)
    -   `Title` (Text)
    -   `Description` (Rich Text)
-   **SocialProof** (Component)
    -   `TrustText` (Text)
    -   `Logos` (Relation -> Partner Collection)

### Collection Types (Shared Resources)

#### `Topic: Translation` (UI Components)
*Internationalization Enabled*
-   `Keys`: `common.buttons.submit`, `auth.login`, `currency.symbol`
-   (Crucial: These are flat key-value pairs for UI elements, not content paragraphs)

#### `Topic: BlogPost` (Content Marketing)
*Internationalization Enabled*
-   `Slug` (UID - Localized, e.g., `/en/ai-future` vs `/ja/ai-mirai`)
-   `Content` (Rich Text)

---

## 5. Brand Narrative System (Cultural Adaptation)

The architecture supports **Structural Variation** per locale, not just text replacement.

| Feature | implementation | Example |
| :--- | :--- | :--- |
| **Tone** | Per-locale Content Fields | EN: "Unlock your potential" (Direct) vs JA: "Together we build the future" (Communal) |
| **Visuals** | Localized Asset Fields | CH: Asian founder video. EN: International montages. |
| **Pricing** | Domain-Controlled | Price *numbers* come from DB/Domain. Price *labels* ("Best Value") come from CMS. |

**Constraint**: The *structure* of the funnel (Hero -> Video -> Pricing -> FAQ) remains consistent to preserve the User Journey managed by the App Router layout.

---

## 6. Application Layer Design

### `StrapiContentProvider` Implementation
The integration layer must be robust and type-safe.

```typescript
// Interface
interface ContentProvider {
  getPage(slug: string, locale: Locale): Promise<PageData>;
  getDictionary(locale: Locale): Promise<Record<string, string>>;
}

// Logic
class StrapiContentProvider implements ContentProvider {
  async getPage(slug: string, locale: Locale) {
    // Fetches strictly typed Strapi response
    // Uses Next.js 'unstable_cache' with tags: [`cms:${slug}`, `cms:${locale}`]
    // Returns data explicitly mapped to Domain View Models
  }
}
```

### Abstraction
The UI Components **never** see Strapi schema directly. They consume mapped interfaces (`HeroViewModel`, `PricingViewModel`). This prevents CMS changes from breaking UI code.

---

## 7. BFF & Domain Responsibilities (Governance)

**Strict Separation of Concerns:**

1.  **BFF (Backend for Frontend)**
    -   **Locale Detection**: Reads `Next-Locale` header or URL segment.
    -   **Orchestration**: Calls `DomainServices` for logic and `ContentFactory` for text.
    -   **DTO Construction**: Merges `Domain Data` (Price: $99) + `CMS Content` (Label: "Best Deal") -> `Frontend Response`.

2.  **Domain Layer (SSOT)**
    -   **Language Agnostic**: Understands IDs, Amounts, Dates. Does NOT understand "English" or "Chinese".
    -   **Pricing**: Calculates amounts.
    -   **Membership**: Grants access rights.

**Rule**: If it touches money or rights, it is Domain. If it touches persuasion or explanation, it is CMS.

---

## 8. Performance Strategy

1.  **Edge Caching (Vercel/CDN)**
    -   Pages are statically generated (SSG) or incrementally generated (ISR) per locale.
    -   `/en` and `/ja` are separate cached entities.

2.  **Tag-Based Revalidation**
    -   Redis/Next.js Cache Tags: `content:home`, `content:ja`.
    -   Strapi Webhook triggers `/api/revalidate?tag=content:home`.
    -   Result: Instant updates globally without full rebuilds.

3.  **Asset Optimization**
    -   Images served via Next/Image optimization using Strapi assets.
    -   Videos hosted externally (Youtube/Vimeo) mapped via ID in CMS.

---

## 9. SEO Architecture

### 1. Hreflang Implementation
Every page header must include references to its alternate versions.

```html
<link rel="alternate" hreflang="zh-TW" href="https://nuvaclub.com/zh-TW" />
<link rel="alternate" hreflang="en" href="https://nuvaclub.com/en" />
<link rel="alternate" hreflang="ja" href="https://nuvaclub.com/ja" />
<link rel="alternate" hreflang="x-default" href="https://nuvaclub.com/zh-TW" />
```

### 2. Metadata
-   **Titles/Descriptions**: Managed in Strapi per locale field.
-   **OpenGraph**: Localized images generated or uploaded in CMS.

### 3. Sitemaps
-   Dynamically generated `sitemap.xml` that iterates through all locales and pages.

---

## 10. Future Scalability & Workflow

### AI Content Pipeline
1.  **Drafting**: Marketer inputs core message in `zh-TW`.
2.  **Adaptation**: AI Agent reads `zh-TW` + "Brand Voice Guidelines (JP/EN)" -> Generates draft JSON.
3.  **Review**: Localization team reviews in Strapi.
4.  **Publish**: Webhook updates site.

### Expansion Roadmap
1.  **Phase 1 (Now)**: `zh-TW` hardcoded fallback.
2.  **Phase 2**: Activate `en`, `ja`, `ko` in Strapi. Connect BFF.
3.  **Phase 3**: Region-specific campaigns (e.g., Japan-only Spring sale) controlled by Domain Rules + CMS Feature Flags.

