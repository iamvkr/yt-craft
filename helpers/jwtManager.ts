import { account } from "@/lib/appwrite";
import { jwtDecode } from "jwt-decode";

const STORAGE_KEY = "JWT";

export async function getJwt() {
  let jwt = localStorage.getItem(STORAGE_KEY);

  if (jwt && !isExpired(jwt)) {
    return jwt;
  }

  // If expired or missing, refresh
  try {
    const newJwt = await account.createJWT();
    localStorage.setItem(STORAGE_KEY, newJwt.jwt);
    return newJwt.jwt;
  } catch (error) {
    // user is probably not loggedin
    return false;
  }
}

function isExpired(token: string) {
  try {
    const decoded = jwtDecode(token);
    const now = Math.floor(Date.now() / 1000);
    return decoded && decoded.exp ? decoded.exp < now : false;
  } catch (e) {
    return true; // if decode fails, treat as expired
  }
}
