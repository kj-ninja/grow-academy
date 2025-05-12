# Grow Academy

## Overview

Classroom / tutoring platform for sharing knowledge in different science topics. This project is a full-stack application built using Vite for the frontend and TypeScript-powered Express server with Prisma ORM and JWT-based authentication.
Real-time communication handled by socket.io and getStream SDK.

## Tech Stack

### Frontend (Client)

- **Vite**: For fast development and optimized builds.
- **React + TypeScript**: The core of the frontend.
- **State Management**: Zustand and Context API.
- **Form Management**: React Hook Form and Zod for validation.
- **Data Fetching**: React Query and Axios.
- **UI Framework**: Shadcn components with Tailwind CSS.
- **Routing**: React Router.

### Backend (Server)

- **Express.js**: For API routes and server-side logic.
- **Prisma + SQLite**: ORM for database interactions, with SQLite for local development.
- **Authentication**: Passport.js with JWT support.

## Main Features:

- Classroom chat - **getStream sdk**
- Classroom members management
- Realtime connection - **socket.io**
- Authentication for users
- Classroom creation flow
- Resources sharing
- User / Community settings
- Onboarding

## How to Run the Project

### Prerequisites

- **Node.js** and **Bun** installed on your machine.

### Installation

1. Clone the repository:

   ```bash
   git clone git@github.com:kj-ninja/grow-academy.git
   ```

2. Navigate to the project directory:

   ```bash
   cd grow-academy
   ```

3. Install dependencies:

   ```bash
   bun install
   ```

4. Run the development environment:

   ```bash
   bun run deploy
   ```

5. Visit http://localhost:4000 to see the app in action.

### Prisma Setup

1. **Run Prisma Migrations**:

   ```bash
   npx prisma migrate dev --name init
   ```

2. **Open Prisma Studio** (for managing database visually):

   ```bash
   npx prisma studio
   ```

3. **Generate Prisma Client** (updates TypeScript types after schema changes):

   ```bash
   npx prisma generate
   ```

4. **Apply Schema Changes** (quickly push changes during development):

   ```bash
   npx prisma db push
   ```

5. **Reset Database** (clears data, applies migrations, and runs seeds):

   ```bash
   npx prisma migrate reset
   ```

6. **Validate Schema** (checks if your schema file is valid):

   ```bash
   npx prisma validate
   ```

7. **Format Schema** File (maintains consistent styling):

   ```bash
   npx prisma format
   ```

8. **Pull Database Schema** (creates schema file from existing database):

   ```bash
   npx prisma db pull
   ```

9. **Show Migrations History** (displays applied and pending migrations):

   ```bash
   npx prisma migrate status
   ```

10. **Deploy Migrations** (applies migrations in production):

    ```bash
    npx prisma migrate deploy
    ```

## Additional Commands

### Formatting with Prettier

```bash
bun run prettier --write .
```

### Running Tests

To run the test suite using Jest:

```bash
bun run test
```
