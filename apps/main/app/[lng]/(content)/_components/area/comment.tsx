"use client";

import { LanguagesType } from "@repo/i18n";
import { UserDTO } from "@repo/types";

import { AreaBySlug } from ".";

export default function AreaComment({
  lng,
  area,
  session,
}: {
  lng: LanguagesType;
  area: AreaBySlug;
  session: UserDTO;
}) {
  const { area: foundArea } = area ?? {};

  const { medias } = foundArea;

  return <div className="sticky top-0">ss</div>;
}
