# Trust-Scan 🔍

> A QR-based hygiene transparency platform for the unorganized food sector — street vendors, campus canteens, and small eateries.

---

## What is Trust-Scan?

Trust-Scan gives every food vendor a unique QR code. When a customer scans it, they instantly see a **live hygiene score** — verified by trained inspectors, not crowdsourced. No bribery. No guesswork. Just transparent, real-time food safety.

---

## The Problem

- FSSAI licenses are static paper documents — they don't reflect daily hygiene conditions
- Government inspections are infrequent and susceptible to corruption
- Consumers have zero visibility into hygiene before eating
- Honest vendors can't differentiate themselves from unhygienic competitors

## The Solution

Each vendor gets a QR code linked to their public Trust-Scan profile showing:
- Overall hygiene score (out of 100)
- Breakdown across 6 parameters
- Inspection history and trends
- Vendor info and FSSAI status

Scores are set **exclusively by Trust-Scan certified inspectors** — customers and vendors cannot alter them.

---

## Hygiene Score Breakdown

| Parameter | Max Score |
|---|---|
| 🧤 Personal Hygiene | 20 |
| 🧊 Food Storage & Temperature | 20 |
| 💧 Water Quality | 20 |
| 🍽️ Utensil Cleanliness | 15 |
| 🗑️ Waste Disposal | 15 |
| 🥬 Ingredient Freshness | 10 |
| **Total** | **100** |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend / Mobile | React Native (Expo) |
| Web Support | React Native Web |
| Backend | Firebase Firestore |
| Authentication | Firebase Auth (Email/Password) |
| QR Codes | react-native-qrcode-svg |

---

## Project Structure

```
trustscan/
├── screens/
│   ├── vendor/
│   │   └── VendorScreen.js       # Public score page (QR destination)
│   └── inspector/
│       └── InspectorScreen.js    # Inspector login + rating form
├── components/                   # Reusable UI components
├── config/
│   └── firebase.js               # Firebase initialization
├── assets/
├── App.js
└── package.json
```

---

## Firestore Data Structure

### `vendors` collection

Each document represents one vendor:

```
vendors/
└── {vendorId}/
    ├── name                (string)
    ├── location            (string)
    ├── foodType            (string)
    ├── totalScore          (number)
    ├── personalHygiene     (number)
    ├── foodStorage         (number)
    ├── waterQuality        (number)
    ├── utensilCleanliness  (number)
    ├── wasteDisposal       (number)
    ├── ingredientFreshness (number)
    ├── lastInspected       (timestamp)
    ├── registeredSince     (timestamp)
    ├── fssai               (boolean)
    └── inspectionCount     (number)
```

---

## Getting Started

### Prerequisites

- Node.js installed
- Expo CLI
- Firebase account

### Installation

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/trustscan.git
cd trustscan

# Install dependencies
npm install --legacy-peer-deps
npx expo install expo-router react-native-safe-area-context react-native-screens
npx expo install react-native-web
npm install react-dom --legacy-peer-deps
```

### Firebase Setup

1. Create a Firebase project at [firebase.google.com](https://firebase.google.com)
2. Enable **Firestore Database** (Standard, `asia-south1`)
3. Enable **Authentication** → Email/Password
4. Register a web app and copy the config
5. Paste your config into `config/firebase.js`:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### Run the App

```bash
# Web
npx expo start --web

# Mobile (scan QR with Expo Go app)
npx expo start
```

---

## Roadmap

- [x] Firebase setup
- [x] Vendor public score page
- [ ] Inspector login + authentication
- [ ] Inspector rating form
- [ ] QR code generation per vendor
- [ ] Vendor registration flow
- [ ] Inspection history tracking
- [ ] Admin dashboard for institutions
- [ ] Deploy on Vercel / Expo

---

## Alignment with Government Schemes

| Scheme | How Trust-Scan Aligns |
|---|---|
| PM SVANidhi | Adds digital hygiene identity to street vendors |
| Eat Right India (FSSAI) | Operationalizes food safety through real-time QR scores |
| Digital India | QR + mobile-first platform |
| Startup India | Eligible for DPIIT recognition |

---

## Author

**Diaan Bheda** — Computer Science & Business Systems (CSBS)

---

## License

MIT
