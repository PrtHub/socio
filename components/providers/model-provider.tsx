"use client";

import { useEffect, useState } from "react";
import InviteModel from "@/components/models/invite-model";
import MembersModel from "@/components/models/members-model";
import EditServerModel from "@/components/models/edit-server-model";
import CreateServerModel from "@/components/models/create-server-model";
import CreateChannelModel from "@/components/models/create-channel-model";

const ModelProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <CreateServerModel />
      <InviteModel/>
      <EditServerModel/>
      <MembersModel/>
      <CreateChannelModel/>
    </>
  );
};

export default ModelProvider;
