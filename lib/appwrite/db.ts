import { Models, Query } from "appwrite";
import { tablesDb } from "./index";
import { config } from "../config";

interface UserProject {
  title: string;
  configs: string;
  theme: "default" | "creative" | "professional";
  channelImage: string;
  verified: boolean;
  channelId: string;
  user_id: string;
  chHandle: string;
}
export type UserProjectType = Models.DefaultRow & UserProject;

export const listProjects = async (userId: string) => {
  try {
    const res = await tablesDb.listRows<UserProjectType>({
      databaseId: config.APPWRITE_DATABASE_ID,
      tableId: config.APPWRITE_TABLE_ID,
      queries: [
        Query.select([
          "title",
          "theme",
          "channelImage",
          "verified",
          "channelId",
          "user_id",
          "configs",
          "chHandle"
        ]),
        Query.equal("user_id", userId),
      ],
    });
    return {
      status: true,
      data: res,
      message: "fetch successfully",
    };
  } catch (error) {
    return { status: false, message: (error as Error).message };
  }
};
