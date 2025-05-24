import { Prisma, PrismaClient, type User } from "@prisma/client";
import { ConflictError, NotFoundError } from "../../utils/errors";

export class UserRepository {
  private prisma: PrismaClient;

  constructor(prisma = new PrismaClient()) {
    this.prisma = prisma;
  }

  // todo: replace any with proper type
  async createUser(data: { username: string; password: string }) {
    try {
      return await this.prisma.user.create({
        data,
      });
    } catch (error) {
      // handle infrastructure-specific errors
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002" &&
        Array.isArray(error.meta?.target) &&
        error.meta.target.includes("username")
      ) {
        throw new ConflictError("Username already exists", {
          fields: { username: `Username ${data.username} already exists` },
        });
      }
      throw error;
    }
  }

  async updateUser(id: number, data: Partial<User>) {
    try {
      return await this.prisma.user.update({
        where: { id },
        data,
        omit: { password: true },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new NotFoundError("User");
        }
      }
      throw error;
    }
  }

  async getUserProfile(username: string) {
    const user = await this.prisma.user.findUnique({
      omit: { password: true },
      where: { username },
    });

    if (!user) {
      throw new NotFoundError("User");
    }

    const ownedClassroomCount = await this.prisma.classroom.count({
      where: { ownerId: user.id },
    });

    return {
      ...user,
      ownedClassroomCount,
    };
  }

  async getCurrentUser(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      omit: { password: true },
    });
    if (!user) {
      throw new NotFoundError("User");
    }
    return user;
  }

  async findUserByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }

  async findUserById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      omit: { password: true },
    });
  }
}
