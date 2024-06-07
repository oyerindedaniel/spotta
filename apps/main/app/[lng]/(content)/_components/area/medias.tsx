"use client";

import { LanguagesType } from "@repo/i18n";
import { UserDTO } from "@repo/types";
import { BlurImage } from "@repo/ui";

import { AreaBySlug } from ".";

export default function AreaMedias({
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
    <div className="sticky top-0 grid w-full grid-cols-2 grid-rows-[225px_225px] gap-3 self-start">
      {medias.slice(0, 3).map((media) => (
        <BlurImage src={media.src} alt="image" className="object-cover" fill />
      ))}
      {medias && medias.length > 3 && (
        <BlurImage
          src={medias[3]?.src!}
          parentProps={{ className: "group" }}
          alt="image"
          className="object-cover"
          fill
        >
          <div className="absolute inset-0 z-10 flex cursor-pointer items-center justify-center bg-black/70 text-sm uppercase text-white transition-all group-hover:scale-105 group-hover:font-semibold">
            <span>View more</span>
          </div>
        </BlurImage>
      )}
    </div>
  );
}
