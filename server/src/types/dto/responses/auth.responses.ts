export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: UserResponse;
}

export interface UserResponse {
  id: number;
  username: string;
  role: string;
  firstName: string | null;
  lastName: string | null;
  bio: string | null;
  avatarImageUrl: string | null; // URL instead of binary data
  backgroundImageUrl: string | null; // URL instead of binary data
}
