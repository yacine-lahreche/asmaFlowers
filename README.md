# 🌸 Asma Flowers | Handcrafted Satin Ribbon Boutique

Asma Flowers is a premium e-commerce experience dedicated to the art of handcrafted satin ribbon flowers. The platform blends high-end glassmorphic aesthetics with a seamless ordering system, allowing users to browse eternal collections and order bespoke arrangements directly via WhatsApp.

![Asma Flowers Preview](assets/store-logo.png)

## ✨ Key Features

- **Luxury Design System**: A bespoke "Glassmorphic" interface featuring vibrant color palettes, blurred satin-like backgrounds, and playfair display typography.
- **Dynamic 3D Parallax**: Immersive mouse-driven parallax effects (Desktop only) for a tactile, artisanal feel.
- **Dynamic Inventory**: Integrated with **Supabase REST API** for real-time product management.
- **Session-Only Cart**: A privacy-focused shopping cart that resets on page reload, keeping the experience lightweight.
- **Granular Responsiveness**: A custom CSS architecture featuring **7 granular breakpoints** (from 4K down to 320px) for a pixel-perfect mobile-first experience.
- **WhatsApp Integration**: Orders are formatted and sent directly to the artisan's WhatsApp, streamlining communication and personalization.
- **Admin Dashboard**: A secure, password-protected portal for the artisan to add, edit, and manage the product catalog.

## 🛠️ Technology Stack

- **Frontend**: Vanilla HTML5, CSS3 (Modern Flexbox/Grid), and ES6+ JavaScript.
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL + Storage) for product data and high-resolution image hosting.
- **Styling**: Vanilla CSS with custom properties (CSS Variables) for a modular, maintainable code structure.
- **Transitions**: Native CSS animations and hardware-accelerated transforms for fluid 60FPS interactions.

## 📂 Project Structure

```text
asmaFlowers/
├── assets/             # Images, backgrounds, and brand identity
├── css/
│   ├── main.css        # Home page styling
│   ├── about.css       # Narrative & Story styling
│   ├── collections.css # Shop & Cart styling
│   └── admin.css       # Dashboard utility styling
├── js/
│   ├── main.js         # Navigation & Parallax logic
│   ├── about.js        # Interactive storytelling logic
│   ├── collections.js  # Cart engine & Supabase integration
│   └── admin.js        # Product CRUD & Database operations
├── index.html          # Gateway to the Sanctuary
├── about.html          # Our Story
├── collections.html    # The Eternal Selection
└── admin.html          # Artisan's Dashboard
```

## 🚀 Getting Started

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yacine-lahreche/asma-flowers.git
   ```

2. **Configuration**:
   Open `js/admin.js` and `js/collections.js` to configure your Supabase credentials:
   ```javascript
   const SUPABASE_URL = 'https://YOUR_PROJECT_REF.supabase.co';
   const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';
   ```

3. **Deployment**:
   The project is built using zero dependencies. Simply host the root directory on **Vercel**, **Netlify**, or **GitHub Pages**.

## 📞 Contact & Ordering

All orders are processed via WhatsApp. 

---
*Crafted with silken care for a timeless experience.*
