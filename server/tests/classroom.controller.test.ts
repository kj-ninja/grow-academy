import request from "supertest";
import app from "app";
import { PrismaClient } from "@prisma/client";
import { generateToken } from "utils";

const prisma = new PrismaClient();

describe("Classroom Controller", () => {
  const testUserId = 1;
  const testToken = generateToken(testUserId);

  beforeAll(async () => {
    // Clear related tables in the correct order
    await prisma.classroomsMembers.deleteMany();
    await prisma.classroom.deleteMany();
    await prisma.user.deleteMany();

    // Create a test user
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
    // Clear all data after tests complete
    await prisma.classroomsMembers.deleteMany();
    await prisma.classroom.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  test("Create Classroom", async () => {
    const response = await request(app)
      .post("/api/classroom")
      .set("Authorization", `Bearer ${testToken}`)
      .send({
        name: "Test Classroom",
        description: "A classroom created for testing",
        accessType: "public",
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toBe("Test Classroom");
  });

  test("Delete Classroom", async () => {
    const classroom = await prisma.classroom.create({
      data: {
        name: "Classroom to Delete",
        description: "Temporary classroom",
        ownerId: testUserId,
      },
    });

    const response = await request(app)
      .delete(`/api/classroom/${classroom.id}`)
      .set("Authorization", `Bearer ${testToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Classroom deleted successfully");
  });

  test("Join Classroom (Public)", async () => {
    const classroom = await prisma.classroom.create({
      data: {
        name: "Public Classroom",
        description: "Open to all",
        ownerId: testUserId,
        accessType: "public",
      },
    });

    const response = await request(app)
      .post(`/api/classroom/${classroom.id}/join`)
      .set("Authorization", `Bearer ${testToken}`);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Joined classroom successfully");
  });

  test("View Pending Requests", async () => {
    const classroom = await prisma.classroom.create({
      data: {
        name: "Private Classroom",
        ownerId: testUserId,
        accessType: "private",
      },
    });

    await prisma.classroomsMembers.create({
      data: {
        classroomId: classroom.id,
        userId: testUserId,
        memberShipStatus: "pending",
      },
    });

    const response = await request(app)
      .get(`/api/classroom/${classroom.id}/requests`)
      .set("Authorization", `Bearer ${testToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          userId: testUserId,
          memberShipStatus: "pending",
        }),
      ]),
    );
  });

  test("Approve Join Request", async () => {
    const classroom = await prisma.classroom.create({
      data: { name: "Approval Classroom", ownerId: testUserId },
    });

    await prisma.classroomsMembers.create({
      data: {
        classroomId: classroom.id,
        userId: testUserId,
        memberShipStatus: "pending",
      },
    });

    const response = await request(app)
      .patch(`/api/classroom/${classroom.id}/requests/${testUserId}/approve`)
      .set("Authorization", `Bearer ${testToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Join request approved");
  });

  test("Reject Join Request", async () => {
    const classroom = await prisma.classroom.create({
      data: { name: "Rejection Classroom", ownerId: testUserId },
    });

    await prisma.classroomsMembers.create({
      data: {
        classroomId: classroom.id,
        userId: testUserId,
        memberShipStatus: "pending",
      },
    });

    const response = await request(app)
      .patch(`/api/classroom/${classroom.id}/requests/${testUserId}/reject`)
      .set("Authorization", `Bearer ${testToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Join request rejected");
  });

  test("Get Classrooms (Pagination)", async () => {
    await prisma.classroom.createMany({
      data: [
        { name: "Classroom 1", ownerId: testUserId },
        { name: "Classroom 2", ownerId: testUserId },
        { name: "Classroom 3", ownerId: testUserId },
      ],
    });

    const response = await request(app)
      .get(`/api/classroom?page=1&limit=2`)
      .set("Authorization", `Bearer ${testToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("classrooms");
    expect(response.body.pagination).toHaveProperty("totalItems");
  });

  // todo: fix test
  // test("Cancel Join Request", async () => {
  //   const classroom = await prisma.classroom.create({
  //     data: {
  //       name: "Cancel Request Classroom",
  //       ownerId: testUserId,
  //       accessType: "private",
  //     },
  //   });
  //
  //   // Create a pending join request for the user
  //   await prisma.classroomsMembers.create({
  //     data: {
  //       classroomId: classroom.id,
  //       userId: testUserId,
  //       memberShipStatus: "pending",
  //     },
  //   });
  //
  //   // Debug: Check that the join request exists in the database
  //   const pendingRequest = await prisma.classroomsMembers.findMany({
  //     where: {
  //       classroomId: classroom.id,
  //       userId: testUserId,
  //       memberShipStatus: "pending",
  //     },
  //   });
  //   console.log("Pending Request Before Cancel:", pendingRequest);
  //
  //   const response = await request(app)
  //     .delete(`/api/classroom/${classroom.id}/cancel-request`)
  //     .set("Authorization", `Bearer ${testToken}`);
  //
  //   expect(response.status).toBe(200);
  //   expect(response.body.message).toBe("Join request canceled successfully");
  // });
});
