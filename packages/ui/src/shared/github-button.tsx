"use client";

import { cn } from "@/lib/utils";
import { generateAndValidateState, getGithubUrl } from "@repo/utils";
import { useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();
  const redirectUrl = searchParams?.get?.("redirectUrl");

  return (
    <Button
      type="button"
      className={cn("w-full", className)}
      variant="unstyled"
      size="lg"
      onClick={() => {
        const { create } = generateAndValidateState();
        window.location.assign(getGithubUrl(create(redirectUrl ?? "/")) ?? "");
      }}
      disabled={isLoading}
      {...rest}
    >
      {children}
    </Button>
  );
};
