# Clarity - Expense Tracker

A modern, full-stack expense tracking application built with React, Express.js, and MongoDB. Clarity helps you manage your finances with AI-powered insights and a beautiful, responsive user interface.

## Features

- **User Authentication**: Secure login and registration with JWT tokens and bcryptjs encryption
- **Transaction Management**: Track income and expenses with categories and descriptions
- **Dashboard**: View your financial overview with real-time data
- **Dark/Light Theme**: Toggle between dark and light modes for comfortable viewing
- **AI Integration**: Powered by Google Generative AI and OpenAI for intelligent financial insights (if enabled)
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Protected Routes**: Secure routes that require authentication
- **Real-time Updates**: Instant updates to your transaction list

## Tech Stack

### Frontend
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Next-generation build tool
- **React Router v7** - Client-side routing
- **Axios** - HTTP client
- **ESLint** - Code linting

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Type-safe backend code
- **MongoDB** - Document database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-Origin Resource Sharing
- **Nodemon** - Development auto-reload

### AI & APIs
- **Google Generative AI** - AI-powered features

## Project Structure

```
Clarity/
├── backend/
│   ├── src/
│   │   ├── server.ts              # Express server entry point
│   │   ├── middleware/
│   │   │   └── auth.ts            # Authentication middleware
│   │   ├── models/
│   │   │   ├── User.ts            # User model/schema
│   │   │   └── Transaction.ts     # Transaction model/schema
│   │   ├── routes/
│   │   │   ├── auth.routes.ts     # Authentication endpoints
│   │   │   └── transaction.routes.ts  # Transaction endpoints
│   │   └── services/
│   │       └── ai.ts              # AI service integration
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx                # Main application component
│   │   ├── main.tsx               # React entry point
│   │   ├── types.ts               # TypeScript type definitions
│   │   ├── components/
│   │   │   ├── TransactionForm.tsx    # Form for adding transactions
│   │   │   └── TransactionList.tsx    # List of transactions
│   │   ├── context/
│   │   │   ├── AuthContext.tsx    # Authentication context
│   │   │   └── ThemeContext.tsx   # Theme context
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx      # Main dashboard page
│   │   │   ├── Login.tsx          # Login page
│   │   │   └── Signup.tsx         # Signup page
│   │   ├── services/
│   │   │   └── api.ts             # API service layer
│   │   ├── styles/                # CSS stylesheets
│   │   └── assets/
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── index.html
│
└── README.md                      # This file
```

## Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (cloud instance via MongoDB Atlas)

### Installation

1. **Clone the repository** (or extract the project)
   ```bash
   cd "Clarity"
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

## Configuration

### Backend Setup

1. **Create a `.env` file** in the `backend` directory:

   ```env
   PORT=5000
   # use MongoDB Atlas:
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/clarity
   # OR 
   # MONGODB_URI=mongodb://localhost:27017/clarity
   
   JWT_SECRET=your_jwt_secret_key_here
   
   # AI API Keys (optional)
   GOOGLE_API_KEY=your_google_api_key
   ```

   - `PORT`: Server port (default 5000)
   - `MONGODB_URI`: MongoDB connection string
   - `JWT_SECRET`: Secret key for JWT token signing (use a strong random string)
   - `GOOGLE_API_KEY`: For Google Generative AI features

2. **MongoDB Setup**
   - **Local**: Install MongoDB and ensure it's running on `localhost:27017`
   - **Cloud**: Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and use the connection string

### Frontend Setup

The frontend is configured to connect to the backend API. The API base URL is typically set to `http://localhost:5000`.

Ensure the API service in `frontend/src/services/api.ts` points to your backend server.

##  Running the Application

### Development Mode

**Terminal 1 - Start Backend Server**
```bash
cd backend
npm run dev
```
The backend server will start on `http://localhost:5000`

**Terminal 2 - Start Frontend Development Server**
```bash
cd frontend
npm run dev
```
The frontend will start on `http://localhost:3000` (or the port shown in your terminal)

## Available Scripts

### Backend

- `npm run dev` - Start development server with auto-reload
- `npm start` - Start production server
- `npm test` - Run tests (not yet configured)

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Authentication

- **Password Security**: Passwords are hashed using bcryptjs before storage
- **JWT Tokens**: Sessions are managed using JWT (JSON Web Tokens)
- **Protected Routes**: All transaction endpoints require valid authentication
- **Token Storage**: Tokens are stored securely in the browser

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create a new account
- `POST /api/auth/login` - Login with email and password

### Transactions
- `GET /api/transactions` - Get all user transactions
- `POST /api/transactions` - Create a new transaction
- `PUT /api/transactions/:id` - Update a transaction
- `DELETE /api/transactions/:id` - Delete a transaction

## Features in Detail

### Dark/Light Mode
The application includes a theme switcher that persists your preference in localStorage. Switch between dark and light themes for a comfortable experience.

### Transaction Categories
Organize your transactions by categories such as:
- Food & Dining
- Transportation
- Entertainment
- Utilities
- Salary
- Investments
- Other

### Real-time Dashboard
- View balance summary
- Track income vs. expenses
- Monitor spending trends


## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check your connection string in `.env`
- Verify network access if using MongoDB Atlas

### CORS Errors
- Verify backend is running on the correct port
- Check CORS configuration in `backend/src/server.ts`
- Ensure frontend API base URL matches backend address

### Port Already in Use
- Change the port in `.env` or `frontend/vite.config.ts`
- Kill the process using the port:
  ```bash
  # Windows
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  
  # macOS/Linux
  lsof -i :5000
  kill -9 <PID>
  ```

## Author

Created by the Aaryan Ratna Tuladhar

**Happy tracking with Clarity!**
