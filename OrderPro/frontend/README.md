# OrderPro Frontend

Restaurant ordering system frontend built with React, Vite, React Router, Tailwind CSS and daisyUI.

## Features

- Registration and login using localStorage
- Duplicate email registration prevention
- Protected restaurant pages
- Navbar + footer rendered once through MainLayout
- Category filtering
- Food cards
- Add to cart
- Quantity controls
- ₹ INR prices
- GST calculation
- Place order
- Order history
- Profile
- Contact page
- Responsive daisyUI interface

## Run

```bash
npm install
npm run dev
```

Then open the local Vite URL.

## Important

This version is a frontend-only demo. Passwords and users are stored in browser localStorage, which is suitable for a college/demo frontend but NOT for production authentication. For a real app, connect the forms to your Node/Express/MongoDB backend and hash passwords server-side.
