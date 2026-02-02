# Strapi Content Model Schema

To support the nuvaClub dynamic i18n system, please configure your Strapi instance with the following schemas.

## 1. Single Types (Page Content)

These Single Types store the structured content for specific pages.

### `home-page`
- **Display Name**: Home Page
- **API ID** (Singular): `home-page`
- **Draft & Publish**: Enabled
- **Internationalization**: Enabled (Locales: `en`, `zh-TW`, `ja`, `ko`)

#### Fields
| Field Name | Type | Options | Description |
| :--- | :--- | :--- | :--- |
| `hero_badge` | Text | Required, Localized | e.g. "Early Bird Access" |
| `hero_headline` | Component | (Reusable) | `line1` (Text), `line2` (Text) |
| `hero_subheadline` | Text | Long Text, Localized | Main intro text |
| `hero_primary_cta` | Text | Localized | Button text |
| `hero_secondary_cta` | Text | Localized | Button text |

*(Note: Repeat this pattern for other sections like `founder_video`, `funding_tiers`, etc. as components or dynamic zones)*

---

## 2. Collection Types (Shared Content)

### `translation`
- **Display Name**: Translation (UI Labels)
- **API ID** (Plural): `translations`
- **Internationalization**: Enabled
- **Draft & Publish**: Enabled

#### Fields
| Field Name | Type | Options | Description |
| :--- | :--- | :--- | :--- |
| `key` | UID | Required, Unique | Dot-notation key from older i18n files, e.g. `common.buttons.submit`. **Not Localized** (shared across locales) |
| `value` | Text | Required, Localized | The actual text to display. |

---

## 3. Usage Guide

### Fetching Content (API)
- **Home Page**: `GET /api/home-page?locale={locale}&populate=*`
- **Translations**: `GET /api/translations?locale={locale}&filters[key][$eq]={key}`

### Migration 
For the "Hybrid" phase, we will map:
- `home` -> `home-page` Single Type
- `common` -> `translation` Collection
