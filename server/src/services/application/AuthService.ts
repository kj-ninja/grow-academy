import { AuthorizationError, ValidationError } from "../../utils/errors";
import {
  generateStreamToken,
  updateStreamUser,
} from "../infrastructure/StreamChannelService";
import bcrypt from "bcryptjs";
import { UserRepository } from "../infrastructure/UserRepository";
import { generateToken, generateRefreshToken, verifyToken } from "../../utils/jwt";

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async registerUser(username: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userRepository.createUser({
      username,
      password: hashedPassword,
    });

    // Generate stream token
    const streamToken = generateStreamToken(user.id);

    // Update user with stream token
    await this.userRepository.updateUser(user.id, { streamToken });
    await updateStreamUser(user);

    return { message: "User registered successfully!" };
  }

  async loginUser(username: string, password: string) {
    const user = await this.userRepository.findUserByUsername(username);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new ValidationError("Invalid credentials", {
        fields: {
          ...(user
            ? { password: "Invalid password" }
            : { username: `Username ${username} doesn't exist` }),
        },
      });
    }

    // Remove the password from the user object
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      streamToken: user.streamToken,
      token: generateToken(user.id),
      refreshToken: generateRefreshToken(user.id),
    };
  }

  async refreshAuthToken(refreshToken: string) {
    const payload = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET!);

    if (!payload) {
      throw new AuthorizationError("Invalid refresh token");
    }

    const user = await this.userRepository.findUserById(payload.userId);

    if (!user) {
      throw new AuthorizationError("User not found");
    }

    return {
      token: generateToken(user.id),
    };
  }

  async validateAuthToken(token: string) {
    const payload = verifyToken(token, process.env.JWT_SECRET!);

    if (!payload) {
      throw new AuthorizationError("Invalid token");
    }

    const user = await this.userRepository.findUserById(payload.userId);

    if (!user) {
      throw new AuthorizationError("User not found");
    }

    return user;
  }
}
