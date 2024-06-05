"use client";

import { ListBulletIcon, ViewGridIcon } from "@radix-ui/react-icons";

import { LanguagesType } from "@repo/i18n";
import { UserSession } from "@repo/types";
import { Button } from "@repo/ui";

export default function ReviewsAction({
  lng,
  session,
}: {
  lng: LanguagesType;
  session: UserSession;
}) {
  return (
    <div className="ml-auto mr-8 flex items-center justify-between gap-2">
      <Button className="border border-brand-blue" variant="ghost" size="icon">
        <ViewGridIcon />
      </Button>
      <Button className="border border-brand-blue" variant="ghost" size="icon">
        <ListBulletIcon />
      </Button>
    </div>
  );
}
