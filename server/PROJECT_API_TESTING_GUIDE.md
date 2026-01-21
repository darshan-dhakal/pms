# Project API Testing Guide

## Overview
This guide walks you through testing the Project Management API endpoints using Postman.

---

## Prerequisites

1. **Server Running**: Make sure your server is running on `http://localhost:3000`
2. **Authentication**: You need a valid JWT token (login first)
3. **Postman Collection**: Import `postman_collection.json`

---

## Step-by-Step Testing

### 1. Authentication (Required First)

#### Register & Login
```json
POST /api/register
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "Test@12345"
}
```

```json
POST /api/login
{
  "email": "john@example.com",
  "password": "Test@12345"
}
```

**Save the token** from login response - it auto-saves to `{{authToken}}`.

---

### 2. Create a Project

```json
POST /api/projects
Authorization: Bearer {{authToken}}

{
  "name": "E-Commerce Platform",
  "description": "Building a modern e-commerce solution",
  "organizationId": "org-123",
  "startDate": "2026-02-01",
  "endDate": "2026-12-31"
}
```

**Expected Response:**
```json
{
  "message": "Project created successfully",
  "project": {
    "id": "uuid-here",
    "name": "E-Commerce Platform",
    "status": "DRAFT",
    "ownerId": "your-user-id",
    "progress": 0,
    "totalTasks": 0,
    "completedTasks": 0
  }
}
```

**Save the `project.id`** for next steps.

---

### 3. Get Project Details

```http
GET /api/projects/:id
Authorization: Bearer {{authToken}}
```

Returns full project with members and tasks.

---

### 4. Change Project Status

```json
PATCH /api/projects/:id/status
Authorization: Bearer {{authToken}}

{
  "status": "PLANNED"
}
```

**Allowed Transitions:**
- `DRAFT` → `PLANNED`, `ARCHIVED`
- `PLANNED` → `ACTIVE`, `DRAFT`, `ARCHIVED`
- `ACTIVE` → `ON_HOLD`, `COMPLETED`, `ARCHIVED`
- `ON_HOLD` → `ACTIVE`, `ARCHIVED`
- `COMPLETED` → `ARCHIVED`

**Try Invalid Transition (should fail):**
```json
{
  "status": "COMPLETED"  // Cannot jump from DRAFT to COMPLETED
}
```

---

### 5. Add Member to Project

```json
POST /api/projects/:id/members
Authorization: Bearer {{authToken}}

{
  "userId": "another-user-id",
  "role": "MEMBER"
}
```

**Available Roles:**
- `OWNER` - Full control
- `MANAGER` - Can add members, change status, update
- `MEMBER` - Can update project
- `VIEWER` - Read-only

---

### 6. Update Project

```json
PATCH /api/projects/:id
Authorization: Bearer {{authToken}}

{
  "name": "Updated Project Name",
  "description": "New description",
  "endDate": "2027-01-31"
}
```

---

### 7. Remove Project Member

```http
DELETE /api/projects/:id/members/:userId
Authorization: Bearer {{authToken}}
```

**Note**: Cannot remove the project owner.

---

### 8. Archive Project

```json
POST /api/projects/:id/archive
Authorization: Bearer {{authToken}}
```

**Only OWNER can archive**. Archived projects become read-only.

---

## Error Scenarios to Test

### 1. Unauthorized Access
Try accessing a project you're not a member of:
```http
GET /api/projects/some-other-project-id
```
Expected: `403 Forbidden`

### 2. Invalid Status Transition
```json
PATCH /api/projects/:id/status
{
  "status": "COMPLETED"  // From DRAFT
}
```
Expected: `400 Bad Request` - "Cannot transition project from DRAFT to COMPLETED"

### 3. Add Duplicate Member
Add the same user twice:
```json
POST /api/projects/:id/members
{
  "userId": "same-user-id",
  "role": "MEMBER"
}
```
Expected: `409 Conflict` - "User already a member"

### 4. Update Archived Project
Archive a project, then try to update it:
```json
PATCH /api/projects/:id
{
  "name": "New Name"
}
```
Expected: `400 Bad Request` - "Cannot modify an archived project"

### 5. Missing Required Fields
```json
POST /api/projects
{
  "name": "Project Name"
  // Missing organizationId
}
```
Expected: `400 Bad Request`

---

## Permission Matrix

| Action | OWNER | MANAGER | MEMBER | VIEWER |
|--------|-------|---------|--------|--------|
| Update Project | ✅ | ✅ | ✅ | ❌ |
| Change Status | ✅ | ✅ | ❌ | ❌ |
| Add Member | ✅ | ✅ | ❌ | ❌ |
| Remove Member | ✅ | ❌ | ❌ | ❌ |
| Archive Project | ✅ | ❌ | ❌ | ❌ |
| Delete Project | ✅ | ❌ | ❌ | ❌ |

---

## Testing Workflow Example

1. **Create Project** (status: DRAFT)
2. **Add 2 members** (1 Manager, 1 Member)
3. **Change status to PLANNED**
4. **Change status to ACTIVE**
5. **Add some tasks** (use Task API)
6. **Update project progress**
7. **Complete all mandatory tasks**
8. **Change status to COMPLETED**
9. **Archive the project**

---

## Tips

- Use Postman **environment variables** to store IDs
- Check the **response status codes**
- Review **audit logs** in console (server-side)
- Test with **multiple users** for permission testing

---

## Common Issues

### "Authentication required"
- Make sure you're logged in
- Check if token is set: `{{authToken}}`
- Token might be expired - login again

### "Project not found"
- Check project ID is correct
- Project might be soft-deleted

### "Unauthorized to ... this project"
- You're not a member of the project
- Your role doesn't have permission

---

## Next Steps

After Projects API works:
1. Test **Task API** (create tasks within projects)
2. Test **Activity Logs** (check audit trail)
3. Test **Project Metrics** (progress calculation)
4. Test **Concurrent Updates** (multiple users)

---

## Support

If you encounter issues:
1. Check server console logs
2. Check network tab in Postman
3. Verify database state
4. Review error responses carefully
