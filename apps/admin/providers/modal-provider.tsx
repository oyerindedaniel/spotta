"use client";

import { useEffect, useState } from "react";
import { EmailConfirmation } from "@/components/modals/email-confirmation";
import { ForgotPassword } from "@/components/modals/forgot-password";

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
