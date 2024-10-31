import { create } from "zustand";
import { Channel, ChannelType, Server } from "@prisma/client";

export type ModelType =
  | "createServer"
  | "invite"
  | "editServer"
  | "members"
  | "createChannel"
  | "leaveServer"
  | "deleteServer"
  | "deleteChannel"
  | "editChannel"
  | "messageFile"

interface ModelData {
  server?: Server;
  channelType?: ChannelType;
  channel?: Channel;
  apiUrl?: string;
  query?: Record<string, string>;
}

interface ModelStore {
  type: ModelType | null;
  data: ModelData;
  isOpen: boolean;
  onOpen: (type: ModelType, data?: ModelData) => void;
  onClose: () => void;
}

export const useModelStore = create<ModelStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ type, isOpen: true, data }),
  onClose: () => set({ isOpen: false }),
}));
