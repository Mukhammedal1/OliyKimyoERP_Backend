export interface JwtPayload {
  _id: string;
  email: string;
  is_creator: boolean;
}

export type JwtPayloadWithRefreshToken = JwtPayload & { refreshToken: string };
