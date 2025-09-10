// api/v1/project

import { NextRequest, NextResponse } from "next/server";
import { config } from "@/lib/config";
import { Query } from "node-appwrite";
import { getVerifiedUser } from "../../utility/getVerifiedUser";
import { tablesDbServer } from "@/lib/appwrite-server/index";

/** PUBLISH PROJECT USING ID */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data: { configs: string; chHandle: string; theme: string } =
      body.data;
    const rowId: string = body.rowId;

    if (!data || !rowId) {
      throw new Error("Invalid Params");
    }

    const ALLOWED_UPDATE_FIELDS = new Set(["configs", "chHandle", "theme"]);
    // Get the keys from the incoming data object
    const receivedKeys = Object.keys(data);

    // Check if every received key is in our allowlist
    const isValidOperation = receivedKeys.every((key) =>
      ALLOWED_UPDATE_FIELDS.has(key)
    );

    if (!isValidOperation) {
      throw new Error("Publish failed: payload contains disallowed fields.");
    }

    /** check if channel handle is available */
    const rowsChHandle = await tablesDbServer.listRows({
      databaseId: config.APPWRITE_DATABASE_ID,
      tableId: config.APPWRITE_TABLE_ID,
      queries: [Query.equal("chHandle", data.chHandle)],
    });

    if (rowsChHandle.total > 0) {
      throw new Error("Handle already taken!");
    }

    // authorization
    const result = await getVerifiedUser(request);
    if (!result || !result.data) {
      // user is unauthorized:
      throw new Error(result.message);
    }

    const { user } = result.data;

    // check if request is from same authorized user:
    const rowsResult = await tablesDbServer.listRows({
      databaseId: config.APPWRITE_DATABASE_ID,
      tableId: config.APPWRITE_TABLE_ID,
      queries: [
        Query.and([
          Query.equal("$id", rowId),
          Query.equal("user_id", user.$id),
        ]),
      ],
    });

    if (rowsResult.total <= 0) {
      // this means some different auth user is trying to update other user project
      throw new Error("Operation Not Allowed");
    }

    /** check if user has already verified this project:
     * currently not in use
     * UNCOMMENT IN ACTUAL PRODUCTION */
    // if (!rowsResult.rows[0].verified) {
    //     throw new Error("USER IS NOT VERIFIED")
    // }

    const res = await tablesDbServer.updateRow({
      databaseId: config.APPWRITE_DATABASE_ID,
      tableId: config.APPWRITE_TABLE_ID,
      rowId: rowId,
      data: {
        ...data,
      },
    });
    return NextResponse.json(
      {
        success: true,
        data: res,
        message: "update success",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: (error as Error).message,
      },
      { status: 401 }
    );
  }
}
