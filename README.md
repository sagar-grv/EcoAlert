# 🌿 EcoAlert — Environmental Awareness Platform

<div align="center">

![EcoAlert Banner](https://img.shields.io/badge/EcoAlert-Environmental%20Platform-22c55e?style=for-the-badge&logo=leaf&logoColor=white)

**A Twitter/X-style social platform for reporting and tracking environmental issues across India, powered by AI analysis.**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat&logo=vite)](https://vitejs.dev)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[Live Demo](#) · [Report Bug](https://github.com/sagar-grv/EcoAlert/issues) · [Request Feature](https://github.com/sagar-grv/EcoAlert/issues)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [AI Features Explained](#-ai-features-explained)
- [Multilingual Support](#-multilingual-support)
- [Pages & Components](#-pages--components)
- [Known Limitations & Roadmap](#-known-limitations--roadmap)
- [Contributing](#-contributing)

---

## 🌍 Overview

**EcoAlert** is a community-driven environmental reporting platform built for India. Citizens can report pollution, disasters, deforestation, wildlife threats, and climate events in real-time. Every post is automatically analyzed by a rule-based AI engine that:

- 🧠 **Detects fake/misleading news** using keyword credibility scoring
- 🚦 **Classifies risk level** (Critical / High / Medium / Low) based on environmental keywords
- 💡 **Generates actionable suggestions** specific to the issue category and risk level

Think of it as **Twitter meets environmental activism** — with an AI co-pilot.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📝 **Post Reports** | Share environmental incidents with image uploads, location tagging, and category classification |
| 🤖 **AI Risk Analysis** | Every post is instantly scored for risk level using a keyword pattern engine |
| 🕵️ **Fake News Detection** | Credibility scoring based on language patterns, factual keywords, and image presence |
| 💡 **AI Suggestions** | India-specific actionable advice (helpline numbers, emergency steps) per category and risk |
| 🗺️ **Near Me** | Filter posts by distance from your GPS location using the Haversine formula |
| 🔍 **Explore by Category** | Browse Air, Water, Land, Wildlife, Climate, and Disaster reports separately |
| 📊 **Analysis Dashboard** | View app limitations, AI stack details, and product roadmap |
| 🌐 **10 Indian Languages** | Full UI translation support for English, Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada, Malayalam, and Punjabi |
| 🔔 **Notifications Panel** | Bell icon dropdown with mock notification feed |
| 📨 **Messages Panel** | Message dropdown with unread indicators |
| 🎨 **Dark Glassmorphic UI** | Premium dark theme with animated glass-effect cards |

---

## 🛠 Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19 | UI framework |
| **Vite** | 7 | Build tool & dev server |
| **React Router DOM** | 7 | Client-side routing |
| **Lucide React** | Latest | Icon library |
| **Vanilla CSS** | — | All styling (no Tailwind) |

### AI / Logic Layer

| Module | Approach |
|--------|----------|
| `fakeNewsDetector.js` | Keyword frequency scoring + image presence bonus |
| `riskClassifier.js` | Priority-ordered keyword pattern matching (4 tiers) |
| `suggestionEngine.js` | Category × Risk level lookup table (India-specific) |

### State & Data

| Layer | Technology |
|-------|-----------|
| Auth state | React Context + `localStorage` |
| Feed/posts | React Context + `localStorage` |
| Language | React Context + `localStorage` |
| Mock data | `src/data/mockPosts.js` (13 seeded posts) |

---

## 📁 Project Structure

```
EcoAlert/
├── index.html                    # App entry HTML
├── vite.config.js                # Vite config (React plugin only)
├── package.json
│
└── src/
    ├── main.jsx                  # React root + ErrorBoundary
    ├── App.jsx                   # Route setup + Auth guard
    ├── index.css                 # All application styles (~2300 lines)
    │
    ├── pages/
    │   ├── LoginPage.jsx         # Login form + Google mock login
    │   ├── SignupPage.jsx        # Signup form + state selector
    │   ├── Home.jsx              # Main feed with filters
    │   ├── Explore.jsx           # Category grid + drill-down
    │   ├── NearMe.jsx            # GPS-based location filter
    │   └── Analysis.jsx          # App analysis + roadmap
    │
    ├── components/
    │   ├── Navbar.jsx            # Top nav: search, notifications, messages, avatar
    │   ├── BottomNav.jsx         # Mobile bottom nav: Home, Explore, +Post, NearMe, Analysis
    │   ├── PostCard.jsx          # Individual post card with actions
    │   ├── CreatePost.jsx        # New post modal with image upload
    │   ├── CategoryFilter.jsx    # Category + Risk filter pills
    │   ├── RightSidebar.jsx      # Trending, critical alerts, search
    │   ├── AISuggestionPanel.jsx # Collapsible AI suggestion list
    │   ├── FakeNewsIndicator.jsx # Credibility score badge
    │   ├── RiskBadge.jsx         # Risk level colored badge
    │   └── LanguagePicker.jsx    # Language dropdown selector
    │
    ├── context/
    │   ├── AuthContext.jsx       # User auth: login, logout, updateLang
    │   ├── AppContext.jsx        # Posts, filters, likes, search
    │   └── LangContext.jsx       # Language state + translation function
    │
    ├── ai/
    │   ├── fakeNewsDetector.js   # Credibility scoring engine
    │   ├── riskClassifier.js     # Risk level classification
    │   └── suggestionEngine.js   # India-specific action suggestions
    │
    ├── data/
    │   └── mockPosts.js          # 13 seeded environmental reports
    │
    ├── i18n/
    │   └── translations.js       # 10-language translation dictionary
    │
    └── utils/
        └── helpers.js            # haversineDistance, formatTime, generateId
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/sagar-grv/EcoAlert.git
cd EcoAlert

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open **<http://localhost:5173>** in your browser.

### Build for Production

```bash
npm run build
```

Output goes to the `dist/` directory.

### Login (Demo)

The app uses **mock authentication** — no backend required:

- Enter **any name** and a **phone number** (min 6 digits)
- Or click **"Continue with Google"** for instant random mock login

---

## 🤖 AI Features Explained

### 1. Fake News Detector (`fakeNewsDetector.js`)

Scores every post on a **0–100 credibility scale**:

| Signal | Effect |
|--------|--------|
| Sensational words ("shocking", "you won't believe") | `-12` per match |
| Credible words ("study", "government", "verified") | `+8` per match |
| Environmental keywords ("pollution", "flood") | `+5` per match |
| Image attached | `+15` |
| Very short text (< 30 chars) | `-20` |
| Long text (> 100 chars) | `+8` |

**Output labels:** `Verified` · `Likely True` · `Unverified` · `Suspicious`

### 2. Risk Classifier (`riskClassifier.js`)

Scans post text for keywords in priority order:

| Level | Example Keywords | Color |
|-------|-----------------|-------|
| 🔴 **Critical** | chemical spill, nuclear, cholera, tsunami | Red |
| 🟠 **High** | flood, pollution, sewage, deforestation | Orange |
| 🟡 **Medium** | plastic, garbage, open burning, erosion | Yellow |
| 🟢 **Low** | littering, tree cutting, park issue | Green |

### 3. Suggestion Engine (`suggestionEngine.js`)

Returns **India-specific** actionable advice based on `category × riskLevel`:

- Includes real helpline numbers: NDRF (1078), Wildlife SOS (1800-11-9991), PCB (1800-11-4000)
- Covers 6 categories × 4 risk levels = **24 unique suggestion sets**

---

## 🌐 Multilingual Support

EcoAlert supports **10 Indian languages** out of the box:

| Code | Language | Code | Language |
|------|----------|------|----------|
| `en` | English | `bn` | Bengali |
| `hi` | Hindi | `mr` | Marathi |
| `ta` | Tamil | `gu` | Gujarati |
| `te` | Telugu | `kn` | Kannada |
| `ml` | Malayalam | `pa` | Punjabi |

Language preference is saved to `localStorage` and synced with the user profile.

---

## 📱 Pages & Components

### Pages

| Page | Route | Description |
|------|-------|-------------|
| Login | `/login` | Name + Phone form, mock Google login, language selector |
| Signup | `/signup` | Name, Phone, State selector |
| Home | `/` | Post feed with category & risk filters, right sidebar |
| Explore | `/explore` | Category grid → drill-down to category-specific posts |
| Near Me | `/near-me` | GPS location → radius slider → nearby posts |
| Analysis | `/analysis` | AI stack info, limitations table, future features roadmap |

### Key Components

**`PostCard`** — The core feed item:

- Author avatar, name, handle, timestamp
- Location tag with city & state
- Post content / caption
- Image (with fallback placeholder)
- Category chip + Risk badge + Fake news indicator
- AI suggestion panel (collapsible)
- Actions: Like ❤️, Repost 🔁, Share 🔗, Flag 🚩

**`Navbar`** — Top bar:

- Brand logo
- Search bar (real-time filter)
- 🔔 Notifications dropdown
- ✉️ Messages dropdown
- `+ Post` button → opens CreatePost modal
- Language picker
- User avatar dropdown (profile, logout)

**`BottomNav`** — Mobile navigation:

- Home · Explore · **[+ FAB]** · Near Me · Analysis

---

## ⚠️ Known Limitations & Roadmap

### Current MVP Limitations

| Area | Current State | Planned Improvement |
|------|--------------|---------------------|
| AI | Rule-based keyword matching | Google Gemini Vision API |
| Backend | `localStorage` only | Firebase Firestore + Auth |
| Location | Manual city selection | Real-time GPS + Google Maps |
| Feed | Static load | Live real-time streaming |
| Images | Browser-only | Cloud Storage + moderation |

### Planned Features

- 🗺️ Environmental Heat Maps (Google Maps API)
- 🤖 Gemini Vision image analysis
- 🔔 Push notifications (FCM)
- 👥 Expert/NGO verification badges
- 📊 Analytics dashboard with historical trends
- 🏛️ CPCB AQI + NDMA disaster alert integration
- 🎯 Issue resolution tracking

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

```bash
# 1. Fork the repository
# 2. Create your feature branch
git checkout -b feature/AmazingFeature

# 3. Commit your changes
git commit -m 'feat: Add AmazingFeature'

# 4. Push to the branch
git push origin feature/AmazingFeature

# 5. Open a Pull Request
```

### Code Style

- Use functional React components with hooks
- Follow the existing CSS class naming conventions (kebab-case)
- Keep AI logic in `src/ai/` modules
- Add translations for new UI strings in `src/i18n/translations.js`

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">

Made with 💚 for the environment

**EcoAlert** — *Protecting the planet, one report at a time* 🌿

</div>
