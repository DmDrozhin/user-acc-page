# User Account Page — Vue 3 + Vite

A modern **Vue 3** + **Vite** project for building a user profile page with structured sections, responsive UI, mock API data, and modular components.

This project includes:

* User profile viewer
* Editable profile fields
* Avatar upload & cropping
* Validation for back cards
* Validation for form inputs
* Phone formatter utilities
* Mock backend data
* Modular Vue components

---

## 🚀 Tech Stack

* **Vue 3 Composition API**
* **TypeScript**
* **Vite** (dev server + bundler)
* **SCSS** (styling)

## 🛠️ Libs
* **VueUse/integrations** (helpers)
* **vue-advanced-cropper** (crop uploaded image)
* **Card-validator** (back card validator)
* **Async-validator** (inputs validator)

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
* Responsive layout (grid + flex)

### ✔ Avatar Upload & Crop

* Drag & drop upload
* Image cropping modal
* Error display via toast/badge

### ✔ Phone Formatter Utility

Formats phone numbers for **Ukraine, USA, and others**.

### ✔ Mock Data Support

Located in `src/data/mockProfile.json` and `src/data/mockCards.json`.
Great for prototyping or testing backend-less environments.

### ✔ Dynamic UI Styling

Backgrounds, shadows, and colors update via reactive bindings.

---

## 🧪 Development Notes

* Works with VS Code (recommended extensions: Vue, TypeScript, Volar)
* Uses SCSS modules for component-specific styles
