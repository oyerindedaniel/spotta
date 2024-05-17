"use client";

import { useRouter } from "next/navigation";
import { Session as SessionType } from "@prisma/client";
import { ReloadIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";

import { useSessionStore } from "@repo/hooks/src/use-session-store";
import { LanguagesType } from "@repo/i18n";
import { api } from "@repo/trpc/src/react";
import { Badge, Button, useToast } from "@repo/ui";

const Session = ({ session }: { session: SessionType; lng: LanguagesType }) => {
  const router = useRouter();
  const { toast } = useToast();

  const {
    data: { sessionId: userSessionId },
  } = useSessionStore();

  const mutateSession = api.user.updateSession.useMutation({
    onSuccess: () => {
      router.refresh();
      toast({
        variant: "success",
        description: "Session deactivation successful",
      });
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

  const userCurrentSession = session.id === userSessionId;

  return (
    <div
      key={session.id}
      className="rounded-xl border border-[#0B153A] px-4 py-3 shadow-md dark:border-brand-blue"
    >
      <div className="mb-2 flex items-center justify-between font-semibold">
        <div className="flex items-center gap-5">
          {session?.os && <span className="text-sm">{session.os}</span>}
          {userCurrentSession && <Badge variant="success">Active</Badge>}
        </div>

        {session?.browser && <span className="text-sm">{session.browser}</span>}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm">
          {format(new Date(session.createdAt), "dd MMM yyyy HH:mm:ss")}
        </span>
        <Button
          onClick={() =>
            mutateSession.mutate({
              sessionId: session.id,
            })
          }
          type="button"
          size="xs"
          variant="destructive"
          disabled={mutateSession.isPending || userCurrentSession}
        >
          {mutateSession.isPending && (
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
          )}
          Deactivate
        </Button>
      </div>
    </div>
  );
};

export default Session;
