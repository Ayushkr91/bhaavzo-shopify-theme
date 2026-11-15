# Bhaavzo - Premium Shopify Online Store 2.0 Theme

> **"Sahi Bhaav. Smart Ghar."**  
> Premium, mobile-first Shopify Online Store 2.0 theme purpose-built for the Indian D2C market, focusing on smart gadgets and everyday problem-solving home utility products.

---

## 🎨 Brand Identity & Style Tokens

| Property | Value | Notes |
| :--- | :--- | :--- |
| **Brand Name** | Bhaavzo | Tagline: *Sahi Bhaav. Smart Ghar.* |
| **Primary Navy** | `#102A43` | Trust, authority, premium electronics aesthetic |
| **Accent Orange** | `#FF6B35` | Energetic, conversion-optimized CTA buttons & badges |
| **Background** | `#FFFBF5` | Warm off-white reducing eye strain, inviting feel |
| **Card / Drawer Surface** | `#FFFFFF` | Crisp contrast for product photography |
| **Trust Green** | `#0D9488` | Indian delivery & payment trust badges |
| **Currency** | INR (₹) | Formatted with Indian comma notation (e.g. ₹1,299) |
| **Target Audience** | 18–45 | Modern Indian households seeking practical utility |

---

## 🚀 Key Features Implemented

### 1. Homepage (Fully Editable in Shopify Theme Editor)
- **Top Announcement Bar**: Highlights *Free Shipping on Orders over ₹999*, *Secure Payments & UPI*, and *Cash On Delivery (COD) Available*. Sleek responsive mobile compaction.
- **Sticky Header**: Brand logo, tagline pill, desktop navigation, search modal, cart icon with dynamic badge count, and slide-in mobile navigation drawer.
- **Hero Banner**: High-converting headline *"Smart Finds. Better Everyday."*, dual CTAs (*Shop Gadgets* & *Shop Home Utility*), social proof pill (*4.8/5 Rated by 25,000+ Indian Homes*), and featured deal card.
- **Featured Categories**: 4 core categories (*Gadgets*, *Kitchen Utility*, *Home Organisation*, *Lighting & Cleaning*) with hover micro-interactions.
- **Best Sellers Carousel & Grid**: Product cards featuring discount percentages (e.g., 50% OFF), ratings, live prices, compare-at prices, and 1-click **Quick Add**.
- **Why Bhaavzo (4 Pillars)**:
  1. *Useful Products* (Handpicked problem-solvers)
  2. *Fair Pricing (Sahi Bhaav)* (Direct-to-consumer honesty)
  3. *Easy Support* (Instant WhatsApp & Email assistance)
  4. *Secure Checkout & COD* (Zero advance payment risk)
- **Deal of the Day**: Flash sale spotlight with real-time countdown timer (Hours, Mins, Secs) and limited inventory progress meter (*"Only 9 left at this price!"*).
- **Verified Customer Reviews**: Authentic reviews with verified buyer badges and Indian cities (*Mumbai, Bengaluru, Pune, Hyderabad*).
- **FAQ Accordion**: Seamless accordion answering COD availability, delivery speed across India, 7-day replacements, and warranty.
- **Newsletter & WhatsApp VIP Offer**: Flat ₹100 welcome coupon incentive (*BHAAVZO100*).
- **Professional Footer**: Brand bio, quick links, policies, customer care details, and payment trust badges (*UPI, RuPay, Visa, Mastercard, COD*).

### 2. Collection Pages (`/collections/:handle`)
- Curated collection banners and subtitles.
- Filter pills (*All, Gadgets, Kitchen Utility, Home Organisation, Lighting, Cleaning*).
- Sorting dropdown (*Featured, Best Selling, Price: Low to High, Price: High to Low*).
- Fully responsive 2-column mobile grid and 4-column desktop layout.

### 3. Product Detail Page (PDP)
- High-resolution image gallery with interactive thumbnail switcher.
- Rating summary & stock status pill.
- Savings amount badge (*Save ₹1,200 (48% OFF)*).
- Live Indian Pincode Delivery Checker (*e.g. 400001* checking COD and estimated delivery date via Delhivery / Bluedart).
- Color and variant selector buttons.
- Quantity stepper + Primary **Add to Cart** and **Buy Now (COD)** buttons.
- 3-Pillar Trust Strip (*Cash on Delivery*, *7-Day Returns*, *100% Genuine*).
- Expandable accordions for *Product Description & Benefits*, *How to Use & Care*, and *Shipping, COD & Warranty*.
- **Sticky Mobile Add-to-Cart Bar**: Appears automatically on mobile scroll for maximum conversion rate.
- Related products recommendation grid.

### 4. Slide-out Cart Drawer
- Smooth sliding drawer with backdrop blur.
- **Dynamic Free Shipping Meter**: Tracks orders against the ₹999 threshold, showing remaining amount or unlocking the green congratulations meter.
- In-drawer quantity adjustments and item deletion.
- Recommended cross-sell item (*"Recommended Home Add-on"*).
- Order summary with subtotal and taxes disclaimer.
- Direct checkout button routing to Shopify's native `/checkout`.

### 5. Static & Policy Pages
- **About Bhaavzo** (`/pages/about`): Brand story, mission, and quality standards.
- **Customer Support & Tracking** (`/pages/contact`): Contact details, WhatsApp chat, and inquiry form.
- **Shipping Policy** (`/pages/shipping-policy`): Metro and regional delivery timelines and COD rules.
- **7-Day Returns & Refund Policy** (`/pages/refund-policy`): Doorstep reverse pickup and replacement terms.
- **Privacy Policy** (`/pages/privacy-policy`): DPDP-compliant data guidelines.
- **Terms of Service** (`/pages/terms`): Legal and governing terms.

---

## 📦 Directory Structure

```
bhaavzo/
├── assets/
│   ├── base.css              # Reset, typography, utility classes, and button system
│   ├── theme.css             # Component, section, mobile-first responsive styles
│   ├── theme.js              # Vanilla JS for navigation, accordions, timer, pincode
│   └── cart-drawer.js        # Cart drawer state, quantity stepper, free shipping meter
├── config/
│   ├── settings_schema.json  # Theme Editor controls (colors, thresholds, socials)
│   └── settings_data.json    # Default settings and brand color values
├── layout/
│   └── theme.liquid          # Master layout template
├── locales/
│   └── en.default.json       # English (India) language strings
├── sections/
│   ├── announcement-bar.liquid
│   ├── header.liquid
│   ├── hero-banner.liquid
│   ├── featured-categories.liquid
│   ├── product-carousel.liquid
│   ├── why-bhaavzo.liquid
│   ├── deal-of-the-day.liquid
│   ├── customer-reviews.liquid
│   ├── faq.liquid
│   ├── newsletter-signup.liquid
│   ├── footer.liquid
│   ├── main-collection.liquid
│   ├── main-product.liquid
│   ├── cart-drawer.liquid
│   └── main-page.liquid
├── snippets/
│   ├── product-card.liquid
│   └── trust-badges.liquid
├── templates/
│   ├── index.json
│   ├── collection.json
│   ├── product.json
│   ├── cart.json
│   ├── page.about.json
│   ├── page.contact.json
│   ├── page.shipping-policy.json
│   ├── page.refund-policy.json
│   ├── page.privacy-policy.json
│   └── page.terms.json
├── preview-server/
│   ├── server.js             # Standalone Node.js preview server
│   ├── data.js               # Sample product catalogue
│   └── capture_screenshots.ps1 # Multi-viewport visual regression runner
└── bhaavzo-shopify-theme.zip # 1-Click installable theme archive for Shopify
```

---

## 💻 How to Install on Shopify

1. Log into your **Shopify Admin** dashboard (`admin.shopify.com`).
2. Go to **Online Store > Themes**.
3. In the **Theme library** section, click **Add theme > Upload zip file**.
4. Upload `bhaavzo-shopify-theme.zip`.
5. Click **Customize** to edit sections, colors, or banners via the Shopify Theme Editor, or **Publish** to go live.
