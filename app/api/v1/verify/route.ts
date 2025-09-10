// api/v1/verify

import { NextRequest, NextResponse } from "next/server";
import { config } from "@/lib/config";
import { getVerifiedUser } from "../../utility/getVerifiedUser";
import { tablesDbServer } from "@/lib/appwrite-server";
import Innertube, { YTNodes } from "youtubei.js";

/** VERIFY TOKEN */
export async function POST(request: NextRequest) {
  try {
    const result = await getVerifiedUser(request);
    if (!result || !result.data) {
      // user is unauthorized:
      return NextResponse.json(
        {
          success: false,
          message: result.message,
        },
        { status: 401 }
      );
    }

    // const { user } = result.data;

    const body = await request.json();
    const code: string = body.code;
    const channelId: string = body.channelId;
    const docId: string = body.docId;
    if (!code || !channelId || !docId) {
      return NextResponse.json({
        success: false,
        message: "Missing params",
      });
    }

    // now get the latest video of channel?:
    const innertube = await Innertube.create({
      device_category: "desktop",
    });
    if (!innertube) {
      return NextResponse.json({
        success: false,
        message: "Failed",
      });
    }

    const playlistInfo = await innertube.getPlaylist(
      channelId.replace("UC", "UULF")
    );
    const videos = playlistInfo.items;
    // use latest video
    const videoId = (videos[0] as YTNodes.PlaylistVideo).id;
    //   fetch video desc:
    const info = await innertube.getBasicInfo(videoId);
    const desc = info.basic_info.short_description;

    // check if verification code includes in desc:
    if (!desc?.includes(code)) {
      return NextResponse.json({
        success: false,
        message: "Verification failed",
      });
    }

    // now update project status via admin client:
    const res = await tablesDbServer.updateRow({
      databaseId: config.APPWRITE_DATABASE_ID,
      tableId: config.APPWRITE_TABLE_ID,
      rowId: docId,
      data: {
        verified: true,
      },
    });

    if (!res) {
      return NextResponse.json({
        success: false,
        message: "Failed to verify",
      });
    }

    return NextResponse.json({
      success: true,
      message: "verified!!",
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: (error as Error).message,
    });
  }
}
