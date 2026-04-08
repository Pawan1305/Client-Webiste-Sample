# 👑 Premium Food E-Commerce (MERN)

A royal-looking, feature-complete food ordering website with Admin Panel, built with the MERN stack.

---

## ✨ Features

- **Premium Royal UI** — Dark gold theme, Cormorant Garamond font, Framer Motion animations
- **Full Menu** — Category filters, search, veg/non-veg badges, stock display
- **Cart** — Add/remove items, quantity controls, persistent via localStorage
- **Checkout** — UPI deeplink payment + WhatsApp payment message
- **Admin Panel**
  - Login with JWT auth
  - Add / Edit / Delete menu items
  - Update stock per item
  - View & manage all orders
  - Mark orders as Paid / update status
  - Dashboard stats (total orders, revenue, low stock, etc.)

---

## 🛠️ Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React 18 + Vite + Tailwind CSS    |
| Animations| Framer Motion                     |
| Backend   | Node.js + Express.js              |
| Database  | MongoDB + Mongoose                |
| Auth      | JWT + bcryptjs                    |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB running locally (`mongod`) or MongoDB Atlas URI

### 1. Install all dependencies

```bash
npm run install-all
```

### 2. Configure environment

Edit `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/vijay_canteen
JWT_SECRET=your_secret_key_here
CLIENT_URL=http://localhost:5173
UPI_ID=yourname@upi          # ← Change to your UPI ID
UPI_NAME=Vijay Canteen
WHATSAPP_NUMBER=919876543210  # ← Change to your WhatsApp number
```

Also update in `client/src/pages/Checkout.jsx`:
```js
const UPI_ID = 'yourname@upi'
const WHATSAPP_NUMBER = '91XXXXXXXXXX'
```

### 3. Create the Admin account (one-time)

```bash
curl -X POST http://localhost:5000/api/admin/setup
```

Default credentials:
- **Username:** `admin`
- **Password:** `VijayCanteen@2024`

### 4. Run the app

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

---

## 📂 Project Structure

```
vijay_canteen/
├── server/
│   ├── config/db.js
│   ├── controllers/
│   ├── middleware/authMiddleware.js
│   ├── models/ (Item, Order, Admin)
│   ├── routes/
│   └── server.js
└── client/
    └── src/
        ├── context/ (CartContext, AdminAuthContext)
        ├── pages/ (Home, Menu, Cart, Checkout, admin/)
        ├── components/ (Navbar, Footer, FoodCard, ProtectedRoute)
        └── utils/api.js
```

---

## 💳 Payment Flow

### UPI
On checkout → creates order in DB → opens `upi://pay?pa=VPA&am=amount` deeplink → user pays in their UPI app.

### WhatsApp
On checkout → creates order in DB → opens WhatsApp with pre-filled order summary message to the restaurant number.

---

## 🔑 Admin Panel

Visit `/admin` → redirects to `/admin/login` if not authenticated.

| Feature          | Details                              |
|------------------|--------------------------------------|
| Add items        | Name, description, price, stock, image URL, category |
| Edit items       | All fields editable                  |
| Delete items     | With confirmation prompt             |
| Update stock     | Inline input in items table          |
| View orders      | All orders with customer details     |
| Update order status | Placed → Confirmed → Preparing → Ready → Delivered |
| Mark paid        | Set payment status to Completed      |

---

## 🎨 Theme Colors

| Token       | Hex         | Usage               |
|-------------|-------------|---------------------|
| Gold 500    | `#C9A84C`   | Primary brand color |
| Gold 300    | `#FFD700`   | Highlights          |
| Dark 900    | `#050505`   | Background          |
| Cream 100   | `#F5ECD7`   | Primary text        |
