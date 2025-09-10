import { create } from "zustand";
import { Models } from "appwrite";
import { ChannelDataType, ConfigurationType } from "@/types";

interface MyStoreState {
  user: null | false | Models.User<Models.Preferences>;
  setUser: (status: null | false | Models.User<Models.Preferences>) => void;
  userProjects: {
    id: string;
    user_id: string;
    title: string;
    channelId: string;
    channelImage: string;
    verified: boolean | null;
    configs: string;
    chHandle: string;
  }[];
  setUserProjects: (
    data: {
      id: string;
      user_id: string;
      title: string;
      channelId: string;
      channelImage: string;
      verified: boolean | null;
      configs: string;
      chHandle: string;
    }[]
  ) => void;
  currentConfig: ConfigurationType | null;
  setCurrentConfig: (cf: ConfigurationType) => void;
  currentChannelData: ChannelDataType | null;
  setCurrentChannelData: (cd: ChannelDataType) => void;
}

export const useMyStore = create<MyStoreState>()((set) => ({
  user: null,
  setUser: (status) => set({ user: status }),
  userProjects: [],
  setUserProjects: (
    data: {
      id: string;
      user_id: string;
      title: string;
      channelId: string;
      channelImage: string;
      verified: boolean | null;
      configs: string;
      chHandle:string
    }[]
  ) => set({ userProjects: data }),
  currentConfig: null,
  setCurrentConfig: (cf: ConfigurationType) => set({ currentConfig: cf }),
  currentChannelData: null,
  setCurrentChannelData: (cd: ChannelDataType) =>
    set({ currentChannelData: cd }),
}));
