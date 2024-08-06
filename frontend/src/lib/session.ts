import { SessionOptions } from "iron-session";

export interface SessionUser {
  id: number;
  name: string;
  email: string;
  activated: boolean;
  created_at: string; // time
}

export const EmptyUser: SessionUser = {
  id: 0,
  name: "",
  email: "",
  activated: false,
  created_at: "",
};

export interface SessionData {
  user: SessionUser;
  authentication_token: string;
}

export const DefaultSession: SessionData = {
  authentication_token: "",
  user: EmptyUser,
};

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_PASSWORD!,
  cookieName: "auth-session",
  cookieOptions: {
    httpOnly: true,
    // Secure only works in `https` environments. So if the environment is `https`, it'll return true.
    secure: process.env.NODE_ENV === "production",
  },
};
