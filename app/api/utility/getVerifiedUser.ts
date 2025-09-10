import { AppwriteServer } from "@/lib/appwrite-server";
import { NextRequest } from "next/server";
import { Models } from "node-appwrite";

/** This method checks if the incomming request is from a loggedin user, using bearer token generated when user signs in */
export const getVerifiedUser = async (
  request: NextRequest
): Promise<{
  success: boolean;
  message: string;
  data?: {
    user: Models.User<{
      [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
    }>;
    appwrite: AppwriteServer;
  };
}> => {
  const appwrite = new AppwriteServer();
  const { client, account } = appwrite;

  // Get the token from the Authorization header
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return {
      success: false,
      message: "Unauthorized: No token provided",
    };
  }

  client.setJWT(token);

  try {
    const user = await account.get(); // If this works, the token is valid
    return {
      success: true,
      data: {
        user,
        appwrite,
      },
      message: "user is authorized for request",
    };
  } catch (error) {
    return {
      success: false,
      message:
        "Unauthorized: Invalid or expired token" + (error as Error).message,
    };
  }
};
