"use client";

import Image from "next/image";

import { LanguagesType } from "@repo/i18n";
import { UserDTO } from "@repo/types";

import { AreaBySlug } from ".";

export default function AreaMedia({
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

  return (
    <div className="sticky top-0 grid grid-cols-2 grid-rows-2 gap-3 self-start">
      {medias.slice(0, 3).map((media) => (
        <div className="relative h-48 w-48 overflow-hidden rounded-xl">
          <Image src={media.src} alt="image" className="object-cover" fill />
        </div>
      ))}
      {medias && medias.length > 3 && (
        <div className="group relative h-48 w-48 overflow-hidden rounded-xl">
          <Image
            src={medias[3]?.src!}
            alt="image"
            className="object-cover"
            fill
          />
          <div className="absolute flex h-full w-full cursor-pointer items-center justify-center bg-black/70 text-center text-sm uppercase text-white transition-all group-hover:scale-105 group-hover:font-semibold">
            <span>View more</span>
          </div>
        </div>
      )}
    </div>
  );
}
