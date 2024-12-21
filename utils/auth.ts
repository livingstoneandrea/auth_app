import { jwtVerify } from "jose";

import { getCookie, removeCookie } from "./cookies";

export const isValidToken = async (): Promise<boolean> => {
  const token = getCookie("authToken");
  if (!token) return false;

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "secret");
    const { payload } = await jwtVerify(token, secret);

    const { exp } = payload;
    return Date.now() < exp! * 1000;
  } catch {
    return false;
  }
};

export const logout = () => {
  removeCookie("authToken");
  removeCookie("user");
};
