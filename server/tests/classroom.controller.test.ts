import request from "supertest";
import app from "app";
import { PrismaClient } from "@prisma/client";
import { generateToken } from "utils";
import { createStreamChannel } from "services/Stream";

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
        classroomName: "Test Classroom",
        handle: "Test_Classroom",
        description: "A classroom created for testing",
        accessType: "public",
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("handle");
    expect(response.body).toHaveProperty("getStreamChannelId");
    expect(response.body.classroomName).toBe("Test Classroom");
    expect(response.body.handle).toBe("Test_Classroom");
  });

  test("Delete Classroom", async () => {
    const classroom = await prisma.classroom.create({
      data: {
        classroomName: "Classroom to Delete",
        handle: "Classroom_to_Delete",
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
        classroomName: "Public Classroom",
        handle: "Public_Classroom",
        description: "Open to all",
        ownerId: testUserId,
        accessType: "public",
        getStreamChannelId: channelId,
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
        classroomName: "Private Classroom",
        handle: "Private_Classroom",
        ownerId: testUserId,
        accessType: "Private",
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
      data: {
        classroomName: "Approval Classroom",
        handle: "Approval_Classroom",
        ownerId: testUserId,
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
      .patch(`/api/classroom/${classroom.id}/requests/${testUserId}/approve`)
      .set("Authorization", `Bearer ${testToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Join request approved");
  });

  test("Reject Join Request", async () => {
    const classroom = await prisma.classroom.create({
      data: {
        classroomName: "Rejection Classroom",
        handle: "Rejection_Classroom",
        ownerId: testUserId,
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
      .patch(`/api/classroom/${classroom.id}/requests/${testUserId}/reject`)
      .set("Authorization", `Bearer ${testToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Join request rejected");
  });

  test("Cancel Join Request", async () => {
    // Step 1: Create a classroom with User 1 as the owner
    const classroom = await prisma.classroom.create({
      data: {
        classroomName: "Cancel Request Classroom",
        handle: "Cancel_Request_Classroom",
        ownerId: testUserId,
        accessType: "Private",
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

  test("Get Classrooms (Pagination)", async () => {
    await prisma.classroom.createMany({
      data: [
        {
          classroomName: "Classroom 1",
          handle: "Classroom_1",
          ownerId: testUserId,
        },
        {
          classroomName: "Classroom 2",
          handle: "Classroom_2",
          ownerId: testUserId,
        },
        {
          classroomName: "Classroom 3",
          handle: "Classroom_3",
          ownerId: testUserId,
        },
      ],
    });

    const response = await request(app)
      .get(`/api/classroom?page=1&limit=2`)
      .set("Authorization", `Bearer ${testToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("classrooms");
    expect(response.body).toHaveProperty("pagination");
    expect(response.body.classrooms.length).toBeGreaterThan(0);
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
      data: {
        classroomName: "Classroom with Members 1",
        handle: "Classroom_with_Members 1",
        ownerId: testUserId,
      },
    });

    const classroom2 = await prisma.classroom.create({
      data: {
        classroomName: "Classroom with Members 2",
        handle: "Classroom_with_Members 2",
        ownerId: testUserId,
      },
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
    expect(response.body.classrooms).toBeDefined();
    expect(response.body.classrooms.length).toBeGreaterThan(0);

    response.body.classrooms.forEach((classroom: any) => {
      expect(classroom).toHaveProperty("membersCount");
      expect(typeof classroom.membersCount).toBe("number");
    });
  });

  test("Get Only Owned Classrooms (owner=true)", async () => {
    // Create a classroom owned by another user
    const otherUser = await prisma.user.create({
      data: { username: "otheruser", password: "hashedpassword", role: "user" },
    });

    await prisma.classroom.create({
      data: {
        classroomName: "Classroom by Other User",
        handle: "Classroom_by_Other_User",
        ownerId: otherUser.id,
      },
    });

    // Create classrooms owned by the test user
    await prisma.classroom.create({
      data: {
        classroomName: "Owned Classroom 1",
        handle: "Owned_Classroom_1",
        ownerId: testUserId,
      },
    });
    await prisma.classroom.create({
      data: {
        classroomName: "Owned Classroom 2",
        handle: "Owned_Classroom_2",
        ownerId: testUserId,
      },
    });

    // Fetch classrooms with the owner filter
    const response = await request(app)
      .get(`/api/classroom?page=1&limit=10&owner=true`)
      .set("Authorization", `Bearer ${testToken}`);

    expect(response.status).toBe(200);
    expect(response.body.classrooms).toBeDefined();
    expect(response.body.classrooms.length).toBeGreaterThan(0);

    response.body.classrooms.forEach((classroom: any) => {
      expect(classroom.ownerId).toBe(testUserId);
    });
  });

  test("User not a member should have isPendingRequest: false", async () => {
    const classroom = await prisma.classroom.create({
      data: {
        classroomName: "Non-member Classroom",
        handle: "Non_Member_Classroom",
        ownerId: testUserId,
      },
    });

    const response = await request(app)
      .get(`/api/classroom/${classroom.id}/details`)
      .set("Authorization", `Bearer ${testToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty("isPendingRequest", false);
  });

  test("User with pending join request should have isPendingRequest: true", async () => {
    const classroom = await prisma.classroom.create({
      data: {
        classroomName: "Pending Request Classroom",
        handle: "Pending_Request_Classroom",
        ownerId: testUserId,
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
      .get(`/api/classroom/${classroom.id}/details`)
      .set("Authorization", `Bearer ${testToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty("isPendingRequest", true);
  });

  test("User already a member should have isPendingRequest: false", async () => {
    const classroom = await prisma.classroom.create({
      data: {
        classroomName: "Member Classroom",
        handle: "Member_Classroom",
        ownerId: testUserId,
      },
    });

    await prisma.classroomsMembers.create({
      data: {
        classroomId: classroom.id,
        userId: testUserId,
        memberShipStatus: "approved",
      },
    });

    const response = await request(app)
      .get(`/api/classroom/${classroom.id}/details`)
      .set("Authorization", `Bearer ${testToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty("isPendingRequest", false);
  });

  test("Check Classroom Name - Exists", async () => {
    // Create a classroom with a specific name
    await prisma.classroom.create({
      data: {
        classroomName: "Existing Classroom",
        handle: "Existing_Handle",
        description: "A classroom to test name existence",
        ownerId: testUserId,
      },
    });

    const response = await request(app)
      .get("/api/classroom/check-name/Existing%20Classroom") // Pass name as URL parameter
      .set("Authorization", `Bearer ${testToken}`);

    expect(response.status).toBe(409);
    expect(response.body.error).toBe("The name already exists");
  });

  test("Check Classroom Name - Does Not Exist", async () => {
    const response = await request(app)
      .get("/api/classroom/check-name/Nonexistent%20Classroom") // Pass name as URL parameter
      .set("Authorization", `Bearer ${testToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data.exists).toBe(false);
  });

  // test("Check Classroom Name - Missing Parameter", async () => {
  //   const response = await request(app)
  //     .get("/api/classroom/check-name/") // No parameter in URL
  //     .set("Authorization", `Bearer ${testToken}`);
  //
  //   expect(response.status).toBe(400);
  //   expect(response.body.error).toBe("Classroom name is required");
  // });

  test("Check Classroom Handle - Exists", async () => {
    await prisma.classroom.deleteMany({
      where: { handle: "Existing_Handle" },
    });

    await prisma.classroom.create({
      data: {
        classroomName: "Another Classroom",
        handle: "Existing_Handle",
        description: "A classroom to test handle existence",
        ownerId: testUserId,
      },
    });

    const response = await request(app)
      .get("/api/classroom/check-handle/Existing_Handle") // Pass handle as URL parameter
      .set("Authorization", `Bearer ${testToken}`);

    expect(response.status).toBe(409);
    expect(response.body.error).toBe("The Community Handle already exists");
  });

  test("Check Classroom Handle - Does Not Exist", async () => {
    const response = await request(app)
      .get("/api/classroom/check-handle/Nonexistent_Handle") // Pass handle as URL parameter
      .set("Authorization", `Bearer ${testToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data.exists).toBe(false);
  });

  // test("Check Classroom Handle - Missing Parameter", async () => {
  //   const response = await request(app)
  //     .get("/api/classroom/check-handle/") // No parameter in URL
  //     .set("Authorization", `Bearer ${testToken}`);
  //
  //   expect(response.status).toBe(400);
  //   expect(response.body.error).toBe("Classroom Handle is required");
  // });
});
