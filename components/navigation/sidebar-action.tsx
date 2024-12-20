"use client"

import { Plus } from "lucide-react";

import ActionTooltip from "@/components/action-tooltip";
import { useModelStore } from "@/hooks/use-model-store";

const SidebarAction = () => {
  const {onOpen} = useModelStore()
  return (
    <div>
      <ActionTooltip align="center" side="right" label="Add a server">
        <button className="group flex items-center" onClick={() => onOpen('createServer')}>
          <div className="w-[48px] h-[48px] mx-3 flex items-center justify-center rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden bg-background dark:bg-neutral-700 group-hover:bg-emerald-600">
            <Plus
              size={25}
              className="text-emerald-500 group-hover:text-white transition"
            />
          </div>
        </button>
      </ActionTooltip>
    </div>
  );
};

export default SidebarAction;
