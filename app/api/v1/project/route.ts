// api/v1/project

import { NextRequest, NextResponse } from "next/server";
import { getChannelInfo } from "../../utility/getChannelInfo";
import { config } from "@/lib/config";
import { ID, Query } from "node-appwrite";
import { getVerifiedUser } from "../../utility/getVerifiedUser";
import { tablesDbServer } from "@/lib/appwrite-server/index";

/** CRERATE NEW PROJECT */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const url = body.url;
    if (!url) {
      throw new Error("Missing Url");
    }

    // authorization
    const result = await getVerifiedUser(request);
    if (!result || !result.data) {
      // user is unauthorized:
      throw new Error(result.message);
    }

    const { user } = result.data;

    // get channel data using provide url:
    const channeldata = await getChannelInfo(url);
    if (!channeldata) {
      throw new Error("Failed to get channel info");
    }

    // TODO: check if already a project with same channel id exist:

    // TODO: check if free user already have one project! if so prevent from creating a new project

    // now with this info create a new collection via admin client:
    const userId = user.$id;
    const res = await tablesDbServer.createRow({
      databaseId: config.APPWRITE_DATABASE_ID,
      tableId: config.APPWRITE_TABLE_ID,
      rowId: ID.unique(),
      data: {
        user_id: userId,
        title: channeldata.title,
        channelImage: channeldata.channelImage,
        theme: "default",
        configs: "",
        verified: false,
        channelId: channeldata.channelId,
      },
    });
    return NextResponse.json({
      success: true,
      data: {
        id: res.$id,
        user_id: userId,
        title: channeldata.title,
        channelId: channeldata.channelId,
        channelImage: channeldata.channelImage,
        configs: "",
      },
      message: "new project created successfully",
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: (error as Error).message,
    });
  }
}

/** UPDATE PROJECT BY ID */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const data = body.data;
    const rowId: string = body.rowId;    

    if (!data || !rowId) {
      throw new Error("Invalid Params");
    }

    const ALLOWED_UPDATE_FIELDS = new Set(["configs", "chHandle","theme"]);
    // Get the keys from the incoming data object
    const receivedKeys = Object.keys(data);

    // Check if every received key is in our allowlist
    const isValidOperation = receivedKeys.every((key) =>
      ALLOWED_UPDATE_FIELDS.has(key)
    );

    if (!isValidOperation) {
      throw new Error("Update failed: payload contains disallowed fields.");
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
      throw new Error("No items found");
    }

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

/** DELETE PROJECT BY ID */
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const rowId: string = body.rowId;

    if (!rowId) {
      throw new Error("Invalid Params");
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
      throw new Error("No items found");
    }

    const res = await tablesDbServer.deleteRow({
      databaseId: config.APPWRITE_DATABASE_ID,
      tableId: config.APPWRITE_TABLE_ID,
      rowId: rowId,
    });
    return NextResponse.json(
      {
        success: true,
        data: res,
        message: "delete success",
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
