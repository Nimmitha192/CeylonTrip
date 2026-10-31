# 🌴 CeylonTrip Planner

**CeylonTrip Planner** is a full-stack web application for exploring tourist destinations in Sri Lanka and organizing personalized travel itineraries. Visitors can browse destinations and categories, while registered users can generate, save, manage, and review travel plans.

## ✨ Features

- **Destination discovery:** Browse Sri Lankan destinations, view destination details, and explore categories.
- **Personalized trip planning:** Generate itineraries using travel preferences such as duration, starting location, budget, and travel type.
- **Saved trips:** Save generated plans and view, edit, or delete your own trips.
- **User accounts:** Register, sign in, and manage profile information.
- **Favorites:** Add destinations to or remove them from a personal favorites list.
- **Reviews:** Read destination reviews and submit, edit, or delete your own reviews.
- **Admin management:** Admin-only operations for destination and category management, user administration, and review moderation.
- **Responsive interface:** A React-based interface styled with Tailwind CSS.

## 🛠️ Technology Stack

| Layer | Technologies |
| --- | --- |
| Frontend | React, Vite, Tailwind CSS |
| Navigation | React Router |
| API requests | Axios |
| Maps | Leaflet, React Leaflet |
| Charts | Recharts |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JSON Web Tokens (JWT), bcryptjs |

## 📁 Project Structure

```text
CeylonTrip/
├── Client/                 # React + Vite frontend
│   ├── public/
│   ├── src/
│   └── package.json
├── Server/                 # Express backend
│   ├── controllers/        # Request handlers and business logic
│   ├── middleware/         # Authentication and authorization
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API route definitions
│   ├── validators/         # Request validation
│   ├── server.js           # Server entry point
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js and npm
- MongoDB (local instance or MongoDB Atlas)
- Git (optional)

### 1. Clone the repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd CeylonTrip
```

Replace `<YOUR_REPOSITORY_URL>` with the URL of your GitHub repository.

### 2. Configure and start the backend

```bash
cd Server
npm install
```

Create a `.env` file in `Server/` with the values required by your local deployment. For example:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=replace_with_a_long_random_secret
PORT=5000
```

Keep this file private; never commit real database credentials or JWT secrets.

```bash
npm run dev
```

The backend start script is also available as `npm start`.

### 3. Start the frontend

Open a second terminal in the project root:

```bash
cd Client
npm install
npm run dev
```

Open the local URL shown by Vite in your terminal. Make sure the frontend's API configuration points to your backend.

## 🔗 API Overview

The backend exposes these route groups:

| Base path | Purpose |
| --- | --- |
| `/api/auth` | Registration, login, authenticated user |
| `/api/categories` | Destination categories |
| `/api/destinations` | Destination browsing and admin management |
| `/api/reviews` | Review management |
| `/api/trips` | Trip generation and saved trip CRUD |
| `/api/admin` | Administrative functions |
| `/api/users` | User profile and favorites |

### Trip APIs

| Method | Endpoint | Description | Authentication |
| --- | --- | --- | --- |
| POST | `/api/trips/generate` | Generate a travel itinerary | Not required by route |
| POST | `/api/trips` | Save a trip | Required |
| GET | `/api/trips` | List your saved trips | Required |
| GET | `/api/trips/:id` | Get a saved trip | Required |
| PUT | `/api/trips/:id` | Update a saved trip | Required |
| DELETE | `/api/trips/:id` | Delete a saved trip | Required |

### Additional API examples

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/auth/register` | Register an account |
| POST | `/api/auth/login` | Log in |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/destinations` | List destinations |
| GET | `/api/destinations/:idOrSlug` | Get destination details |
| GET | `/api/categories` | List categories |
| GET | `/api/destinations/:destinationId/reviews` | Read destination reviews |
| POST | `/api/destinations/:destinationId/reviews` | Submit a review (authenticated) |
| GET | `/api/users/profile` | Get profile (authenticated) |
| PUT | `/api/users/profile` | Update profile (authenticated) |
| GET | `/api/users/favorites` | List favorites (authenticated) |

Admin-only routes and additional update/delete routes are defined in the backend's `routes/` directory.

## 🗄️ Database Models

The MongoDB data model includes:

- `User`
- `Destination`
- `Category`
- `Trip`
- `Review`
- `Hotel`
- `Activity`

Mongoose models define the data structure, relationships, and validation constraints.

## 🔒 Security

- JWT-based authentication for protected routes.
- Role-based access checks on administrative endpoints.
- Password hashing using `bcryptjs`.
- Request validation for supported operations.
- Environment variables for sensitive configuration.

> **Security note:** Never upload `.env`, credentials, database connection strings, or `node_modules/` to GitHub.

## 🔮 Future Improvements

- More advanced itinerary personalization and route optimization.
- Improved map-based trip visualization.
- Expanded destination, accommodation, and activity information.
- Automated tests and CI workflows.
- Additional accessibility and performance improvements.

## 📄 Project Information

Developed as a **Web Application Development mini project** at the **University of Ruhuna, Sri Lanka**.

---

*Explore Sri Lanka. Plan your journey with CeylonTrip Planner.*
