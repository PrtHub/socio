"use client";

import { useEffect, useState } from "react";
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
    </>
  );
};

export default ModelProvider;
