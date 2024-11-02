import request from "supertest";
import app from "app";
import { PrismaClient } from "@prisma/client";
import { generateToken } from "utils";

const prisma = new PrismaClient();

describe("User Controller", () => {
  const testUserId = 1;
  const testToken = generateToken(testUserId);

  beforeAll(async () => {
    await prisma.user.deleteMany();
    await prisma.user.create({
      data: {
        id: testUserId,
        username: "testuser",
        password: "hashedpassword",
        role: "user",
      },
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  test("Update User Profile", async () => {
    const response = await request(app)
      .patch("/api/user/update")
      .set("Authorization", `Bearer ${testToken}`)
      .field("firstName", "UpdatedFirst")
      .field("lastName", "UpdatedLast")
      .field("bio", "This is an updated bio");

    expect(response.status).toBe(201);
    expect(response.body.firstName).toBe("UpdatedFirst");
    expect(response.body.lastName).toBe("UpdatedLast");
    expect(response.body.bio).toBe("This is an updated bio");
    expect(response.body).not.toHaveProperty("password");
  });

  test("Update User with Avatar Image", async () => {
    const response = await request(app)
      .patch("/api/user/update")
      .set("Authorization", `Bearer ${testToken}`)
      .field("firstName", "ImageUser")
      .attach("avatarImage", Buffer.from("sampleImageBuffer"), {
        filename: "avatar.png",
        contentType: "image/png",
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("avatarImage");
    expect(response.body.avatarImage).toHaveProperty("type", "Buffer");
    expect(response.body.avatarImage).toHaveProperty("data");

    const expectedBuffer = Buffer.from("sampleImageBuffer");
    expect(Buffer.from(response.body.avatarImage.data)).toEqual(expectedBuffer);
  });

  test("Handle Missing Fields Gracefully", async () => {
    const response = await request(app)
      .patch("/api/user/update")
      .set("Authorization", `Bearer ${testToken}`);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("firstName", null);
    expect(response.body).toHaveProperty("lastName", null);
    expect(response.body).toHaveProperty("bio", null);
  });
});
