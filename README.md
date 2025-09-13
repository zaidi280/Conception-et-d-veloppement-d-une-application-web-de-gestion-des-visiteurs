# Frontend Web App with JWT Authentication

A React application with JWT authentication that integrates with a Spring Boot backend.

## Features

- 🔐 JWT-based authentication
- 🛡️ Protected routes
- 📱 Responsive design with Bootstrap
- ⚡ Fast development with Vite
- 🎨 Modern UI components with React Bootstrap

## Tech Stack

- **Frontend**: React 19, React Router DOM, React Bootstrap
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **Styling**: Bootstrap 5
- **Backend**: Spring Boot (JWT authentication)

## Project Structure

```
src/
├── components/
│   ├── authentification/
│   │   ├── Login.jsx          # Login form component
│   │   └── Logout.jsx         # Logout component
│   ├── Dashboard.jsx          # Main dashboard component
│   └── ProtectedRoute.jsx     # Route protection wrapper
├── contexts/
│   └── AuthContext.jsx        # Authentication context provider
├── services/
│   └── authService.js         # API service for authentication
├── config/
│   └── config.js              # Application configuration
├── App.jsx                    # Main app component with routing
└── main.jsx                   # App entry point
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Spring Boot backend running on port 8080

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment file:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your backend URL:
   ```
   VITE_API_BASE_URL=http://localhost:8080
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`.

## Authentication Flow

1. **Login**: User enters username/password
2. **Backend Validation**: Credentials sent to Spring Boot `/auth/login` endpoint
3. **JWT Token**: Backend returns JWT token on successful authentication
4. **Token Storage**: JWT stored in localStorage
5. **Protected Access**: Token included in subsequent API requests
6. **Auto-logout**: User redirected to login on token expiration

## API Integration

The frontend expects your Spring Boot backend to have:

- **Login Endpoint**: `POST /auth/login`
  ```json
  // Request
  {
    "username": "your_username",
    "password": "your_password"
  }

  // Response
  {
    "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

## Components Overview

### AuthContext
Provides global authentication state management using React Context API.

### Login Component
- Responsive login form
- Form validation
- Error handling
- Loading states
- Automatic redirect after successful login

### ProtectedRoute Component
- Wraps components that require authentication
- Redirects to login if not authenticated
- Shows loading spinner during auth check

### Dashboard Component
- Example protected component
- Displays user information
- Navigation with logout functionality

## Configuration

### Environment Variables

- `VITE_API_BASE_URL`: Backend API base URL
- `VITE_APP_NAME`: Application name
- `VITE_APP_VERSION`: Application version

### Authentication Service

The `authService.js` handles:
- Login/logout operations
- JWT token management
- API request interceptors
- Token expiration handling

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Security Features

- JWT tokens stored in localStorage
- Automatic token inclusion in API requests
- Token expiration handling
- Protected route access control
- Automatic logout on authentication errors

## Customization

### Styling
The app uses Bootstrap 5 and React Bootstrap. You can customize:
- Colors and themes in CSS files
- Bootstrap variables
- Component styling

### API Configuration
Update `src/config/config.js` to modify:
- API endpoints
- Storage keys
- Application settings

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure your Spring Boot backend allows requests from `http://localhost:3000`
2. **Login Fails**: Check backend URL in `.env` file
3. **Token Issues**: Clear localStorage and try again

### Backend CORS Configuration

Add this to your Spring Boot application:

```java
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/auth")
public class AuthController {
    // Your existing code
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request
