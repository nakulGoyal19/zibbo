# Zibbo Foods

## Brand

- **Name:** Zibbo Foods
- **Tagline:** "Goodness in Every Bite"
- **Product:** Premium Makhana (Fox Nuts) — launched
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
├── js/main.js                 # Nav, scroll, carousel, lightbox, animations
├── assets/images/
│   ├── hero/                  # Hero carousel images (6 product shots)
│   │   ├── 5624.jpeg          # All packs overhead
│   │   ├── 5625.jpeg          # All packs standing (default)
│   │   ├── 5627.jpeg          # Packs against wall
│   │   ├── 5629.jpeg          # Packs arranged
│   │   ├── 5631.jpeg          # Packaging machine
│   │   └── 5633.jpeg          # Packaging process
│   ├── products/
│   │   ├── red-standup/       # Makhana Mini Pack (100g)
│   │   ├── gold/              # Gold Makhana (250g)
│   │   ├── red-handle/        # Makhana Handle Pack (250g)
│   │   └── premium/           # Premium Makhana (250g)
│   ├── zibbo-logo.jpeg        # Brand logo
│   ├── favicon-32.png         # Browser tab icon 32x32
│   ├── favicon-16.png         # Browser tab icon 16x16
│   └── apple-touch-icon.png   # iOS home screen icon 180x180
├── .gitignore
├── CLAUDE.md                  # This file
└── README.md
```

### Product Image Pattern

Each product folder follows this structure:
- `1-front.jpeg` — Front card image (no rotation)
- `2-front.jpeg` — Second card image (rotated 90° right for desktop)
- `2-front-mobile.jpeg` — Non-rotated version for mobile (where applicable)
- `3-gallery.jpeg` to `6-gallery.jpeg` — All non-rotated gallery/lightbox images

## Website Sections (index.html)

1. **Navbar** — Fixed top, logo + 4 links (About, Products, Why Zibbo, Contact) + WhatsApp "Order Now" button, mobile hamburger menu
2. **Hero** — "Now Available" pulse badge, headline, subtitle, two CTAs (Order on WhatsApp / See Products), auto-rotating image carousel (6 images, 3s interval, crossfade)
3. **Products** — 4 product cards in 2×2 grid (Mini / Gold / Handle / Premium) with dual-image preview, lightbox gallery, badges, tags, pricing (MRP strikethrough + selling price + discount badge + wholesale line) and individual WhatsApp order CTAs + WhatsApp banner
4. **About** — 3 cards: Our Story, Our Mission, Made in India
5. **Why Zibbo** — 4 pillar cards with numbered headers and top-border hover effect
6. **Contact** — 3 cards: WhatsApp (link), Email (link), Instagram (link)
7. **Footer** — Logo, tagline, nav links, social icons (Instagram, Email, WhatsApp)
8. **Floating WhatsApp button** — Fixed bottom-right on all pages

## Products (SKUs)

| Pack | Name | Format | Weight | MRP | Selling | Wholesale | Grade |
|------|------|--------|--------|-----|---------|-----------|-------|
| Red Mini | Makhana Mini Pack | Zip-lock standup pouch | 100g | ₹299 | ₹120 | ₹90 | Regular |
| Gold | Gold Makhana | Zip-lock standup pouch | 250g | ₹699 | ₹325 | ₹235 | Jumbo, handpicked |
| Red Handle | Makhana Handle Pack | Handle packet | 250g | ₹600 | ₹275 | ₹210 | Regular |
| Premium | Premium Makhana | Zip-lock standup pouch | 250g | ₹899 | ₹400 | ₹310 | Largest, most premium, handpicked |

- FSSAI: 22126688000252
- Packed & marketed by: Jiwan Karyana Store, Railways Road, Dhoor, Sangrur – 148024, Punjab, India

## WhatsApp Order Number
- **+91 94642 68002** — used in all WhatsApp order links throughout the site (from visiting card)

## Deployment

- **Hosting:** Vercel (free tier) connected to GitHub repo
- **GitHub repo:** github.com/nakulGoyal19/zibbo
- Static site — no build step, Vercel serves files directly

## Tech Stack

- Vanilla HTML5 / CSS3 / JavaScript (no frameworks)
- Google Fonts (Poppins)
- SVG icons (inline, no external icon library)
- CSS-only decorative patterns (dots, circles, leaf SVG, radial gradients)
- IntersectionObserver for scroll animations
- `<picture>` elements for responsive images (rotated desktop / non-rotated mobile)

## Features

- Auto-scroll from hero to products after 2.5s (cancelled if user interacts)
- Hero image carousel (6 images, 3s auto-rotate, crossfade)
- Product image lightbox with keyboard/touch/swipe navigation
- Product card gallery with dot indicators
- Scroll-triggered fade-in animations with staggered timing
- Active nav link highlighting on scroll
- Mobile-responsive hamburger menu

## Development

```bash
# Run locally
python3 -m http.server 8080
# Open http://localhost:8080
```
