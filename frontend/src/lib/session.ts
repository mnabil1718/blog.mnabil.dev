import { SessionOptions } from "iron-session";

export interface SessionUser {
  id: number;
  name: string;
  email: string;
  activated: boolean;
  created_at: string; // time
}

export interface SessionToken {
  token: string;
  expiry_time: string; //time
}

export const EmptyUser: SessionUser = {
  id: 0,
  name: "",
  email: "",
  activated: false,
  created_at: "",
};

export const EmptyToken: SessionToken = {
  token: "",
  expiry_time: "",
};

export interface SessionData {
  user: SessionUser;
  authentication_token: SessionToken;
}

export const DefaultSession: SessionData = {
  authentication_token: EmptyToken,
  user: EmptyUser,
};

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_PASSWORD!,
  cookieName: "auth-session",
  cookieOptions: {
    maxAge: 24 * 60 * 60, // 24 hours in seconds
    httpOnly: true,
    // Secure only works in `https` environments. So if the environment is `https`, it'll return true.
    secure: process.env.NODE_ENV === "production",
  },
};
