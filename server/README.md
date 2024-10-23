# server

To install dependencies:

```bash
bun install
```

### Prisma Setup

1. **Run Prisma Migrations**:

   ```bash
   npx prisma migrate dev --name init
   ```

2. **Open Prisma Studio** (for managing database visually):
   ```bash
   npx prisma studio
   ```

This project was created using `bun init` in bun v1.1.20. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
