export interface User {
  userId: string;
  name: string;
  email: string;
  mobileNumber: string;
  accountType: "user" | "agent" | "admin";
  nid: string;
  exp?: number;
  iat?: number;
}

export interface AuthContextType {
  user: User | null;
}
