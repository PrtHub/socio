"use client";

import { useEffect, useState } from "react";
import InviteModel from "@/components/models/invite-model";
import MembersModel from "@/components/models/members-model";
import EditServerModel from "@/components/models/edit-server-model";
import MessageFileModel from "@/components/models/message-file-model";
import LeaveServerModel from "@/components/models/leave-server-model";
import EditChannelModel from "@/components/models/edit-channel-model";
import CreateServerModel from "@/components/models/create-server-model";
import DeleteServerModel from "@/components/models/delete-server-model";
import CreateChannelModel from "@/components/models/create-channel-model";
import DeleteMessageModel from "@/components/models/delete-message-model";
import DeleteChannelModel from "@/components/models/delete-channel-model";

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
      <LeaveServerModel/>   
      <DeleteServerModel/>
      <DeleteChannelModel/>
      <EditChannelModel/>
      <MessageFileModel/>
      <DeleteMessageModel/>
      </>
  );
};

export default ModelProvider;
