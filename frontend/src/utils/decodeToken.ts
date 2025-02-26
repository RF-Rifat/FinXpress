import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  userId: string;
  accountType: string;
  exp: number;
  iat: number;
}

export const decodeToken = (token: string): DecodedToken | null => {
  try {
    const decoded: DecodedToken = jwtDecode(token);
    return decoded;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};
