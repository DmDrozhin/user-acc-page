# User Account Page — Vue 3 + Vite

A modern and modular **Vue 3 + Vite** project for building a fully featured user account page.
Includes profile viewing, editing, validation, avatar upload with cropping, phone formatting, and UI utilities.

This project includes:

* User profile viewer
* Editable profile fields
* Avatar upload & cropping
* Validation for bank cards
* Validation for general form inputs
* Automatic detection of card payment system
* Phone formatter utilities
* Mock backend data
* Modular Vue components

---

## 🚀 Tech Stack

* **Vue 3 Composition API**
* **TypeScript**
* **Vite** (fast dev server + bundler)
* **SCSS** (component-level styling)

## 🛠️ Libraries Used

* **VueUse / integrations** — utility composables
* **vue-advanced-cropper** — avatar crop tool
* **card-validator** — bank card validation & card type detection
* **async-validator** — form input validation

---

## 📁 Project Structure

```
project/
│
├─ src/
│  ├─ assets/               # images, icons, styles
│  ├─ components/           # UI + feature components
│  ├─ data/                 # mock JSON data
│  ├─ composables/          # reusable logic (validators, formatters)
│  ├─ store/                # Pinia stores
│  ├─ utils/                # helpers (phone formatter, parsing)
│  ├─ App.vue               # root component
│  └─ main.ts               # entry
│
├─ public/                  # static assets
├─ index.html               # main template
└─ vite.config.ts           # Vite config
```

---

## 🧩 Key Features

### ✔ User Profile View

* Displays avatar, name, email, phone
* Responsive layout (flex + grid)

### ✔ Avatar Upload & Crop

* Drag & drop support
* Cropping modal for avatar images
* Error display via toast/badge/text message

### ✔ Phone Formatter Utility

Formats phone numbers for **Ukraine, USA, and multiple international formats**.

### ✔ Bank Card Validation

* Validates card number, expiration, CVC
* Detects card brand (Visa, MasterCard, etc.)
* Built using **card-validator** and **async-validator**

### ✔ Mock Data Support

Mock data is stored in:

* `src/data/mockProfile.json`
* `src/data/mockCards.json`

Perfect for development without backend.

### ✔ Dynamic UI Styling

UI backgrounds, shadows, and colors adjust reactively via props and bindings.

---

## 🧪 Development Notes

* Optimized for **VS Code** (recommended extensions: Vue, TypeScript, Volar)
* Uses SCSS modules for scoped component styling
* Code structure is modular and scalable
* Easily extendable with Vue Router or API layer

---

If you want to add installation steps, screenshots, API documentation, or demo GIFs — just tell me, and I’ll expand the README.
