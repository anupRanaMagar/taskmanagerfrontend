import { jwtDecode } from "jwt-decode";

interface DecodedUser {
  id: string;
  name: string;
  email: string;
  exp: number;
  iat: number;
  // Add other fields based on your JWT payload
}

export const session = (): DecodedUser | null => {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;

  try {
    const decodedUser = jwtDecode<DecodedUser>(token);

    // Check if token is expired
    if (decodedUser.exp * 1000 < Date.now()) {
      localStorage.removeItem("accessToken");
      return null;
    }

    return decodedUser;
  } catch (error) {
    console.error("Invalid access token:", error);
    localStorage.removeItem("accessToken");
    return null;
  }
};
