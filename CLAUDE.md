# Zibbo Foods

## Brand

- **Name:** Zibbo Foods
- **Tagline:** "Goodness in Every Bite"
- **Product:** Premium Makhana (Fox Nuts) — launched
- **Positioning:** Healthy, clean, guilt-free snacking brand

## Legal Entity

- **Trade Name:** Jiwan Karyana Store
- **GSTIN:** 03BSKPG2293N1ZH
- **FSSAI:** 22126688000252
- **Address:** Railway Road, M/s Jiwan Karyana Store, Dhuri, Dhuri, Sangrur, Punjab – 148024

## Domains & Socials

- **Website:** zibbofoods.com / zibbofoods.in
- **Email:** zibbofoods@gmail.com
- **Instagram:** [@zibbofoods](https://instagram.com/zibbofoods)
- **WhatsApp:** +91 94642 68002

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
├── index.html                 # Main page — products, hero, about, contact, checkout
├── why-makhana.html           # SEO content — health benefits, nutrition, snack comparison
├── terms.html                 # Terms & Conditions
├── privacy.html               # Privacy Policy
├── refund-policy.html         # Refund & Cancellation Policy
├── shipping-policy.html       # Shipping & Delivery Policy
├── css/style.css              # All styles (responsive, animations, patterns)
├── js/main.js                 # Nav, scroll, carousel, lightbox, cart, checkout, Cashfree
├── api/
│   ├── create-order.js        # Vercel serverless — creates Cashfree order (server-side price validation)
│   └── verify-payment.js      # Vercel serverless — verifies payment via Cashfree Get Order API
├── package.json               # Dependencies (cashfree-pg SDK for serverless functions)
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

## Website Pages

### index.html (Main Page)

1. **Navbar** — Fixed top, logo + 4 links (About, Products, Why Makhana, Contact) + "Shop Now" button, mobile hamburger
2. **Hero** — "Now Available" pulse badge, headline, subtitle, two CTAs ("Shop Now" primary, "WhatsApp" secondary outline), auto-rotating image carousel (6 images, 3s interval)
3. **Products** — 4 product cards in 2×2 grid with:
   - Dual-image preview, lightbox gallery, badges, tags
   - Pricing (MRP strikethrough + selling price + discount badge)
   - "Add to Cart" button → transforms to qty picker (−/+) on click
   - Max 100 per product
4. **Flavoured Makhana — Coming Soon** — Teaser with 9 flavour tags (Peri Peri, Cheddar Cheese, Himalayan Salt, Cream & Onion, Minty Pudina, Tangy Tomato, Magic Masala, Smokey Barbeque, Lemon Chilli)
5. **WhatsApp CTA Banner** — Secondary option for bulk/wholesale orders
6. **About** — 3 cards: Our Story, Our Mission, Made in India
7. **Why Zibbo** — 4 pillar cards with numbered headers and top-border hover effect
8. **Contact** — 3 cards: WhatsApp (link), Email (link), Instagram (link)
9. **Footer** — Logo, tagline, nav links, policy links, social icons, FSSAI + GSTIN + business address
10. **Sticky Cart Bar** — Fixed bottom, appears when items added, shows item count + subtotal + shipping info + Checkout button
11. **Checkout Modal** — Order summary → address form (name, phone, address, city, state, pincode) → Cashfree payment → success/failure screen
12. **Floating WhatsApp button** — Fixed bottom-right

### why-makhana.html (SEO Content)

- What is Makhana (origin, GI tag, harvesting)
- Nutrition facts per 100g (styled table)
- 8 health benefit cards
- Makhana vs Chips vs Popcorn vs Almonds comparison table
- Flavoured Makhana Coming Soon section
- Shop CTA

### Policy Pages (terms, privacy, refund-policy, shipping-policy)

- Professional legal content specific to Zibbo Foods
- Required for payment gateway activation
- Consistent navbar/footer across all pages

## Products (SKUs)

| Pack | Name | Format | Weight | MRP | Selling | Grade |
|------|------|--------|--------|-----|---------|-------|
| Red Mini | Makhana Mini Pack | Zip-lock standup pouch | 100g | ₹299 | ₹120 | Regular |
| Gold | Gold Makhana | Zip-lock standup pouch | 250g | ₹699 | ₹325 | Jumbo, handpicked |
| Red Handle | Makhana Handle Pack | Handle packet | 250g | ₹600 | ₹275 | Regular |
| Premium | Premium Makhana | Zip-lock standup pouch | 250g | ₹899 | ₹400 | Largest, most premium, handpicked |

## Shipping & Returns

- **Shipping:** Free above ₹500, flat ₹50 below. All-India. 3-5 to 5-7 days based on partner/pincode.
- **Returns:** Only for genuine issues (damaged/defective/wrong items). 7-day window. Photos required within 48 hours. Refund to original payment method in 5-7 business days.

## Checkout & Payments

### Flow
1. User adds items via "Add to Cart" buttons on product cards
2. Sticky cart bar shows at bottom with item count, subtotal, shipping
3. "Checkout" opens modal with order summary + address form
4. Form submit → `api/create-order.js` creates Cashfree order (server-side price validation)
5. Cashfree checkout opens (redirect mode — UPI, cards, wallets, netbanking)
6. On return → `api/verify-payment.js` fetches order status from Cashfree API
7. Redirects back to site with success/failure → modal shown

### Cashfree Setup (env vars on Vercel)
- `CASHFREE_APP_ID` — from Cashfree dashboard (Developers → API Keys)
- `CASHFREE_SECRET_KEY` — from Cashfree dashboard
- `CASHFREE_ENV` — `SANDBOX` for testing, `PRODUCTION` for live

### Order Management
- All orders visible in Cashfree Dashboard with customer details in order notes/tags
- Manual fulfilment: check dashboard → pack → ship → WhatsApp tracking to customer

## Coming Soon

### Flavoured Makhana
Peri Peri, Cheddar Cheese, Himalayan Salt, Cream & Onion, Minty Pudina, Tangy Tomato, Magic Masala, Smokey Barbeque, Lemon Chilli

### Future Products
- Royal Medley (mix of makhana, seeds, dry fruits)
- Roasted & salted cashews and almonds

## Deployment

- **Hosting:** Vercel (free tier) connected to GitHub repo
- **GitHub repo:** github.com/nakulGoyal19/zibbo
- Static site + Vercel serverless functions (api/ directory)
- Vercel auto-detects `api/*.js` as serverless functions

## Tech Stack

- Vanilla HTML5 / CSS3 / JavaScript (no frameworks)
- Cashfree JS SDK (client-side checkout)
- Cashfree PG Node.js SDK (server-side order creation & verification)
- Vercel Serverless Functions (Node.js)
- Google Fonts (Poppins)
- SVG icons (inline, no external icon library)
- CSS-only decorative patterns (dots, circles, leaf SVG, radial gradients)
- IntersectionObserver for scroll animations
- `<picture>` elements for responsive images

## Features

- Auto-scroll from hero to products after 2.5s (cancelled if user interacts)
- Hero image carousel (6 images, 3s auto-rotate, crossfade)
- Product image lightbox with keyboard/touch/swipe navigation
- Add to Cart → qty picker transformation
- Sticky cart bar with live totals and shipping calculation
- Checkout modal with address form + Razorpay payment
- Scroll-triggered fade-in animations with staggered timing
- Active nav link highlighting on scroll
- Mobile-responsive hamburger menu
- Full-screen checkout modal on mobile

## Development

```bash
# Run locally
python3 -m http.server 8080
# Open http://localhost:8080

# Note: Cashfree checkout and API calls won't work locally
# (serverless functions only run on Vercel). Test with Cashfree sandbox keys after deploy.
```
