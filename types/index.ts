export type ConfigurationType = {
    title: string;
    description: string;
  brandColors: {
    primary: string;
    primaryBackground: string;
  };
  sections: {
    Hero: {
      included: boolean;
      position: number;
      content: {
        title: string;
        subtitle: string;
        subscribeBtn: boolean;
        showSubscriberCount: boolean;
        showVideoCount: boolean;
      };
    };
    Videos: {
      included: boolean;
      position: number;
      title: string;
      cardOptions: {
        showTitle: boolean;
        showDesc: boolean;
        showDate: boolean;
        columns: number;
        shadow: boolean;
        rounded: boolean;
        gap: number;
        paddingTop: number;
        paddingBottom: number;
        backgroundColor: string;
      };
    };
    // Playlists: {
    //   included: boolean;
    //   position: number;
    //   title: string;
    //   cardOptions: {
    //     showTitle: boolean;
    //     showDesc: boolean;
    //     showDate: boolean;
    //     columns: number;
    //     shadow: boolean;
    //     rounded: boolean;
    //     gap: number;
    //     paddingTop: number;
    //     paddingBottom: number;
    //     backgroundColor: string;
    //   };
    // };
    // Lives: {
    //   included: boolean;
    //   position: number;
    //   title: string;
    //   cardOptions: {
    //     showTitle: boolean;
    //     showDesc: boolean;
    //     showDate: boolean;
    //     columns: number;
    //     shadow: boolean;
    //     rounded: boolean;
    //     gap: number;
    //     paddingTop: number;
    //     paddingBottom: number;
    //     backgroundColor: string;
    //   };
    // };
    // Shorts: {
    //   included: boolean;
    //   position: number;
    //   title: string;
    //   cardOptions: {
    //     showTitle: boolean;
    //     showDesc: boolean;
    //     showDate: boolean;
    //     columns: number;
    //     shadow: boolean;
    //     rounded: boolean;
    //     gap: number;
    //     paddingTop: number;
    //     paddingBottom: number;
    //     backgroundColor: string;
    //   };
    // };
    // Posts: {
    //   included: boolean;
    //   position: number;
    //   title: string;
    //   cardOptions: {
    //     showTitle: boolean;
    //     showDesc: boolean;
    //     showDate: boolean;
    //     columns: number;
    //     shadow: boolean;
    //     rounded: boolean;
    //     gap: number;
    //     paddingTop: number;
    //     paddingBottom: number;
    //     backgroundColor: string;
    //   };
    // };
    Contact: {
      included: boolean;
      position: number;
      content: {
        email: string;
        title: string;
      };
    };
    About: {
      included: boolean;
      position: number;
      content: {
        title: string;
        info: string;
      };
    };
  };
//   socialLinks: {
//     youtube: string;
//     twitter: string;
//     instagram: string;
//     facebook: string;
//     tiktok: string;
//     discord: string;
//     twitch: string;
//     linkedin: string;
//     github: string;
//     website: string;
//   };
  socialLink: { type: string; link: string }[];
  showSocialShareButtons: boolean;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
  theme: string;
};

export type ChannelDataType = {
  metadata: {
    title: string;
    description: string;
    thumbnail: {
      url: string;
      width: number;
      height: number;
    }[];
    avatar: {
      url: string;
      width: number;
      height: number;
    }[];
    tags: string[];
    keywords: string;
    url: string;
    subs: string;
    vidCounts: string;
  };
  videos: VideoType[];
  playlists: PlaylistType[];
  shorts: ShortType[];
  lives: {}[];
  posts: {}[];
};

export type VideoType = {
  video_id?: string;
  title?: string;
  description_snippet?: string;
  published?: string;
  view_count?: string;
  short_view_count?: string;
  length_text?: string;
  token?: string;
};
export type PlaylistType = {
  content_id?: string;
  content_image?: string;
  token?: string;
};
export type ShortType = {
  video_id?: string;
  title?: string;
  short_view_count?: string;
  token?: string;
};
