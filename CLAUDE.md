# Zibbo Foods

## Brand

- **Name:** Zibbo Foods
- **Tagline:** "Goodness in Every Bite"
- **Product:** Premium Makhana (Fox Nuts) — launching soon
- **Positioning:** Healthy, clean, guilt-free snacking brand

## Domains & Socials

- **Website:** zibbofoods.com / zibbofoods.in
- **Email:** zibbofoods@gmail.com
- **Instagram:** [@zibbofoods](https://instagram.com/zibbofoods)

## Brand Colors

| Name         | Hex       | Usage                        |
|-------------|-----------|------------------------------|
| Dark Green  | `#1B5E20` | Footer, deep accents         |
| Mid Green   | `#2E7D32` | Primary brand, buttons, links|
| Leaf Green  | `#7CB342` | Accent highlights            |
| Pale Green  | `#E8F5E9` | Card borders, backgrounds    |
| Green BG    | `#F5F9F0` | Section backgrounds          |
| Orange      | `#F9A825` | CTA, badge, secondary accent |
| Orange Light| `#FFF8E1` | Warm background tints        |

- **Font:** Poppins (Google Fonts) — weights 300-800

## Product USPs

1. Naturally Nutritious
2. Light & Crunchy
3. Clean Snacking
4. Guilt Free
5. Plant Based
6. Rich in Fibre
7. Protein Source
8. No Preservatives

## Project Structure

```
zibbo/
├── index.html                 # Single-page landing site
├── css/style.css              # All styles (responsive, animations, patterns)
├── js/main.js                 # Nav, scroll, notify form, tab toggle
├── assets/images/
│   ├── zibbo-logo.jpeg        # Brand logo
│   ├── zibbo-launch-soon.png  # Product launch poster
│   ├── favicon-32.png         # Browser tab icon 32x32
│   ├── favicon-16.png         # Browser tab icon 16x16
│   └── apple-touch-icon.png   # iOS home screen icon 180x180
├── zibbo-logo.jpeg            # Original logo (root copy)
├── zibbo-launch-soon.png      # Original poster (root copy)
├── .gitignore
├── CLAUDE.md                  # This file
└── README.md
```

## Website Sections (index.html)

1. **Navbar** — Fixed top, logo + 4 links (About, Product, Why Zibbo, Contact), mobile hamburger menu
2. **Hero** — "Launching Soon" pulse badge, headline, subtitle, two CTAs (Get Notified / Explore), product image with float animation
3. **About** — 3 cards: Our Story, Our Mission, Made in India
4. **Product** — Makhana showcase image + 4 feature list (Plant Based, Protein Source, Rich in Fibre, No Preservatives)
5. **Why Zibbo** — 4 pillar cards with numbered headers and top-border hover effect
6. **Notify** — Email/Mobile tab toggle, form POSTs to Google Sheets via Apps Script
7. **Contact** — 3 cards: Email (plain text), Instagram (link), Website (link)
8. **Footer** — Logo, tagline, nav links, social icons

## Email/Mobile Collection (Google Sheets Integration)

- Notify form has two tabs: **Email** and **Mobile**
- Form submits via `fetch()` POST with `mode: 'no-cors'` to a Google Apps Script Web App
- **Script URL:** `https://script.google.com/macros/s/AKfycbwV23tvoc1Il6mKQsts5e9XgQg-g7vpGfn77Nk-nzrR-ojjbnCYkTH7yHnE2duwJ0z6Tw/exec`
- Data is stored in a Google Sheet with columns: `Email | Mobile | Timestamp`
- The Apps Script checks for duplicates before inserting
- Sheet is accessible from the zibbofoods@gmail.com Google account

### Google Apps Script (for reference)

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  var email = data.email || '';
  var mobile = data.mobile || '';
  var type = data.type || 'email';
  var value = type === 'email' ? email : mobile;

  var colIndex = type === 'email' ? 1 : 2;
  var existing = sheet.getRange(1, colIndex, sheet.getLastRow(), 1).getValues().flat();
  if (existing.includes(value)) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: 'duplicate' })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  sheet.appendRow([email, mobile, new Date()]);

  return ContentService.createTextOutput(
    JSON.stringify({ status: 'success' })
  ).setMimeType(ContentService.MimeType.JSON);
}
```

## Deployment

- **Hosting:** Vercel (free tier) connected to GitHub repo
- **GitHub repo:** github.com/nakulGoyal19/zibbo (to be pushed)
- Static site — no build step, Vercel serves files directly

## Tech Stack

- Vanilla HTML5 / CSS3 / JavaScript (no frameworks)
- Google Fonts (Poppins)
- Google Sheets + Apps Script for data collection
- SVG icons (inline, no external icon library)
- CSS-only decorative patterns (dots, circles, leaf SVG, radial gradients)
- IntersectionObserver for scroll animations

## Development

```bash
# Run locally
python3 -m http.server 8080
# Open http://localhost:8080
```
