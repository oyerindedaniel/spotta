"use client";

import { useEffect, useState } from "react";

import { EmailConfirmation, ForgotPassword } from "@repo/ui";

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
      <ForgotPassword />
    </>
  );
};
