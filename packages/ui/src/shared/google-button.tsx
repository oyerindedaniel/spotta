"use client";

import { cn } from "@/lib/utils";
import { generateAndValidateState, getGoogleUrl } from "@repo/utils";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "..";

interface Props extends React.ComponentProps<typeof Button> {
  isLoading: boolean;
}

export const GoogleButton: React.FC<Props> = ({
  children,
  className,
  isLoading,
  ...rest
}) => {
  const [googleUrl, setGoogleUrl] = useState("");
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const redirectUrl = searchParams?.get?.("redirectUrl") as string;

  const { create } = generateAndValidateState();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setGoogleUrl(getGoogleUrl(create(redirectUrl ?? "/")));
    }
  }, [pathname]);

  return (
    <Button
      type="button"
      className={cn("w-full", className)}
      variant="unstyled"
      size="lg"
      onClick={() => window.location.assign(googleUrl || "")}
      disabled={!googleUrl || isLoading}
      {...rest}
    >
      {children}
    </Button>
  );
};
