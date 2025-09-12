import { NextRequest, NextResponse } from "next/server";
import Innertube, { type YTNodes } from "youtubei.js";
import { getVerifiedUser } from "../../utility/getVerifiedUser";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const channelId = searchParams.get("channelId");

    if (typeof channelId !== "string") {
      throw new Error("invalid params");
    }

    if (!channelId.trim()) {
      throw new Error("invalid params");
    }

    // authorization
    const result = await getVerifiedUser(request);
    if (!result || !result.data) {
      // user is unauthorized:
      throw new Error(result.message);
    }

    // const { user } = result.data;

    const innertube = await Innertube.create({
      device_category: "desktop",
    });
    if (!innertube) {
      return NextResponse.json({
        success: false,
        message: "Failed",
      });
    }

    const Errors: string[] = [];

    const ch = await innertube.getChannel(channelId);

    let subs = "";
    let vidCounts = "";
    const metadata_parts = (
      (ch.header as YTNodes.PageHeader).content
        ?.metadata as YTNodes.ContentMetadataView
    ).metadata_rows[1].metadata_parts;
    if (metadata_parts) {
      subs = metadata_parts[0]?.text? metadata_parts[0].text.text! : "";
      vidCounts = metadata_parts[1]?.text? metadata_parts[1].text.text! : "0";
    }
    /** get metadata */
    const metadata = {
      title: ch.metadata.title,
      description: ch.metadata.description,
      thumbnail: ch.metadata.thumbnail,
      avatar: ch.metadata.avatar,
      tags: ch.metadata.tags,
      keywords: ch.metadata.keywords,
      url: ch.metadata.url,
      subs,
      vidCounts,
    };

    /** get videos */
    const videos: {
      video_id?: string;
      title?: string;
      description_snippet?: string;
      published?: string;
      view_count?: string;
      short_view_count?: string;
      length_text?: string;
      token?: string;
    }[] = [];
    try {
      const chVids: any = await ch.getVideos(); // eslint-disable-line @typescript-eslint/no-explicit-any
      chVids.current_tab?.content.contents.forEach(
        (element: YTNodes.RichItem | YTNodes.ContinuationItem) => {
          if (element.type === "RichItem") {
            const v = (element as YTNodes.RichItem).content as YTNodes.Video;
            videos.push({
              video_id: v.video_id,
              title: v.title.runs ? v.title.runs[0].text : "",
              description_snippet: v.description_snippet?.text,
              published: v.published?.text,
              view_count: v.view_count?.text,
              short_view_count: v.short_view_count?.text,
              length_text: v.length_text?.text,
            });
          } else if (element.type === "ContinuationItem") {
            const t = element as YTNodes.ContinuationItem;
            videos.push({
              token: t.endpoint.payload.token,
            });
          }
        }
      );
    } catch (error) {
      Errors.push((error as Error).message);
    }

    return NextResponse.json({
      success: true,
      data: {
        metadata,
        videos,
      },
      message: "success fetching user data",
      Errors,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: (error as Error).message,
    });
  }
}
