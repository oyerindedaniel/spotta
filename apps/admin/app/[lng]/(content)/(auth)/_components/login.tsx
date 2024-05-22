"use client";

import { useEffect } from "react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Icons } from "@/assets";
import { useModal } from "@/hooks/use-modal-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthService, User } from "@prisma/client";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useSessionStore } from "@repo/hooks/src/use-session-store";
import { LanguagesType, useClientTranslation } from "@repo/i18n";
import { api } from "@repo/trpc/src/react";
import {
  AuthSeparator,
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  GithubButton,
  GoogleButton,
  Input,
  useToast,
} from "@repo/ui";
import { generateAndValidateState } from "@repo/utils";
import { loginSchema } from "@repo/validations";

type LoginType = z.infer<typeof loginSchema>;

export default function Login({
  lng,
  session,
}: {
  lng: LanguagesType;
  session: User | null;
}): JSX.Element {
  const router = useRouter();

  const { setData } = useSessionStore();

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { toast } = useToast();

  const { onOpen } = useModal();

  const { validate } = generateAndValidateState();

  const code = searchParams?.get?.("code");
  const authService = searchParams
    ?.get?.("authService")
    ?.toUpperCase() as AuthService;

  const state = searchParams?.get?.("state"); // For OAuth
  const redirectUrl = searchParams?.get?.("redirectUrl");

  const { isValid, redirectUrl: redirectUrlState } = validate(state ?? "");

  const { t, i18n } = useClientTranslation({ lng });

  const mutateLogin = api.auth.login.useMutation({
    onSuccess: ({ data }) => {
      const { isConfirmed, email, refreshToken, sessionId, ttl } = data;
      form.reset();
      if (isConfirmed) {
        router.push(redirectUrl ?? "/");
      } else {
        onOpen({
          type: "emailConfirmation",
          data: { emailConfirmation: email },
        });
      }
      router.refresh();
      setData({ refreshToken, sessionId, ttl });
      toast({
        variant: "success",
        description: "Login successful",
      });
    },
    onError: (error) => {
      console.error(error);
      toast({
        variant: "destructive",
        description: error?.message,
      });
      router.refresh();
    },
  });

  const mutateGoogleOauthLogin = api.user.googleoauth.useMutation({
    onSuccess: ({ data }) => {
      const { refreshToken, sessionId, ttl } = data;
      form.reset();
      toast({
        variant: "success",
        description: "Login successful",
      });
      router.push(redirectUrlState ?? "/");
      router.refresh();
      setData({ refreshToken, sessionId, ttl });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        description: error?.message,
      });
      console.error(error);
      router.refresh();
    },
  });

  const mutateGithubOauthLogin = api.user.githuboauth.useMutation({
    onSuccess: ({ data }) => {
      const { refreshToken, sessionId, ttl } = data;
      form.reset();
      toast({
        variant: "success",
        description: "Login successful",
      });
      router.push(redirectUrlState ?? "/");
      router.refresh();
      setData({ refreshToken, sessionId, ttl });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        description: error?.message,
      });
      console.error(error);
      router.refresh();
    },
  });

  const form = useForm<LoginType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginType) => {
    mutateLogin.mutate({ ...data, asRole: "ADMIN" });
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!code || !isValid) return;

      if (authService === "GOOGLE") {
        mutateGoogleOauthLogin.mutate({ code, asRole: "ADMIN" });
      }

      if (authService === "GITHUB") {
        mutateGithubOauthLogin.mutate({ code, asRole: "ADMIN" });
      }
    }
  }, [pathname, code, isValid, authService]);

  const isPending =
    mutateGithubOauthLogin.isPending ||
    mutateGoogleOauthLogin.isPending ||
    mutateLogin.isPending;

  return (
    <div className="mx-auto my-6 w-full max-w-[26rem] rounded-lg bg-brand-plain p-4 px-5 shadow-md">
      <h5 className="mb-6 text-center text-xl font-medium">Sign In</h5>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full max-w-[600px] flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter email address"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="password" placeholder="Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className="mt-6 w-full text-base uppercase"
            type="submit"
            size="lg"
            disabled={isPending}
          >
            {mutateLogin.isPending && (
              <ReloadIcon className="mr-2 h-5 w-5 animate-spin" />
            )}
            {mutateLogin.isPending ? "Signing in" : "Sign In"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpen({ type: "forgotPassword" })}
          >
            Forgot Password
          </Button>
          <AuthSeparator>{"Or"}</AuthSeparator>
          <GoogleButton
            className="border border-gray-300 bg-transparent shadow-sm dark:border-white"
            isLoading={isPending}
          >
            <Image
              alt="Google"
              className="mr-3"
              height={25}
              src={Icons.google}
              width={25}
            />
            {mutateGoogleOauthLogin.isPending ? (
              <span className="flex">
                <ReloadIcon className="mr-2 h-5 w-5 animate-spin" />
                <span>Signing in with Google</span>
              </span>
            ) : (
              "Log in with Google"
            )}
          </GoogleButton>
          <GithubButton
            className="border border-gray-300 bg-transparent shadow-sm dark:border-white"
            isLoading={isPending}
          >
            <span className="mr-3 inline-block">
              <Image
                alt="Github"
                className="block dark:hidden"
                height={30}
                src={Icons.github}
                width={30}
              />
              <Image
                alt="Github"
                className="hidden dark:block"
                height={30}
                src={Icons.githubDark}
                width={30}
              />
            </span>
            {mutateGithubOauthLogin.isPending ? (
              <span className="flex w-full items-center">
                <ReloadIcon className="mr-2 h-5 w-5 animate-spin" />
                <span>Signing in with Github</span>
              </span>
            ) : (
              "Log in with Github"
            )}
          </GithubButton>
        </form>
      </Form>
    </div>
  );
}
