import { ReactNode } from "react";
import Link from "next/link";

export const ServerLink = ({
  lng,
  children,
  href,
  prefetch,
  replace,
  className,
  ...rest
}: {
  lng: string;
  href: string;
  children: ReactNode;
  prefetch?: boolean;
  replace?: boolean;
  className?: string;
}) => {
  return (
    <Link
      href={`/${lng}${href}`}
      prefetch={prefetch}
      replace={replace}
      className={className}
      {...rest}
    >
      {children}
    </Link>
  );
};
