import { cn } from "@/lib/utils";
import type { ImageProps } from "next/image";
import NextImage from "next/image";
import React from "react";

type Props = ImageProps & {
  parentProps?: Pick<React.HTMLAttributes<HTMLDivElement>, "className">;
  children?: React.ReactNode;
};

export const BlurImage: React.FC<Props> = ({
  parentProps,
  children,
  ...imageProps
}: Props) => {
  const [isLoading, setLoading] = React.useState(true);

  return (
    <div
      {...parentProps}
      className={cn(
        "relative flex overflow-hidden rounded-xl bg-white/[2%] after:pointer-events-none after:absolute after:inset-0 after:z-10 after:rounded-xl after:border after:border-rose-200/10 after:content-['']",
        isLoading ? "animate-pulse" : "",
        parentProps?.className,
      )}
    >
      <NextImage
        {...imageProps}
        className={cn(
          "rounded-xl duration-700 ease-in-out",
          isLoading
            ? "scale-[1.02] blur-xl grayscale"
            : "scale-100 blur-0 grayscale-0",
        )}
        onLoadingComplete={() => setLoading(false)}
      />
      {children && !isLoading && <>{children}</>}
    </div>
  );
};
