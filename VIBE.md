# 🌊 Vibe Coding: Five Star POS

Follow these refined rules to maintain the system's professional architecture and security.

---

## 📜 Mandatory Rules

1.  **Architecture Integrity**: Strictly maintain the **Controller -> Service -> Repository** pattern. Never allow a controller to touch Google Sheets directly.
2.  **Security First**: 
    - Never log secrets.
    - All password operations must use `bcryptjs`.
    - Protect all non-public routes with `authMiddleware` and `adminOnly` where appropriate.
3.  **Timezone Compliance**: Always use the `Asia/Bangkok` (GMT+7) timezone for date calculations and storage via `date.utils.ts`.
4.  **Zero-Hardcode Policy**: All configuration, pricing, and user data must live in Google Sheets or `.env`.
5.  **Build Safety**: Ensure `node scripts/generate-version.js` runs before every build to keep the system version accurate.
6.  **Git Protocol**: Do not stage or commit changes without explicit user approval.
7.  **Refactoring Rule**: Do not refactor stable, working code unless an error is detected.

---

## 💡 The Vibe Coding Prompt

> I need to [IMPLEMENT FEATURE / FIX BUG] in the POS system.
> 
> **Guidelines**:
> 1. Respect the monorepo structure and existing module patterns.
> 2. Use `toSafeNumber()` for all Google Sheet numeric operations to prevent string concatenation.
> 3. For UI, strictly use Tailwind, Lucide icons, and shadcn-style components.
> 4. Ensure Thai language support is preserved in all message templates.
> 5. Provide a summary of logic changes before implementation.
>
> What is your strategy?

---

## 🛠 Tech Recap
- **Stack**: Node, Express, React, Vite, Tailwind, Google Sheets API, LINE Messaging SDK v9.
- **Admin Features**: Password Reset, User Status Toggle, Stock Audit Logs, CSV Export.
- **Security**: JWT, Bcrypt, Rate Limiting, RBAC.
