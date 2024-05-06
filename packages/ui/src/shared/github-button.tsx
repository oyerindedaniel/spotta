"use client";

import { cn } from "@/lib/utils";
import { generateAndValidateState, getGithubUrl } from "@repo/utils";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "..";

interface Props extends React.ComponentProps<typeof Button> {
  isLoading: boolean;
}

export const GithubButton: React.FC<Props> = ({
  children,
  className,
  isLoading,
  ...rest
}) => {
  const [githubUrl, setGithubUrl] = useState("");
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const redirectUrl = searchParams?.get?.("redirectUrl");

  const { create } = generateAndValidateState();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setGithubUrl(getGithubUrl(create(redirectUrl ?? "/")));
    }
  }, [pathname]);

  return (
    <Button
      type="button"
      className={cn("w-full", className)}
      variant="unstyled"
      size="lg"
      onClick={() => window.location.assign(githubUrl || "")}
      disabled={!githubUrl || isLoading}
      {...rest}
    >
      {children}
    </Button>
  );
};
