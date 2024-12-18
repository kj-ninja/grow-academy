# Grow Academy

## Overview

Community / tutoring platform for sharing knowledge in different science topics. This project is a full-stack application built using Vite for the frontend and TypeScript-powered Express server with Prisma ORM and JWT-based authentication. It leverages a modular structure with shared logic between the client and server.

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

- Video calls - **livekit sdk**
- Live streams - **livekit sdk**
- Board chat - **getStream sdk**
- Authentication for users
- Community creation flow
- Resources sharing
- User / Community settings
- Members mamagement
- Onboarding

## How to Run the Project

### Prerequisites

- **Node.js** and **Bun** installed on your machine.

### Installation

1. Clone the repository:

   ```bash
   git clone <repository_url>
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

## Additional Commands

### Formatting with Prettier

Run the Prettier formatter to maintain consistent code style:

```bash
bun run prettier --write .
```

### Running Tests

To run the test suite using Jest:

```bash
bun run test
```
