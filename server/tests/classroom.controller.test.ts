import request from "supertest";
import app from "app";
import { PrismaClient } from "@prisma/client";
import { generateToken } from "utils";
import { createStreamChannel } from "services/streamService";

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
    expect(response.body.data).toHaveProperty("id");
    expect(response.body.data.name).toBe("Test Classroom");
    expect(response.body.message).toBe("Classroom created successfully");
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
    const channelId = `classroom-public-${Date.now()}`;
    const classroom = await prisma.classroom.create({
      data: {
        name: "Public Classroom",
        description: "Open to all",
        ownerId: testUserId,
        accessType: "public",
        getStreamChannel: channelId, // Store the channel ID
      },
    });

    // Create Stream channel before attempting to join
    await createStreamChannel(channelId, "Public Classroom", testUserId);

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
    expect(response.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          userId: testUserId,
          memberShipStatus: "pending",
        }),
      ]),
    );
    expect(response.body.message).toBe("Pending requests fetched successfully");
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
    expect(response.body.data).toHaveProperty("classrooms");
    expect(response.body.data).toHaveProperty("pagination");
    expect(response.body.data.classrooms.length).toBeGreaterThan(0);
    expect(response.body.message).toBe("Classrooms fetched successfully");
  });

  test("Get Classrooms with Members Count", async () => {
    // Create a second user to use in the classroomsMembers
    const secondUser = await prisma.user.create({
      data: {
        username: "seconduser",
        password: "hashedpassword",
        role: "user",
      },
    });

    // Create multiple classrooms with members
    const classroom1 = await prisma.classroom.create({
      data: { name: "Classroom with Members 1", ownerId: testUserId },
    });

    const classroom2 = await prisma.classroom.create({
      data: { name: "Classroom with Members 2", ownerId: testUserId },
    });

    // Add members to classrooms
    await prisma.classroomsMembers.createMany({
      data: [
        {
          classroomId: classroom1.id,
          userId: testUserId,
          memberShipStatus: "approved",
        },
        {
          classroomId: classroom1.id,
          userId: secondUser.id,
          memberShipStatus: "approved",
        },
        {
          classroomId: classroom2.id,
          userId: testUserId,
          memberShipStatus: "approved",
        },
      ],
    });

    const response = await request(app)
      .get(`/api/classroom?page=1&limit=2`)
      .set("Authorization", `Bearer ${testToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data.classrooms).toBeDefined();
    expect(response.body.data.classrooms.length).toBeGreaterThan(0);

    response.body.data.classrooms.forEach((classroom: any) => {
      expect(classroom).toHaveProperty("membersCount");
      expect(typeof classroom.membersCount).toBe("number");
    });
    expect(response.body.message).toBe("Classrooms fetched successfully");
  });

  test("Get Only Owned Classrooms (owner=true)", async () => {
    // Create a classroom owned by another user
    const otherUser = await prisma.user.create({
      data: { username: "otheruser", password: "hashedpassword", role: "user" },
    });

    await prisma.classroom.create({
      data: { name: "Classroom by Other User", ownerId: otherUser.id },
    });

    // Create classrooms owned by the test user
    await prisma.classroom.create({
      data: { name: "Owned Classroom 1", ownerId: testUserId },
    });
    await prisma.classroom.create({
      data: { name: "Owned Classroom 2", ownerId: testUserId },
    });

    // Fetch classrooms with the owner filter
    const response = await request(app)
      .get(`/api/classroom?page=1&limit=10&owner=true`)
      .set("Authorization", `Bearer ${testToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data.classrooms).toBeDefined();
    expect(response.body.data.classrooms.length).toBeGreaterThan(0);

    response.body.data.classrooms.forEach((classroom: any) => {
      expect(classroom.ownerId).toBe(testUserId);
    });
    expect(response.body.message).toBe("Classrooms fetched successfully");
  });

  test("Cancel Join Request", async () => {
    // Step 1: Create a classroom with User 1 as the owner
    const classroom = await prisma.classroom.create({
      data: {
        name: "Cancel Request Classroom",
        ownerId: testUserId,
        accessType: "private",
      },
    });

    // Step 2: Create a second user (User 2) with a unique username
    const secondUser = await prisma.user.create({
      data: {
        username: `seconduser_${Date.now()}`,
        password: "hashedpassword",
        role: "user",
      },
    });

    // Generate a token for User 2 to use in requests
    const secondUserToken = generateToken(secondUser.id);

    // Step 3: User 2 submits a join request to User 1's classroom
    await prisma.classroomsMembers.create({
      data: {
        classroomId: classroom.id,
        userId: secondUser.id,
        memberShipStatus: "pending",
      },
    });

    // Debug: Verify that the pending request exists in the database before cancellation
    await prisma.classroomsMembers.findMany({
      where: {
        classroomId: classroom.id,
        userId: secondUser.id,
        memberShipStatus: "pending",
      },
    });

    // Step 4: User 2 cancels the join request
    const response = await request(app)
      .delete(`/api/classroom/${classroom.id}/join`)
      .set("Authorization", `Bearer ${secondUserToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Join request canceled successfully");
  });
});
