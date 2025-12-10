# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is currently not compatible with SWC. See [this issue](https://github.com/vitejs/vite-plugin-react/issues/428) for tracking the progress.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
<div align="center">

# 🚀 **OnboardX Widget**
### A lightweight, embeddable onboarding experience for any website.

<img src="https://img.shields.io/badge/Status-Production%20Ready-brightgreen?style=for-the-badge" />
<img src="https://img.shields.io/badge/Build-Vite-blue?style=for-the-badge" />
<img src="https://img.shields.io/badge/Format-IIFE-purple?style=for-the-badge" />

<br />

**Live Production File:**  
### 🔗 https://onboardx-widget.vercel.app/onboardx-widget.iife.js  
(⚠️ The base URL shows 404. This is NORMAL for widget bundles.)

</div>

---

## ✨ Overview

The **OnboardX Widget** is a plug-and-play onboarding tour system designed for SaaS platforms, dashboards, admin tools, and internal apps.

Simply drop one script tag on your page and instantly enable:

- 🎯 Step-by-step onboarding flows  
- 🧭 Guided tours  
- 📊 Analytics & event tracking  
- ⚡ Zero-configuration embedding  

---

## 🛠 **Installation**

Add this script to ANY website or dashboard:

```html
<script src="https://onboardx-widget.vercel.app/onboardx-widget.iife.js"></script>

<script>
  OnboardX.init({
    userId: "demo-user",
    tourId: "welcome-tour",
  });
</script>

✔ Loads instantly
✔ No framework required
✔ Works on plain HTML, React, Next.js, Vue, Angular, anything

⛔ Why does the main link show 404?

Because this project outputs a widget file, not a full website.

The correct file is:

/onboardx-widget.iife.js


So always use the full path:
👉 https://onboardx-widget.vercel.app/onboardx-widget.iife.js

🔧 Local Development

Clone & install:

npm install
npm run dev


Build the optimized widget:

npm run build


Bundled output will be inside:

dist/onboardx-widget.iife.js

📦 Project Structure
onboardx-widget/
│
├── src/               # widget components + logic
├── dist/              # final build output (IIFE bundle)
├── index.html         # local preview only
├── package.json
└── README.md

🚀 Deployment

This project is auto-deployed on Vercel.
When you push to main, Vercel:

Builds the project

Generates /dist/onboardx-widget.iife.js

Serves it at your widget URL

🧪 Example Usage (Advanced)
<script>
  OnboardX.init({
    userId: "customer_8712",
    tourId: "dashboard-intro",
    onFinish: () => console.log("Tour completed!"),
    theme: {
      color: "#1E90FF",
      highlight: "#FFD700"
    }
  });
</script>

📸 Screenshot 


Insert an image of your widget here if you want

🧑‍💻 Maintainer

Sandra Analaba (Xander-kira)
Product Engineer · HNG Stage 8
📧 Email: optional
🐙 GitHub: https://github.com/Xander-kira

<div align="center">
⭐ If you like this widget, give the repo a star on GitHub!
</div> ```

