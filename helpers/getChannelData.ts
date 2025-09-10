import Innertube, { YTNodes } from "youtubei.js";

/** function to get channel data at server especially for sites page */
export const getChannelData = async (channelId: string) => {
  const innertube = await Innertube.create({
    device_category: "desktop",
  });
  if (!innertube) {
    return false;
  }

  const ch = await innertube.getChannel(channelId);

  let subs = "";
  let vidCounts = "";
  const metadata_parts = (
    (ch.header as YTNodes.PageHeader).content
      ?.metadata as YTNodes.ContentMetadataView
  ).metadata_rows[1].metadata_parts;
  if (metadata_parts) {
    subs = metadata_parts[0].text?.text!;
    vidCounts = metadata_parts[1].text?.text!;
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
    const chVids: any = await ch.getVideos();
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

    return {
      metadata,
      videos,
    };
  } catch (error) {
    return false;
  }
};
