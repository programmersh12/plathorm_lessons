# Learning Platform Frontend

This is the React frontend for the online learning platform.

## Features

- User authentication (login/register)
- JWT token management
- Protected routes
- Dashboard with user statistics
- Course browsing
- Profile management
- Responsive design

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root of the client directory:
```env
REACT_APP_API_URL=http://localhost:5000
```

3. Start the development server:
```bash
npm start
```

## Folder Structure

```
src/
├── components/     # Reusable UI components
├── context/        # React Context providers
├── pages/          # Page components
├── App.js          # Main application component
├── App.css         # Global styles
└── index.js        # Entry point
```

## Key Components

- `AuthContext`: Manages authentication state and user data
- `ProtectedRoute`: Component that restricts access to authenticated users
- `Navbar`: Navigation component that shows different links based on auth status
- `Login`: Login form with authentication
- `Register`: Registration form with validation
- `Dashboard`: User dashboard with statistics

## API Integration

The frontend communicates with the backend API at the URL specified in `REACT_APP_API_URL`. All authenticated requests include the JWT token in the Authorization header.

## Environment Variables

- `REACT_APP_API_URL`: Base URL for the backend API (defaults to http://localhost:5000)