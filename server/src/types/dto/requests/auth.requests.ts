/**
 * User registration request DTO
 */
export interface RegisterUserRequest {
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

/**
 * User login request DTO
 */
export interface LoginRequest {
  username: string;
  password: string;
}

/**
 * Token refresh request DTO
 */
export interface RefreshTokenRequest {
  refreshToken: string;
}
