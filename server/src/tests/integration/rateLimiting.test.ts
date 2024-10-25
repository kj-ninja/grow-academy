import request from "supertest";
import app from "../../app";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

beforeAll(async () => {
  // Clean up existing test user, if any, and seed a new user
  await prisma.user.deleteMany({ where: { username: "testuser" } });

  const hashedPassword = await bcrypt.hash("password123", 10);
  await prisma.user.create({
    data: { username: "testuser", password: hashedPassword },
  });
});

afterAll(async () => {
  // Disconnect the Prisma Client
  await prisma.$disconnect();
});

describe("Rate Limiting", () => {
  it("should allow a single request", async () => {
    const res = await request(app).post("/api/auth/login").send({
      username: "testuser",
      password: "password123",
    });
    expect(res.status).toBe(200);
  });

  it("should return 429 when rate limit is exceeded", async () => {
    for (let i = 0; i < 5; i++) {
      await request(app).post("/api/auth/login").send({
        username: "testuser",
        password: "password123",
      });
    }
    const res = await request(app).post("/api/auth/login").send({
      username: "testuser",
      password: "password123",
    });

    console.log("Response Body:", res.body);

    expect(res.status).toBe(429);
    expect(res.body.message).toContain("Too many requests");
  });
});
