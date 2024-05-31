"use client";

import { User } from "@prisma/client";

import { RouterOutputs } from "@repo/api";
import { LanguagesType } from "@repo/i18n";

export default function AreaMedia({
  lng,
  area,
  session,
}: {
  lng: LanguagesType;
  area: RouterOutputs["area"]["findBySlug"]["data"];
  session: User | null;
}) {
  const { area: foundArea } = area ?? {};

  const { medias } = foundArea;

  return <div className="w-[40%]"></div>;
}
