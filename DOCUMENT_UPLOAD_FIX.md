# Document Upload Fix

## Issue
The documents page was unable to upload any documents due to authentication mismatch.

## Root Cause
The document routes were using the old JWT-based authentication middleware (`protect`) which expected tokens signed with `JWT_SECRET`. However, the frontend was using Clerk authentication, and the backend had already migrated to Clerk for other routes.

## Changes Made

### 1. Updated Document Routes (`backend/src/routes/documentRoutes.js`)
- **Before**: Used `protect` middleware from `../middleware/auth.js`
- **After**: Now uses `protectWithClerk` middleware from `../middleware/clerkAuth.js`

### 2. Updated Document Controller (`backend/src/controllers/documentController.js`)
Changed all references from `req.user._id` to `req.dbUser._id` in the following functions:
- `uploadDocument` - Lines 22, 26
- `getDocuments` - Line 105
- `getDocumentById` - Line 134
- `deleteDocument` - Line 162
- `getDocumentVectors` - Line 197

## How It Works Now
1. Frontend sends Clerk token via `Authorization: Bearer <token>` header
2. Global `clerkAuth` middleware (applied in `server.js`) validates the Clerk token
3. `syncUser` middleware creates/updates user in database and sets `req.dbUser`
4. `protectWithClerk` middleware ensures the route is protected
5. Document controller uses `req.dbUser._id` to associate documents with the authenticated user

## Testing
- Backend server restarted successfully on port 5002
- MongoDB connected successfully
- Health endpoint responding correctly

## Next Steps
You can now test document upload by:
1. Navigate to the Documents page in the frontend
2. Drag and drop a PDF file or click to browse
3. The upload should now work with proper Clerk authentication
