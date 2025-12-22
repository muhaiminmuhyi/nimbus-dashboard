# Nimbus Dashboard

Nimbus is a **desktop-first internal SaaS dashboard** designed to support decision-making, monitoring, and operational workflows for administrators, finance teams, and managers.

This project focuses on **clarity, performance, and real-world usability**, rather than visual showmanship.

---

## 🔍 Product Overview

Nimbus is built to answer one primary question:

> **“What should I care about today?”**

The dashboard surfaces:
- Key business metrics (KPIs)
- Actionable items requiring attention
- Short-term trends and recent activity

Deep analysis and exploration are intentionally separated into dedicated Analytics views.

---

## 🧠 Design Decisions

### 🖥️ Desktop-First by Design
Nimbus is intentionally designed for desktop usage.

**Why:**
- Primary tasks involve tables, analytics, and configuration
- These workflows benefit from larger screens and focused attention
- Mobile usage is assumed to be secondary and notification-driven

Not every product benefits from a mobile-first approach.

---

### 📊 Dashboard vs Analytics Separation
The dashboard and analytics pages serve different purposes:

- **Dashboard** → High-level overview and actions
- **Analytics** → Deep exploration, sorting, filtering, and large datasets

This separation avoids cognitive overload and keeps each page focused.

---

### 📈 Mini Trends Instead of Full Charts
The dashboard uses **sparklines** instead of full charts.

**Why:**
- Trends provide directional context without visual noise
- Full charts belong in analytics views
- Sparklines are lightweight and fast to scan

---

### 🚨 Action-Oriented Information
An **Action Required** panel is surfaced prominently.

**Why:**
- Internal tools should guide users toward action
- Highlighting overdue or pending items reduces friction
- Severity-based visuals improve scanability

---

### 🧩 Weekly Summary with Context
Weekly summaries combine:
- Clear textual insights
- Subtle visual trends for context

This balances readability with insight without turning the dashboard into another analytics page.

---

### ⚡ Performance as a First-Class Concern
Data-heavy views use **virtualized tables**.

**Why:**
- Rendering large datasets can degrade performance
- Virtualization ensures smooth scrolling and predictable rendering
- Native solutions are preferred over heavy dependencies

---

### 🎨 Micro Interactions with Restraint
Animations are used sparingly and purposefully.

Examples:
- KPI count-up animation
- Soft hover elevation on interactive cards
- One-time highlight for new activity

Excessive motion is intentionally avoided to reduce fatigue during long sessions.

---

### ♿ Accessibility & Motion Sensitivity
Nimbus respects accessibility best practices:
- Reduced-motion friendly transitions
- Clear contrast and readable typography
- Predictable, non-surprising interactions

Accessibility is treated as a usability feature, not an afterthought.

---

## 🧱 Architecture & Maintainability

Key architectural choices:
- Feature-based folder structure
- Composables for shared state and logic
- Presentational components kept as stateless as possible

These decisions support scalability, readability, and long-term maintainability.

---

## 🚫 Intentionally Avoided

- Overly decorative animations
- Large charts on the dashboard
- Mobile app duplication without a clear use case
- Visual elements that do not support decision-making

> Good design is often defined by what is deliberately left out.

---

## 🛠 Tech Stack

- Vue 3
- Composition API
- Tailwind CSS
- TypeScript
- Vite

---

## ✅ Conclusion

Nimbus is designed to feel **calm, predictable, and trustworthy**.

If the interface feels quiet and unobtrusive, the design has succeeded.

---

## 📸 Preview

> _(Add screenshots here if desired)_

---

## 📄 License

This project is for portfolio and demonstration purposes.
