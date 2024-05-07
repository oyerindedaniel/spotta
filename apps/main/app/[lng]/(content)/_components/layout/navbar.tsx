"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Icons } from "@/assets";
import { User } from "@prisma/client";

import { LanguagesType, useClientTranslation } from "@repo/i18n";
import { api } from "@repo/trpc/src/react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
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
import { assignRedirectUrl, getInitials } from "@repo/utils";

type AuthPage = "login" | "register";

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

  const { t, i18n } = useClientTranslation({ lng });

  const page = pathname.split("/").at(-1) as AuthPage;

  const resolvedLanguage = i18n.resolvedLanguage;

  const { firstName, lastName, picture } = session ?? {};

  const mutateLogout = api.auth.logout.useMutation({
    onSuccess: () => {
      router.push("/");
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
    <header>
      <div className="mb-6 flex w-full items-center justify-between px-6 py-3 md:px-14">
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
                        <DropdownMenuItem>
                          Profile
                          <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Button
                          type="button"
                          onClick={() => mutateLogout.mutate()}
                          variant="unstyled"
                          size="sm"
                          className="w-full cursor-pointer"
                        >
                          Log out
                          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                        </Button>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link
                    href={
                      page === "login"
                        ? `${assignRedirectUrl({ redirectUrl: `${pathname}`, goToPageUrl: `${lng}/register` })}`
                        : `${assignRedirectUrl({ redirectUrl: `${pathname === `/${lng}/register` ? "/" : pathname}`, goToPageUrl: `${lng}/login` })}`
                    }
                    className="font-semibold uppercase text-brand-blue"
                  >
                    {page === "login" ? "Register" : "Login"}
                  </Link>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
