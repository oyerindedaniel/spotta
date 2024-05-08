"use client";

import Image from "next/image";
import Link from "next/link";
import { redirect, useSearchParams } from "next/navigation";
import { Icons } from "@/assets";
import { cn } from "@/lib/utils";
import { User } from "@prisma/client";
import { BiSolidError } from "react-icons/bi";

import { LanguagesType } from "@repo/i18n";
import { api } from "@repo/trpc/src/react";
import { buttonVariants, Loading } from "@repo/ui";

export default function VerifyEmail({
  lng,
  session,
}: {
  lng: LanguagesType;
  session: User | null;
}): JSX.Element {
  const searchParams = useSearchParams();
  const token = searchParams?.get?.("token") as string;

  if (!token) {
    redirect("/");
  }

  const emailConfirmation = api.user.emailConfirmation.useQuery(
    { token },
    { refetchOnReconnect: false, refetchOnWindowFocus: false, retry: false },
  );

  return (
    <div className="flex flex-col justify-center">
      {emailConfirmation.isPending ? (
        <Loading size="75" description="Confirming your email" />
      ) : emailConfirmation.isError ? (
        <div
          role="alert"
          className="flex flex-col items-center text-destructive dark:text-white"
        >
          <BiSolidError size="75px" fill="currentColor" className="mb-1" />
          <p className="text-md text-center font-medium">
            {emailConfirmation.error.message}
          </p>
        </div>
      ) : (
        <div className="flex flex-col">
          <Image
            alt="Spotta"
            className="mx-auto mb-4"
            height={120}
            src={Icons.verification}
            width={120}
          />
          <span className="mb-4 text-center text-base font-medium">
            Email successfully verified
          </span>
          <Link
            href={session ? `/` : `/login`}
            className={cn(
              "font-semibold uppercase",
              buttonVariants({ size: "sm" }),
            )}
          >
            {session ? "Go to home" : "Login"}
          </Link>
        </div>
      )}
    </div>
  );
}
