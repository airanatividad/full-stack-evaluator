## What I implemented
 - Set up database connection string
 - Added CORS policy to allow frontend requests
 - Added task DTOs for create and retrieve operations
 - Added task service to separate task-related business logic from the controller
 - Updated `TasksController` to use `TasksService`
 - Created frontend CRUD functions for tasks
 - Integrated CRUD functions with the task UI
 - Added styling

## What’s missing
- User-facing error notification
- Additional UX features (filtering, sorting, etc.)

## How to test

### Backend
- Create a `.env` file in the `backend` folder with your frontend URL
- Install/run the API: `dotnet run` (ensure .NET SDK is installed)

### Frontend
- Create a `.env` file in the `frontend` folder with your backend URL
- Install and run the frontend:
  - `npm install`
  - `npm run dev