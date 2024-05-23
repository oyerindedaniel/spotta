"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Icons } from "@/assets";
import { cn } from "@/lib/utils";
import { User } from "@prisma/client";

import { useSessionStore } from "@repo/hooks/src/use-session-store";
import { LanguagesType, useClientTranslation } from "@repo/i18n";
import { api } from "@repo/trpc/src/react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  buttonVariants,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  ModeToggle,
  useToast,
} from "@repo/ui";
import {
  assignRedirectUrl,
  getInitials,
  stopTokenRefreshTimer,
} from "@repo/utils";

import { NON_DASHBOARD_PAGES } from "../constants";
import SheetSidebar from "./(dashboard)/_components/layout/sheet-sidebar";

export function Navbar({
  lng,
  session,
}: {
  lng: LanguagesType;
  session: User | null;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  type AuthPage = "login";
  const page = pathname.split("/").at(-1) as AuthPage;

  const {
    data: { refreshToken, ttl },
    updateData,
  } = useSessionStore();

  const { t, i18n } = useClientTranslation({ lng });

  const { firstName, lastName, picture } = session ?? {};

  const mutateLogout = api.auth.logout.useMutation({
    onSuccess: () => {
      router.push("/");
      updateData({ refreshToken: "", sessionId: "", ttl: undefined });
      stopTokenRefreshTimer();
      router.refresh();
      toast({
        variant: "success",
        description: "Logout successful",
      });
    },
    onError: (error) => {
      console.error(error);
      router.refresh();
    },
  });

  return (
    <header
      className={cn(
        "w-full bg-background",
        NON_DASHBOARD_PAGES.includes(pathname) ? "block" : "fixed top-0 z-50",
      )}
    >
      <div className="flex w-full items-center justify-between px-6 py-3 md:px-14">
        <div className="flex items-center gap-4">
          <div className="block md:hidden">
            <SheetSidebar lng={lng} />
          </div>

          <Link href="/">
            <Image
              alt="Spotta"
              className="block dark:hidden"
              height={120}
              priority
              src={Icons.logo}
              width={120}
            />
            <Image
              alt="Spotta"
              className="hidden dark:block"
              height={120}
              priority
              src={Icons.logoDark}
              width={120}
            />
          </Link>
        </div>

        <div className="flex items-center gap-8">
          <ModeToggle />
          <nav>
            <ul>
              <li>
                {session ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild className="cursor-pointer">
                      <Avatar>
                        <AvatarImage
                          className="object-cover"
                          src={picture ?? ""}
                          alt={`@${firstName}`}
                        />
                        <AvatarFallback>
                          {getInitials(`${firstName} ${lastName}`)}
                        </AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem asChild>
                          <Link
                            href="dashboard"
                            className={cn(
                              "w-full cursor-pointer",
                              buttonVariants({
                                size: "xs",
                                variant: "unstyled",
                              }),
                            )}
                          >
                            Dashboard
                            <DropdownMenuShortcut>⇧⌘D</DropdownMenuShortcut>
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Button
                          type="button"
                          onClick={() => mutateLogout.mutate({ refreshToken })}
                          variant="unstyled"
                          size="sm"
                          className="w-full cursor-pointer"
                          disabled={mutateLogout.isPending}
                        >
                          Log out
                          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                        </Button>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <>
                    {page === "login" ? (
                      <span className="font-semibold uppercase text-brand-blue">
                        ADMIN
                      </span>
                    ) : (
                      <Link
                        href={`${assignRedirectUrl({ redirectUrl: `${pathname}`, goToPageUrl: `${lng}/login` })}`}
                        className="font-semibold uppercase text-brand-blue"
                      >
                        login
                      </Link>
                    )}
                  </>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
