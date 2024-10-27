"use client";

import { useEffect, useState } from "react";
import InviteModel from "@/components/models/invite-model";
import EditServerModel from "@/components/models/edit-server-model";
import CreateServerModel from "@/components/models/create-server-model";

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
    </>
  );
};

export default ModelProvider;
