"use client";

import { useEffect, useState } from "react";

export const useInitialRender = () => {
  const [initialRenderComplete, setInitialRenderComplete] =
    useState<boolean>(false);

  useEffect(() => {
    setInitialRenderComplete(true);
  }, []);

  return initialRenderComplete;
};
