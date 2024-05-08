"use client";

import { useEffect, useState } from "react";
import { EmailConfirmation } from "@/components/modals/email-confirmation";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <EmailConfirmation />
    </>
  );
};
