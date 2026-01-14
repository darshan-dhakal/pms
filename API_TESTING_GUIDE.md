# API Testing Guide - Project Management System

## Setup Instructions

### 1. Start Backend Server
```bash
cd server
npm run dev
```
✅ Backend will run on: `http://localhost:3000/api`

### 2. Start Frontend Server
```bash
cd client
npm run dev
```
✅ Frontend will run on: `http://localhost:5173`

---

## Complete Authentication Flow

### Test Case 1: Register New User
**Step 1: Navigate to Register Page**
- URL: `http://localhost:5173/register`

**Step 2: Fill Registration Form**
```
First Name: John
Last Name: Doe
Email: john@example.com
Password: Password123
Confirm Password: Password123
```

**Step 3: Click "Register"**
- ✅ Expected: Success message → Redirects to `/login`
- ✅ Backend response: 201 Created with verification message
- ❌ If error: Check browser console for error message

**What Happens Behind the Scenes:**
```
1. Form validation (client-side)
2. POST /register endpoint called
3. Redux state updated with success/error
4. Navigation to /login
```

---

### Test Case 2: Login with Registered User
**Step 1: Navigate to Login Page**
- URL: `http://localhost:5173/login`

**Step 2: Fill Login Form**
```
Email: john@example.com
Password: Password123
```

**Step 3: Click "Login"**
- ✅ Expected: Token stored → Redirects to `/dashboard`
- ✅ Check DevTools → Application → LocalStorage → `authToken`
- ✅ Should see: JWT token (long string starting with `eyJ`)

**What Happens Behind the Scenes:**
```
1. POST /login called with email/password
2. Backend returns: { user, token }
3. Redux: setUser() + setToken() dispatched
4. localStorage.authToken set
5. Axios interceptor updated with token
6. Navigation to /dashboard
```

---

### Test Case 3: Access Protected Dashboard
**Step 1: After Login (Automatic)**
- ✅ Expected: Dashboard page loads with:
  - AppBar with user name and logout button
  - Sidebar with menu items
  - Main content area

**Step 2: Check User Menu**
- Click user avatar in top-right
- ✅ Expected: Dropdown with "Profile" and "Logout" options

**Step 3: Click "Logout"**
- ✅ Expected: Redirects to `/login`
- ✅ localStorage.authToken cleared
- ✅ Redux state reset

---

### Test Case 4: Protected Route Access Control
**Step 1: Without Token (Logged Out)**
- Try accessing: `http://localhost:5173/dashboard`
- ✅ Expected: Auto-redirects to `/login`

**Step 2: With Token (Logged In)**
- After login, access: `http://localhost:5173/dashboard`
- ✅ Expected: Dashboard loads normally

---

## API Endpoints Reference

### Authentication
| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| POST | `/register` | `{ firstName, lastName, email, password }` | `{ user, token }` |
| POST | `/login` | `{ email, password }` | `{ user, token }` |
| POST | `/verify-email` | `{ email, token }` | `{ message }` |
| POST | `/forgot-password` | `{ email }` | `{ message }` |
| POST | `/reset-password` | `{ token, newPassword }` | `{ message }` |

### Users (Protected)
| Method | Endpoint | Headers | Response |
|--------|----------|---------|----------|
| GET | `/users/profile` | Bearer token | `{ user }` |
| GET | `/users` | Bearer token (Admin) | `{ users }` |
| GET | `/users/:id` | Bearer token (Admin) | `{ user }` |

### Projects (Protected)
| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| POST | `/projects` | `{ name, description, teamId }` | `{ project }` |
| GET | `/projects` | - | `{ projects, total }` |
| GET | `/projects/:id` | - | `{ project }` |
| PATCH | `/projects/:id` | `{ name, description }` | `{ project }` |
| DELETE | `/projects/:id` | - | `{ message }` |

### Tasks (Protected)
| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| POST | `/tasks` | `{ title, description, projectId, assignedToId }` | `{ task }` |
| GET | `/tasks` | - | `{ tasks, total }` |
| GET | `/tasks/project/:id` | - | `{ tasks, total }` |
| PATCH | `/tasks/:id` | `{ title, isCompleted }` | `{ task }` |
| DELETE | `/tasks/:id` | - | `{ message }` |

### Teams (Protected)
| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| POST | `/teams` | `{ name, description }` | `{ team }` |
| GET | `/teams` | - | `{ teams, total }` |
| GET | `/teams/:id` | - | `{ team }` |
| PATCH | `/teams/:id` | `{ name, description }` | `{ team }` |
| DELETE | `/teams/:id` | - | `{ message }` |

---

## Browser DevTools Checklist

### 1. Network Tab
- Open DevTools (F12) → Network tab
- Register and login
- Look for:
  - ✅ `POST /register` → Response 201
  - ✅ `POST /login` → Response 200 with token
  - ✅ `GET /dashboard` → Includes `Authorization: Bearer {token}`

### 2. Application Tab
- Open DevTools → Application → Storage → LocalStorage
- After login, verify:
  - ✅ `authToken` key exists
  - ✅ Value is JWT token (starts with `eyJ`)
  - ✅ Token clears on logout

### 3. Console Tab
- Check for errors during:
  - Registration form submission
  - Login form submission
  - Dashboard redirect
  - Logout action

---

## Troubleshooting

### Problem: "Cannot reach API"
```
Error: Network request failed
```
**Solution:**
1. Verify backend running: `http://localhost:3000/api`
2. Check `.env` file: `VITE_API_BASE_URL=http://localhost:3000/api`
3. Restart backend: `npm run dev`

### Problem: "401 Unauthorized"
```
Error: Unauthorized
```
**Solution:**
1. Check token in localStorage
2. Verify token format (should start with `eyJ`)
3. Login again to get fresh token

### Problem: "CORS Error"
```
Access to XMLHttpRequest blocked by CORS
```
**Solution:**
1. Backend CORS must allow `http://localhost:5173`
2. Check backend [server/src/index.ts](server/src/index.ts) for CORS config

### Problem: "Form not submitting"
**Solution:**
1. Check console for validation errors
2. Verify all required fields filled
3. Password must be ≥8 characters
4. Passwords must match on register

---

## Frontend Code Structure

### Services Layer (`src/services/`)
- `api.ts` - Axios client with JWT interceptor
- `auth.service.ts` - Register, login, logout methods
- `user.service.ts` - User management endpoints
- `team.service.ts` - Team CRUD operations
- `project.service.ts` - Project management
- `task.service.ts` - Task management

### State Management (`src/store/`)
- `authSlice.ts` - Redux slice for user/token/loading/error
- `index.ts` - Redux store configuration

### Custom Hooks (`src/hooks/`)
- `useAuth.ts` - Hook for login(), register(), logout()

### Pages (`src/pages/`)
- `Login.tsx` - Login form with email/password
- `Register.tsx` - Registration form with validation
- `Dashboard.tsx` - Protected dashboard page

---

## Success Indicators

✅ **Registration Works When:**
- Form accepts valid input
- POST /register succeeds (201)
- Page redirects to /login
- No console errors

✅ **Login Works When:**
- Form accepts valid credentials
- POST /login succeeds (200)
- Token stored in localStorage
- Page redirects to /dashboard
- Authorization header auto-added to requests

✅ **Dashboard Works When:**
- Redirects from /dashboard to /login without token
- Displays after successful login
- User can logout
- Token cleared from localStorage on logout

✅ **API Integration Complete When:**
- All 3 test cases pass
- No CORS errors
- No 401 errors after login
- Browser DevTools shows proper headers

---

## Next Steps

After successful auth testing:
1. Build Teams management pages
2. Build Projects management pages
3. Build Tasks management pages
4. Implement CRUD operations for each resource
5. Add search and filtering
6. Add pagination to list pages

