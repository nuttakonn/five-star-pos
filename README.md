# Five Star POS 🍗

A professional, enterprise-grade Point of Sale (POS) system integrated with **LINE Messaging API** and **Google Sheets**. Optimized for Thailand with local time synchronization and Thai language support.

---

## 🏗 System Architecture

-   **Monorepo**: Managed via a root controller for simultaneous backend/frontend operation.
-   **Backend (`apps/api`)**: Node.js/Express with official **Google APIs**, **BcryptJS** hashing, and **JWT** (JSON Web Token) authentication.
-   **Frontend (`apps/web`)**: React/Vite/Tailwind CSS with **shadcn/ui** and **React Query**.
-   **Database**: 100% Google Sheets based (No SQL cost).

---

## 🚀 Professional Features

-   **Secure Login System**: JWT-based authentication with user accounts stored securely (hashed) in Google Sheets.
-   **Role-Based Access (RBAC)**: 
    - **Admin**: Full access to all menus, inventory, audit logs, and user management.
    - **Viewer**: Restricted access to only Dashboard and Sales History.
-   **Multi-Item LINE Bot**: Intelligent Thai parser supports selling multiple items in one message (e.g., `ขาย ไก่ย่าง 2 ไก่จ๊อ 1`).
-   **Inventory Intelligence**: Real-time stock deduction, low stock alerts, and a full **Stock Movement** audit trail.
-   **Advanced Analytics**: Dynamic date range filtering with robust numeric calculation (fix for string concatenation bug).
-   **Enterprise Reporting**: Functional **CSV Export** with 30-day range validation.
-   **Dynamic Versioning**: Automatic tracking of system version (`1.0.0.xx`), commit hash, and Thai deployment timestamp.

---

## 💬 LINE Bot Commands

| Command | Action | Example |
| :--- | :--- | :--- |
| **ขาย [ชื่อ] [จำนวน] ...** | Record a multi-item sale | `ขาย ไก่ย่าง 1 ไก่จ๊อ 2` |
| **Stock** | View full inventory and low stock alerts | `Stock` |
| **Summary today** | Detailed bill-by-bill summary for today | `Summary today` |
| **Summary month** | Daily sales breakdown for the current month | `Summary month` |

---

## 💻 Local Execution

### **1. Setup**
```bash
# Install everything
npm run install:all

# Configure Environment
# Create apps/api/.env using .env.example
```

### **2. Operation**
```bash
# Initialize Google Sheet headers & default admin
npm run init:db

# Run Backend + Frontend simultaneously
npm run dev
```

---

## 🌐 Cloud Deployment

1.  **Backend (Render)**: Connect GitHub. Render will use the included `Dockerfile` and `render.yaml`.
2.  **Frontend (Vercel)**: Connect GitHub. Set root directory to `apps/web`.
3.  **Environment Variables**: Ensure `JWT_SECRET`, Google keys, and LINE tokens are set on both platforms.

**Default Login:** `admin` / `admin123` (Change this immediately in the **Security** menu).
