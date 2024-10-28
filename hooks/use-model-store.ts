import { create } from "zustand";
import { ServerWithMembersWithProfiles } from "@/types";

export type ModelType =
  | "createServer"
  | "invite"
  | "editServer"
  | "members"
  | "createChannel"
  | "leaveServer"
  | "deleteServer";

interface ModelData {
  server?: ServerWithMembersWithProfiles;
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
